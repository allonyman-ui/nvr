import { NextRequest, NextResponse } from 'next/server';
import { getCamerasFromEnv } from '@/lib/nvr-config';

const AGENT_USER_ID = 'dahua-nvr-user';

function handleSync(requestId: string) {
  const cameras = getCamerasFromEnv();
  return {
    requestId,
    payload: {
      agentUserId: AGENT_USER_ID,
      devices: cameras.map((cam) => ({
        id: cam.id,
        type: 'action.devices.types.CAMERA',
        traits: ['action.devices.traits.CameraStream'],
        name: {
          name: cam.name,
          defaultNames: [`Camera ${cam.channel}`],
          nicknames: [cam.name.toLowerCase(), `camera ${cam.channel}`],
        },
        willReportState: false,
        attributes: {
          // go2rtc serves HLS — what Google Home / Nest Hub can play
          cameraStreamSupportedProtocols: ['hls', 'progressive_mp4'],
          cameraStreamNeedAuthToken: false,
          cameraStreamNeedDrmEncryption: false,
        },
        deviceInfo: {
          manufacturer: 'Dahua',
          model: 'IP Camera via go2rtc',
        },
      })),
    },
  };
}

function handleQuery(requestId: string, deviceIds: string[]) {
  const devices: Record<string, object> = {};
  for (const id of deviceIds) {
    devices[id] = { status: 'SUCCESS', online: true };
  }
  return { requestId, payload: { devices } };
}

function handleExecute(requestId: string, commands: Array<{ devices: Array<{ id: string }>; execution: Array<{ command: string }> }>) {
  const cameras = getCamerasFromEnv();
  const go2rtcBase = process.env.GO2RTC_BASE_URL || '';
  const results: object[] = [];

  for (const command of commands) {
    for (const device of command.devices) {
      const cam = cameras.find((c) => c.id === device.id);
      if (!cam) {
        results.push({ ids: [device.id], status: 'ERROR', errorCode: 'deviceNotFound' });
        continue;
      }

      // HLS stream URL served by go2rtc
      const streamUrl = `${go2rtcBase}/api/stream.m3u8?src=${cam.streamName}`;

      results.push({
        ids: [cam.id],
        status: 'SUCCESS',
        states: {
          cameraStreamAccessUrl: streamUrl,
          cameraStreamProtocol: 'hls',
          // B48D5C76 is the standard Cast receiver app ID for Nest Hub media player
          cameraStreamReceiverAppId: 'B48D5C76',
          cameraStreamAuthToken: '',
          cameraStreamImageUrl: '',
        },
      });
    }
  }

  return { requestId, payload: { commands: results } };
}

export async function POST(req: NextRequest) {
  // Validate bearer token issued during account linking
  const authHeader = req.headers.get('authorization') ?? '';
  const expectedToken = process.env.OAUTH_ACCESS_TOKEN ?? '';

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.GO2RTC_BASE_URL) {
    console.error('[smart-home] GO2RTC_BASE_URL is not set');
  }

  const body = await req.json();
  const { requestId, inputs } = body as { requestId: string; inputs: Array<{ intent: string; payload?: { devices?: Array<{ id: string }>; commands?: Array<{ devices: Array<{ id: string }>; execution: Array<{ command: string }> }> } }> };

  const input = inputs[0];

  switch (input.intent) {
    case 'action.devices.SYNC':
      return NextResponse.json(handleSync(requestId));

    case 'action.devices.QUERY':
      return NextResponse.json(
        handleQuery(requestId, (input.payload?.devices ?? []).map((d) => d.id))
      );

    case 'action.devices.EXECUTE':
      return NextResponse.json(
        handleExecute(requestId, input.payload?.commands ?? [])
      );

    case 'action.devices.DISCONNECT':
      return NextResponse.json({ requestId });

    default:
      return NextResponse.json({ error: 'Unknown intent' }, { status: 400 });
  }
}
