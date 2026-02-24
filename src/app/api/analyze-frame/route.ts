import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';
import { isValidNvrSession } from '@/lib/nvr-auth';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (!isValidNvrSession(cookieStore.get('nvr_session')?.value ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY missing' }, { status: 500 });

  const body = (await req.json()) as {
    cameraName: string;
    imageBase64: string;
    motionScore: number;
  };
  const { cameraName, imageBase64, motionScore } = body;
  if (!cameraName || !imageBase64) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = createServerClient();

  // Upload image to Supabase Storage
  const imgBuffer = Buffer.from(imageBase64, 'base64');
  const fileName = `${cameraName.replace(/\s+/g, '-').toLowerCase()}/${Date.now()}.jpg`;
  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from('camera-captures')
    .upload(fileName, imgBuffer, { contentType: 'image/jpeg', upsert: false });

  const imagePath = uploadErr ? null : uploadData?.path ?? null;

  // Analyze with Claude
  const client = new Anthropic({ apiKey });
  const prompt =
    `You are analyzing a security camera feed for the camera named "${cameraName}". ` +
    `Describe what you see in 1–2 sentences, focusing on people, vehicles, animals, or any activity. ` +
    `Also respond with: are there any human faces clearly visible? If yes, approximately how many? ` +
    `Reply in this exact JSON format: ` +
    `{"description":"<what you see>","hasFaces":<true|false>,"faceCount":<number>}`;

  let description = 'Motion detected.';
  let hasFaces = false;
  let faceCount = 0;

  try {
    const resp = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
            },
            { type: 'text', text: prompt },
          ],
        },
      ],
    });

    const text = resp.content[0]?.type === 'text' ? resp.content[0].text.trim() : '';
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]) as {
        description?: string;
        hasFaces?: boolean;
        faceCount?: number;
      };
      description = parsed.description ?? description;
      hasFaces = parsed.hasFaces ?? false;
      faceCount = parsed.faceCount ?? 0;
    }
  } catch {
    // Claude failed — still store the event with a fallback description
  }

  // Insert event into activity_events
  const { data: event, error: dbErr } = await supabase
    .from('activity_events')
    .insert({
      camera_name: cameraName,
      description,
      motion_score: motionScore,
      has_faces: hasFaces,
      image_path: imagePath,
      face_count: faceCount,
    })
    .select()
    .single();

  if (dbErr) {
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  return NextResponse.json({ event });
}
