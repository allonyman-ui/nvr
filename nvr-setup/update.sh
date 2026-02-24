#!/usr/bin/env bash
# =============================================================================
# update.sh  —  Patch an existing nvr-setup deployment in-place
# =============================================================================
# Run this on the Mac mini whenever the repo changes:
#   bash ~/nvr-setup/update.sh
#
# What it does:
#   1. Overwrites docker-compose.yml, nginx.conf, and cloudflared/config.yml
#      with the correct versions (nginx routing fix)
#   2. Restarts all containers
# =============================================================================
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"

green()  { echo -e "\033[32m$*\033[0m"; }
yellow() { echo -e "\033[33m$*\033[0m"; }
bold()   { echo -e "\033[1m$*\033[0m"; }
die()    { echo -e "\033[31mERROR: $*\033[0m"; exit 1; }

bold "=== nvr-setup update ==="
echo ""

# ── Read existing tunnel config ───────────────────────────────────────────────
CONFIG="$DIR/cloudflared/config.yml"
[[ ! -f "$CONFIG" ]] && die "cloudflared/config.yml not found. Run setup.sh first."

TUNNEL_ID=$(grep -E '^tunnel:' "$CONFIG" | awk '{print $2}')
HOSTNAME=$(grep -E '^\s+hostname:' "$CONFIG" | head -1 | awk '{print $2}')
[[ -z "$TUNNEL_ID" ]] && die "Could not read tunnel ID from $CONFIG"
[[ -z "$HOSTNAME"  ]] && die "Could not read hostname from $CONFIG"

green "  Tunnel  : $TUNNEL_ID"
green "  Hostname: $HOSTNAME"
echo ""

# ── 1. Write nginx.conf ───────────────────────────────────────────────────────
bold "1/4 — Writing nginx.conf"
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
      # Handle CORS preflight locally — full headers, no upstream contact
      if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Range, Authorization';
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Length' 0;
        return 204;
      }

      proxy_pass http://go2rtc:1984;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";

      # Strip any CORS headers that go2rtc may emit so nginx is the sole source.
      # NOTE: Access-Control-Allow-Origin is intentionally NOT re-added below.
      # Cloudflare's "Modify Response Header" Transform Rule already injects it
      # once on every 2xx response. Adding it here too produces two
      # Access-Control-Allow-Origin values, which browsers reject outright —
      # that is the root cause of the black-screen / stream-unavailable error.
      proxy_hide_header Access-Control-Allow-Origin;
      proxy_hide_header Access-Control-Allow-Methods;
      proxy_hide_header Access-Control-Allow-Headers;
      proxy_hide_header Access-Control-Expose-Headers;

      # These supplementary CORS headers are still required for HLS range
      # requests and are not emitted by the Cloudflare Transform Rule.
      add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS' always;
      add_header 'Access-Control-Allow-Headers' 'Range' always;
      add_header 'Access-Control-Expose-Headers' 'Content-Length, Content-Range' always;
    }
  }
}
NGINX
green "  nginx.conf written"

# ── 2. Write docker-compose.yml ───────────────────────────────────────────────
bold "2/4 — Writing docker-compose.yml"
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
green "  docker-compose.yml written"

# ── 3. Update cloudflared config to use nginx ─────────────────────────────────
bold "3/4 — Updating cloudflared/config.yml → nvr-nginx:80"
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
green "  cloudflared/config.yml updated"

# ── 4. Restart containers ─────────────────────────────────────────────────────
bold "4/4 — Restarting containers"
docker compose -f "$DIR/docker-compose.yml" down
docker compose -f "$DIR/docker-compose.yml" up -d --build
echo ""

green "============================================================"
green "  Done! Testing..."
green "============================================================"
echo ""
sleep 3
HTTP=$(curl -s -o /dev/null -w "%{http_code}" "https://$HOSTNAME/api/smart-home" 2>/dev/null || echo "000")
if [[ "$HTTP" == "401" ]]; then
  green "  /api/smart-home → $HTTP (correct — smart-home-api is reachable)"
elif [[ "$HTTP" == "000" ]]; then
  yellow "  /api/smart-home → tunnel not yet up, wait 10s and retry"
else
  yellow "  /api/smart-home → $HTTP (expected 401)"
fi
echo ""
echo "  go2rtc dashboard → http://localhost:1984"
echo ""
