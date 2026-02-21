#!/usr/bin/env bash
# ============================================================
# bootstrap-mac.sh
# Run this ONCE on your Mac mini to create the nvr-setup folder
# with all necessary config files, then runs setup.sh automatically.
#
# Usage (paste the whole block into Terminal):
#   bash ~/bootstrap-mac.sh
# ============================================================
set -euo pipefail

DIR="$HOME/nvr-setup"
mkdir -p "$DIR/cloudflared" "$DIR/smart-home-api"
echo "Creating files in $DIR ..."

# ── go2rtc.yaml ──────────────────────────────────────────────
cat > "$DIR/go2rtc.yaml" <<'YAML'
# go2rtc configuration — 6 Dahua IP cameras
streams:
  deck_nosound:  rtsp://admin:Mobile99@192.168.1.53:554/cam/realmonitor?channel=1&subtype=0
  edna_mike:     rtsp://admin:Mobile99@192.168.1.54:554/cam/realmonitor?channel=1&subtype=0
  bikes:         rtsp://admin:Mobile99@192.168.1.51:554/cam/realmonitor?channel=1&subtype=0
  gina:          rtsp://admin:admin1234@192.168.1.55:554/cam/realmonitor?channel=1&subtype=0
  entrance:      rtsp://admin:Mobile99@192.168.1.50:554/cam/realmonitor?channel=1&subtype=0
  deck_sound:    rtsp://admin:Mobile99@192.168.1.52:554/cam/realmonitor?channel=1&subtype=0

api:
  listen: ":1984"

log:
  level: info
YAML

# ── nginx.conf ───────────────────────────────────────────────
cat > "$DIR/nginx.conf" <<'NGINX'
events {}

