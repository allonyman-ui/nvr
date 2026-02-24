import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';
import { isValidNvrSession } from '@/lib/nvr-auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface EventData {
  camera_name: string;
  timestamp: string;
  description: string;
  motion_score: number;
  has_faces: boolean;
  face_count: number;
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('nvr_session')?.value ?? '';
  if (!isValidNvrSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  const body = (await req.json().catch(() => ({}))) as { events?: EventData[]; hours?: number };
  const events: EventData[] = body.events ?? [];
  const hours = body.hours ?? 12;

  if (events.length === 0) {
    return NextResponse.json({
      overview: 'No activity was recorded during this period. The cameras are monitoring but have not detected any motion.',
      highlights: [],
      timeline: [],
      assessment: 'All quiet — no motion events detected.',
      period: `Last ${hours} hour${hours !== 1 ? 's' : ''}`,
      stats: { totalEvents: 0, faceEvents: 0, totalPeople: 0, cameras: 0 },
    });
  }

  // Group events by camera
  const byCam: Record<string, EventData[]> = {};
  for (const e of events) {
    byCam[e.camera_name] = byCam[e.camera_name] ?? [];
    byCam[e.camera_name].push(e);
  }

  const faceEvents = events.filter((e) => e.has_faces);
  const totalPeople = events.reduce((sum, e) => sum + (e.face_count ?? 0), 0);
  const cameras = Object.keys(byCam);

  // Format events for the prompt
  const eventLines = events
    .map((e) => {
      const time = new Date(e.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const faces = e.has_faces
        ? ` [${e.face_count} person${e.face_count !== 1 ? 's' : ''} visible]`
        : '';
      return `[${e.camera_name}] ${time}: ${e.description}${faces}`;
    })
    .join('\n');

  const prompt =
    `You are summarizing home security camera activity in plain, natural English. ` +
    `Here are all motion detection events from the last ${hours} hour${hours !== 1 ? 's' : ''} ` +
    `across ${cameras.length} camera${cameras.length !== 1 ? 's' : ''} (${cameras.join(', ')}):\n\n` +
    eventLines +
    `\n\nStats: ${events.length} total events, ${totalPeople} people spotted across ${faceEvents.length} events.\n\n` +
    `Write a friendly, readable security summary. Return ONLY valid JSON in this exact shape:\n` +
    `{\n` +
    `  "overview": "2-3 natural sentences summarising the whole period",\n` +
    `  "highlights": ["most important event 1", "most important event 2", "...up to 5 highlights"],\n` +
    `  "timeline": [\n` +
    `    {"period": "Morning / Afternoon / Evening / Night or a specific time like '9–10 AM'", "summary": "what happened"}\n` +
    `  ],\n` +
    `  "assessment": "One sentence overall security assessment"\n` +
    `}\n\n` +
    `Rules:\n` +
    `- Use natural language, not technical jargon (no "motion_score", no "pixels", no camera IDs)\n` +
    `- Be specific about times and what was actually seen\n` +
    `- Focus on people and notable events; skip trivial or duplicate motion blips\n` +
    `- If nothing notable happened, say so clearly\n` +
    `- Keep each highlight to one concise sentence\n` +
    `- Timeline should cover only periods where something happened`;

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1200,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw =
    response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';

  // Extract JSON from response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json({
      overview: raw,
      highlights: [],
      timeline: [],
      assessment: '',
      period: `Last ${hours} hour${hours !== 1 ? 's' : ''}`,
      stats: { totalEvents: events.length, faceEvents: faceEvents.length, totalPeople, cameras: cameras.length },
    });
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as {
      overview?: string;
      highlights?: string[];
      timeline?: Array<{ period: string; summary: string }>;
      assessment?: string;
    };
    return NextResponse.json({
      overview: parsed.overview ?? '',
      highlights: parsed.highlights ?? [],
      timeline: parsed.timeline ?? [],
      assessment: parsed.assessment ?? '',
      period: `Last ${hours} hour${hours !== 1 ? 's' : ''}`,
      stats: { totalEvents: events.length, faceEvents: faceEvents.length, totalPeople, cameras: cameras.length },
    });
  } catch {
    return NextResponse.json({
      overview: raw,
      highlights: [],
      timeline: [],
      assessment: '',
      period: `Last ${hours} hour${hours !== 1 ? 's' : ''}`,
      stats: { totalEvents: events.length, faceEvents: faceEvents.length, totalPeople, cameras: cameras.length },
    });
  }
}
