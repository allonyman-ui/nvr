#!/usr/bin/env bash
# =============================================================================
# Dahua cameras → Google Home: one-time permanent tunnel setup
# =============================================================================
# Run this ONCE on the machine that runs go2rtc (same LAN as the cameras).
# It creates a named Cloudflare Tunnel with a fixed hostname that never changes.
#
# Usage:
#   bash setup.sh <hostname>
#   e.g. bash setup.sh nvr.yourdomain.com
#
# Prerequisites:
#   • A domain whose DNS is managed by Cloudflare (free account)
#   • Docker + Docker Compose installed
#   • macOS: Homebrew recommended (brew.sh) — or cloudflared installed manually
#   • Linux: curl + python3 available
# =============================================================================

set -euo pipefail

HOSTNAME="${1:-}"
TUNNEL_NAME="nvr-go2rtc"
CLOUDFLARED_DIR="$(cd "$(dirname "$0")" && pwd)/cloudflared"

# ── helpers ──────────────────────────────────────────────────────────────────
red()    { echo -e "\033[31m$*\033[0m"; }
green()  { echo -e "\033[32m$*\033[0m"; }
yellow() { echo -e "\033[33m$*\033[0m"; }
bold()   { echo -e "\033[1m$*\033[0m"; }

die() { red "ERROR: $*"; exit 1; }

# ── validate args ─────────────────────────────────────────────────────────────
if [[ -z "$HOSTNAME" ]]; then
  echo "Usage: bash setup.sh <hostname>"
  echo "Example: bash setup.sh nvr.yourdomain.com"
  echo ""
  echo "The hostname must be on a domain whose DNS is managed by Cloudflare."
  exit 1
fi

bold "=== Dahua cameras → Google Home: permanent tunnel setup ==="
echo ""
echo "  Tunnel name : $TUNNEL_NAME"
echo "  Hostname    : https://$HOSTNAME"
echo "  Output dir  : $CLOUDFLARED_DIR"
echo ""

# ── install cloudflared if missing ───────────────────────────────────────────
if ! command -v cloudflared &>/dev/null; then
  yellow "cloudflared not found — installing..."

  OS="$(uname -s)"

  if [[ "$OS" == "Darwin" ]]; then
    # ── macOS ──────────────────────────────────────────────────────────────
    if command -v brew &>/dev/null; then
      green "Homebrew detected — installing via brew..."
      brew install cloudflared
    else
      # Direct binary download for macOS
      ARCH="$(uname -m)"   # arm64 (Apple Silicon) or x86_64 (Intel)
      INSTALL_DIR="$HOME/.local/bin"
      mkdir -p "$INSTALL_DIR"
      curl -fsSL "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-${ARCH}" \
           -o "$INSTALL_DIR/cloudflared"
      chmod +x "$INSTALL_DIR/cloudflared"
      export PATH="$INSTALL_DIR:$PATH"
      green "cloudflared installed to $INSTALL_DIR/cloudflared"
      yellow "TIP: Install Homebrew (brew.sh) for easier future updates."
    fi

  else
    # ── Linux ──────────────────────────────────────────────────────────────
    ARCH="$(uname -m)"
    case "$ARCH" in
      x86_64)  BINARY="cloudflared-linux-amd64" ;;
      aarch64) BINARY="cloudflared-linux-arm64" ;;
      armv7*)  BINARY="cloudflared-linux-arm"   ;;
      *) die "Unsupported architecture: $ARCH. Install cloudflared manually from https://github.com/cloudflare/cloudflared/releases" ;;
    esac
    INSTALL_DIR="$HOME/.local/bin"
    mkdir -p "$INSTALL_DIR"
    curl -fsSL "https://github.com/cloudflare/cloudflared/releases/latest/download/$BINARY" \
         -o "$INSTALL_DIR/cloudflared"
    chmod +x "$INSTALL_DIR/cloudflared"
    export PATH="$INSTALL_DIR:$PATH"
    green "cloudflared installed to $INSTALL_DIR/cloudflared"
  fi
fi

CLOUDFLARED=$(command -v cloudflared)
green "Using cloudflared: $($CLOUDFLARED --version)"
echo ""

# ── login to Cloudflare ───────────────────────────────────────────────────────
if [[ ! -f "$HOME/.cloudflared/cert.pem" ]]; then
  bold "Step 1 of 4 — Log in to Cloudflare"
  echo "A browser window will open. Authorise the domain: ${HOSTNAME#*.}"
  echo ""
  "$CLOUDFLARED" tunnel login
  echo ""