http {
  server {
    listen 80;

    # Google Home Smart Home fulfillment
    location = /api/smart-home {
      proxy_pass http://smart-home-api:3001;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }

    # OAuth account linking
    location /api/oauth/ {
      proxy_pass http://smart-home-api:3001;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }

    # Everything else → go2rtc (streams, dashboard)
    location / {
      proxy_pass http://go2rtc:1984;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
    }
  }
}
NGINX

# ── docker-compose.yml ───────────────────────────────────────
cat > "$DIR/docker-compose.yml" <<'YAML'
services:
  go2rtc:
    image: alexxit/go2rtc:latest
    container_name: go2rtc
    restart: always
    networks:
      - nvr
    ports:
      - "1984:1984"
    volumes:
      - ./go2rtc.yaml:/config/go2rtc.yaml:ro
    environment:
      - GO2RTC_CONFIG=/config/go2rtc.yaml

  smart-home-api:
    build: ./smart-home-api
    container_name: smart-home-api
    restart: always
    networks:
      - nvr
    env_file:
      - .env
    environment:
      - GO2RTC_BASE_URL=https://nvr.allonys.com

  nginx:
    image: nginx:alpine
    container_name: nvr-nginx
    restart: always
    networks:
      - nvr
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - go2rtc
      - smart-home-api

  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared
    restart: always
    networks:
      - nvr
    volumes:
      - ./cloudflared/credentials.json:/etc/cloudflared/credentials.json:ro
      - ./cloudflared/config.yml:/etc/cloudflared/config.yml:ro
    command: tunnel --config /etc/cloudflared/config.yml --no-autoupdate run
    depends_on:
      - nginx

networks:
  nvr:
    driver: bridge
YAML

# ── .env.example ─────────────────────────────────────────────
cat > "$DIR/.env.example" <<'ENV'
# Copy this to .env and fill in your values:
#   cp .env.example .env && $EDITOR .env
#
# This file is loaded by the smart-home-api container (see docker-compose.yml).
# The GO2RTC_BASE_URL is set automatically from NVR_HOSTNAME in docker-compose.

# ── OAuth credentials for Google Home account linking ─────────────────────────
OAUTH_CLIENT_ID=dahua-nvr-google-home
OAUTH_CLIENT_SECRET=5141c9b71e96ad456eee1d1b7446a5d2866ec411840d339c7dff0a27854872d9
OAUTH_ACCESS_TOKEN=211ebcf9cc5a73479f17e0e8aca92c06b385ea6d80cdeb4b502ac06f9dcb6cce

# ── Camera names and go2rtc stream names (must match go2rtc.yaml) ─────────────
CAM_1_NAME=Deck (no sound)
CAM_1_STREAM=deck_nosound

CAM_2_NAME=Edna & Mike
CAM_2_STREAM=edna_mike

CAM_3_NAME=Bikes
CAM_3_STREAM=bikes

CAM_4_NAME=Gina (sound)
CAM_4_STREAM=gina

CAM_5_NAME=Entrance
CAM_5_STREAM=entrance

CAM_6_NAME=Deck (sound)
CAM_6_STREAM=deck_sound
ENV

# Copy .env.example → .env only if .env does not already exist
[[ ! -f "$DIR/.env" ]] && cp "$DIR/.env.example" "$DIR/.env"

# ── smart-home-api/Dockerfile ─────────────────────────────────
cat > "$DIR/smart-home-api/Dockerfile" <<'DOCKER'
FROM node:22-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production --no-fund --no-audit
COPY server.js .
EXPOSE 3001
CMD ["node", "server.js"]
DOCKER

# ── smart-home-api/package.json ───────────────────────────────
cat > "$DIR/smart-home-api/package.json" <<'JSON'
{
  "name": "smart-home-api",
  "version": "1.0.0",
  "description": "Google Home Smart Home fulfillment + OAuth for Dahua NVR",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cookie-parser": "^1.4.7",
    "express": "^4.21.2"
  }
}
JSON

# ── smart-home-api/server.js ──────────────────────────────────
cat > "$DIR/smart-home-api/server.js" <<'JS'
'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const { randomBytes } = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
  const url = new URL(redirect_uri);
  url.searchParams.set('code', authCode);
  url.searchParams.set('state', state);

  res.cookie('nvr_auth_code', authCode, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 120000,
    path: '/api/oauth/token',
  });

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
    const cookieCode = req.cookies?.nvr_auth_code;
    if (!code || !cookieCode || code !== cookieCode) {
      return res.status(400).json({ error: 'invalid_grant' });
    }
    return res.json({
      access_token: process.env.OAUTH_ACCESS_TOKEN,
      token_type: 'Bearer',
      expires_in: 315360000,
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
JS

# ── setup.sh ─────────────────────────────────────────────────
cat > "$DIR/setup.sh" <<'BASH'
#!/usr/bin/env bash
# =============================================================================
# Dahua cameras → Google Home: one-time permanent tunnel setup
# =============================================================================
set -euo pipefail

HOSTNAME="${1:-}"
TUNNEL_NAME="nvr-go2rtc"
CLOUDFLARED_DIR="$(cd "$(dirname "$0")" && pwd)/cloudflared"

red()    { echo -e "\033[31m$*\033[0m"; }
green()  { echo -e "\033[32m$*\033[0m"; }
yellow() { echo -e "\033[33m$*\033[0m"; }
bold()   { echo -e "\033[1m$*\033[0m"; }
die()    { red "ERROR: $*"; exit 1; }

if [[ -z "$HOSTNAME" ]]; then
  echo "Usage: bash setup.sh <hostname>"
  echo "Example: bash setup.sh nvr.allonys.com"
  exit 1
fi

bold "=== Dahua cameras → Google Home: permanent tunnel setup ==="
echo "  Tunnel name : $TUNNEL_NAME"
echo "  Hostname    : https://$HOSTNAME"
echo ""

if ! command -v cloudflared &>/dev/null; then
  yellow "cloudflared not found — installing..."
  if command -v brew &>/dev/null; then
    brew install cloudflared
  else
    ARCH="$(uname -m)"
    INSTALL_DIR="$HOME/.local/bin"
    mkdir -p "$INSTALL_DIR"
    curl -fsSL "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-${ARCH}" \
         -o "$INSTALL_DIR/cloudflared"
    chmod +x "$INSTALL_DIR/cloudflared"
    export PATH="$INSTALL_DIR:$PATH"
    green "cloudflared installed to $INSTALL_DIR/cloudflared"
  fi
fi

CLOUDFLARED=$(command -v cloudflared)
green "Using cloudflared: $($CLOUDFLARED --version)"
echo ""

if [[ ! -f "$HOME/.cloudflared/cert.pem" ]]; then
  bold "Step 1 of 4 — Log in to Cloudflare"
  "$CLOUDFLARED" tunnel login
  echo ""
else
  green "Step 1 of 4 — Already logged in to Cloudflare"
fi

bold "Step 2 of 4 — Create named tunnel: $TUNNEL_NAME"
EXISTING_ID=$("$CLOUDFLARED" tunnel list --output json 2>/dev/null \
  | python3 -c "import sys,json; t=[x for x in json.load(sys.stdin) if x.get('name')=='$TUNNEL_NAME']; print(t[0]['id'] if t else '')" 2>/dev/null || true)

if [[ -n "$EXISTING_ID" ]]; then
  TUNNEL_ID="$EXISTING_ID"
  yellow "  Tunnel already exists (ID: $TUNNEL_ID) — skipping creation"
else
  CREATE_OUTPUT=$("$CLOUDFLARED" tunnel create "$TUNNEL_NAME" 2>&1)
  echo "$CREATE_OUTPUT"
  TUNNEL_ID=$(echo "$CREATE_OUTPUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
  [[ -z "$TUNNEL_ID" ]] && die "Could not parse tunnel ID. Re-run the script."
  green "  Tunnel created: $TUNNEL_ID"
fi
echo ""

bold "Step 3 of 4 — Copy credentials"
CREDS_SRC="$HOME/.cloudflared/$TUNNEL_ID.json"
[[ ! -f "$CREDS_SRC" ]] && die "Credentials file not found at $CREDS_SRC"
mkdir -p "$CLOUDFLARED_DIR"
cp "$CREDS_SRC" "$CLOUDFLARED_DIR/credentials.json"
green "  Credentials → $CLOUDFLARED_DIR/credentials.json"

cat > "$CLOUDFLARED_DIR/config.yml" <<EOF
# Generated by setup.sh — permanent Cloudflare Tunnel
tunnel: $TUNNEL_ID
credentials-file: /etc/cloudflared/credentials.json

ingress:
  - hostname: $HOSTNAME
    service: http://nvr-nginx:80
  - service: http_status:404

no-autoupdate: true
EOF
green "  Config → $CLOUDFLARED_DIR/config.yml"
echo ""

bold "Step 4 of 4 — Create DNS record: $HOSTNAME → tunnel"
if "$CLOUDFLARED" tunnel route dns "$TUNNEL_NAME" "$HOSTNAME" 2>&1; then
  green "  DNS CNAME created"
else
  yellow "  DNS record may already exist — that is fine"
fi
echo ""

green "============================================================"
green "  Setup complete! https://$HOSTNAME"
green "============================================================"
echo ""
bold "Next steps:"
echo "  1. Fill in .env:"
echo "       cp $(dirname "$CLOUDFLARED_DIR")/.env.example $(dirname "$CLOUDFLARED_DIR")/.env"
echo "       \$EDITOR $(dirname "$CLOUDFLARED_DIR")/.env"
echo ""
echo "  2. Start everything:"
echo "       cd $(dirname "$CLOUDFLARED_DIR")"
echo "       docker compose up -d"
echo ""
echo "  3. Verify:"
echo "       go2rtc dashboard → http://localhost:1984"
echo "       smart-home API   → curl https://$HOSTNAME/api/smart-home  (expect 401)"
echo ""
BASH

# ── update.sh ────────────────────────────────────────────────
cat > "$DIR/update.sh" <<'BASH'
#!/usr/bin/env bash
# Patch an existing nvr-setup deployment in-place and restart.
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
green()  { echo -e "\033[32m$*\033[0m"; }
yellow() { echo -e "\033[33m$*\033[0m"; }
bold()   { echo -e "\033[1m$*\033[0m"; }
die()    { echo -e "\033[31mERROR: $*\033[0m"; exit 1; }

CONFIG="$DIR/cloudflared/config.yml"
[[ ! -f "$CONFIG" ]] && die "cloudflared/config.yml not found. Run setup.sh first."

TUNNEL_ID=$(grep -E '^tunnel:' "$CONFIG" | awk '{print $2}')
HOSTNAME=$(grep -E '^\s+hostname:' "$CONFIG" | head -1 | awk '{print $2}')
[[ -z "$TUNNEL_ID" ]] && die "Could not read tunnel ID from $CONFIG"
[[ -z "$HOSTNAME"  ]] && die "Could not read hostname from $CONFIG"

bold "Updating cloudflared/config.yml → nvr-nginx:80"
cat > "$CONFIG" <<EOF
# Updated by update.sh
tunnel: $TUNNEL_ID
credentials-file: /etc/cloudflared/credentials.json

ingress:
  - hostname: $HOSTNAME
    service: http://nvr-nginx:80
  - service: http_status:404

no-autoupdate: true
EOF
green "  Done"

bold "Restarting containers"
docker compose -f "$DIR/docker-compose.yml" down
docker compose -f "$DIR/docker-compose.yml" up -d --build
echo ""
sleep 3
HTTP=$(curl -s -o /dev/null -w "%{http_code}" "https://$HOSTNAME/api/smart-home" 2>/dev/null || echo "000")
[[ "$HTTP" == "401" ]] && green "/api/smart-home → 401 (working!)" || yellow "/api/smart-home → $HTTP (expected 401 — tunnel may need a moment)"
BASH

chmod +x "$DIR/setup.sh" "$DIR/update.sh"
echo ""
echo "All files created in $DIR"
echo ""
echo "Now running setup.sh nvr.allonys.com ..."
echo ""
bash "$DIR/setup.sh" nvr.allonys.com
