'use strict';

const express = require('express');
const { randomBytes } = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory auth code store — avoids cookies, which Google's backend never sends
const authCodes = new Map(); // code -> expiry (ms)
setInterval(() => {
  const now = Date.now();
  for (const [code, expiry] of authCodes) {
    if (now > expiry) authCodes.delete(code);
  }
}, 60_000);

// ── Camera config ─────────────────────────────────────────────────────────────
function getCamerasFromEnv() {
  const cameras = [];
  for (let i = 1; i <= 16; i++) {
    const name = process.env[`CAM_${i}_NAME`];
    const streamName = process.env[`CAM_${i}_STREAM`];
    if (!name || !streamName) break;
    cameras.push({ id: `cam_${i}`, channel: i, name, streamName });
  }
  return cameras;
}

// ── Smart Home fulfillment ────────────────────────────────────────────────────
app.post('/api/smart-home', (req, res) => {
  const authHeader = req.headers['authorization'] ?? '';
  const expectedToken = process.env.OAUTH_ACCESS_TOKEN ?? '';

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { requestId, inputs } = req.body;
  const input = inputs[0];

  switch (input.intent) {
    case 'action.devices.SYNC': {
      const cameras = getCamerasFromEnv();
      return res.json({
        requestId,
        payload: {
          agentUserId: 'dahua-nvr-user',
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
      });
    }

    case 'action.devices.QUERY': {
      const devices = {};
      for (const d of (input.payload?.devices ?? [])) {
        devices[d.id] = { status: 'SUCCESS', online: true };
      }
      return res.json({ requestId, payload: { devices } });
    }

    case 'action.devices.EXECUTE': {
      const cameras = getCamerasFromEnv();
      const go2rtcBase = process.env.GO2RTC_BASE_URL || '';
      const results = [];

      for (const command of (input.payload?.commands ?? [])) {
        for (const device of command.devices) {
          const cam = cameras.find((c) => c.id === device.id);
          if (!cam) {
            results.push({ ids: [device.id], status: 'ERROR', errorCode: 'deviceNotFound' });
            continue;
          }
          results.push({
            ids: [cam.id],
            status: 'SUCCESS',
            states: {
              cameraStreamAccessUrl: `${go2rtcBase}/api/stream.m3u8?src=${cam.streamName}`,
              cameraStreamProtocol: 'hls',
              cameraStreamReceiverAppId: 'B48D5C76',
              cameraStreamAuthToken: '',
              cameraStreamImageUrl: '',
            },
          });
        }
      }
      return res.json({ requestId, payload: { commands: results } });
    }

    case 'action.devices.DISCONNECT':
      return res.json({ requestId });

    default:
      return res.status(400).json({ error: 'Unknown intent' });
  }
});

// ── OAuth Authorize ───────────────────────────────────────────────────────────
app.get('/api/oauth/authorize', (req, res) => {
  const { client_id, redirect_uri, state } = req.query;

  if (client_id !== process.env.OAUTH_CLIENT_ID) {
    return res.status(401).json({ error: 'invalid_client' });
  }

  if (!redirect_uri || !state) {
    return res.status(400).json({ error: 'invalid_request' });
  }

  const authCode = randomBytes(16).toString('hex');
  authCodes.set(authCode, Date.now() + 120_000); // valid for 2 minutes

  const url = new URL(redirect_uri);
  url.searchParams.set('code', authCode);
  url.searchParams.set('state', state);

  return res.redirect(url.toString());
});

// ── OAuth Token ───────────────────────────────────────────────────────────────
app.post('/api/oauth/token', (req, res) => {
  const { grant_type, client_id, client_secret, code, refresh_token } = req.body;

  if (
    client_id !== process.env.OAUTH_CLIENT_ID ||
    client_secret !== process.env.OAUTH_CLIENT_SECRET
  ) {
    return res.status(401).json({ error: 'invalid_client' });
  }

  if (grant_type === 'authorization_code') {
    const expiry = authCodes.get(code);
    if (!expiry || Date.now() > expiry) {
      return res.status(400).json({ error: 'invalid_grant' });
    }
    authCodes.delete(code); // single-use
    return res.json({
      access_token: process.env.OAUTH_ACCESS_TOKEN,
      token_type: 'Bearer',
      expires_in: 315360000, // ~10 years — never expires for personal use
    });
  }

  if (grant_type === 'refresh_token') {
    if (refresh_token !== process.env.OAUTH_ACCESS_TOKEN) {
      return res.status(400).json({ error: 'invalid_grant' });
    }
    return res.json({
      access_token: process.env.OAUTH_ACCESS_TOKEN,
      token_type: 'Bearer',
      expires_in: 315360000,
    });
  }

  return res.status(400).json({ error: 'unsupported_grant_type' });
});

app.listen(PORT, () => {
  console.log(`[smart-home-api] Listening on :${PORT}`);
});