else
  green "Step 1 of 4 — Already logged in to Cloudflare"
fi

# ── create the named tunnel ───────────────────────────────────────────────────
bold "Step 2 of 4 — Create named tunnel: $TUNNEL_NAME"

# Check if tunnel already exists
EXISTING_ID=$("$CLOUDFLARED" tunnel list --output json 2>/dev/null \
  | python3 -c "import sys,json; t=[x for x in json.load(sys.stdin) if x.get('name')=='$TUNNEL_NAME']; print(t[0]['id'] if t else '')" 2>/dev/null || true)

if [[ -n "$EXISTING_ID" ]]; then
  TUNNEL_ID="$EXISTING_ID"
  yellow "  Tunnel already exists (ID: $TUNNEL_ID) — skipping creation"
else
  CREATE_OUTPUT=$("$CLOUDFLARED" tunnel create "$TUNNEL_NAME" 2>&1)
  echo "$CREATE_OUTPUT"
  # Parse tunnel ID from output: "Created tunnel nvr-go2rtc with id abc123..."
  TUNNEL_ID=$(echo "$CREATE_OUTPUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
  [[ -z "$TUNNEL_ID" ]] && die "Could not parse tunnel ID from output. Re-run the script."
  green "  Tunnel created: $TUNNEL_ID"
fi
echo ""

# ── copy credentials file ─────────────────────────────────────────────────────
bold "Step 3 of 4 — Copy credentials"
CREDS_SRC="$HOME/.cloudflared/$TUNNEL_ID.json"
[[ ! -f "$CREDS_SRC" ]] && die "Credentials file not found at $CREDS_SRC"

mkdir -p "$CLOUDFLARED_DIR"
cp "$CREDS_SRC" "$CLOUDFLARED_DIR/credentials.json"
green "  Credentials → $CLOUDFLARED_DIR/credentials.json"

# Write cloudflared/config.yml
# IMPORTANT: service uses container name "go2rtc" (not localhost) because
# Docker Compose uses a bridge network on macOS — containers talk via name.
cat > "$CLOUDFLARED_DIR/config.yml" <<EOF
# Generated by setup.sh — permanent Cloudflare Tunnel
tunnel: $TUNNEL_ID
credentials-file: /etc/cloudflared/credentials.json

ingress:
  # All traffic → nginx, which routes by path to smart-home-api or go2rtc
  - hostname: $HOSTNAME
    service: http://nvr-nginx:80
  - service: http_status:404

no-autoupdate: true
EOF
green "  Config → $CLOUDFLARED_DIR/config.yml"
echo ""

# ── create DNS CNAME record ───────────────────────────────────────────────────
bold "Step 4 of 4 — Create DNS record: $HOSTNAME → tunnel"

if "$CLOUDFLARED" tunnel route dns "$TUNNEL_NAME" "$HOSTNAME" 2>&1; then
  green "  DNS CNAME created"
else
  yellow "  DNS record may already exist — that is fine"
fi
echo ""

# ── done ──────────────────────────────────────────────────────────────────────
green "============================================================"
green "  Setup complete!"
green "============================================================"
echo ""
bold "Your permanent go2rtc URL (never changes):"
echo "  https://$HOSTNAME"
echo ""
bold "Next steps:"
echo ""
echo "  1. Copy and fill in the env file for the smart-home-api:"
echo "       cp $(dirname "$CLOUDFLARED_DIR")/.env.example $(dirname "$CLOUDFLARED_DIR")/.env"
echo "       \$EDITOR $(dirname "$CLOUDFLARED_DIR")/.env"
echo ""
echo "  2. Start everything (auto-restarts on reboot):"
echo "       cd $(dirname "$CLOUDFLARED_DIR")"
echo "       docker compose up -d"
echo ""
echo "  3. Verify services:"
echo "       go2rtc dashboard  → http://localhost:1984"
echo "       smart-home API    → curl https://$HOSTNAME/api/smart-home (should return 401)"
echo ""
echo "  4. In Google Home Console, set fulfillment + OAuth URLs to:"
echo "       Fulfillment URL   : https://$HOSTNAME/api/smart-home"
echo "       Authorization URL : https://$HOSTNAME/api/oauth/authorize"
echo "       Token URL         : https://$HOSTNAME/api/oauth/token"
echo ""
echo "  5. Follow the remaining steps in the /nvr dashboard."
echo ""
