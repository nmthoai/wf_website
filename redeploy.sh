#!/bin/bash
# redeploy.sh - Deploy latest code to Contabo VPS
# Run locally: bash redeploy.sh
# Or run directly on the VPS: bash redeploy.sh --local

set -e

VPS_USER="root"               # Change to your VPS SSH user if not root
VPS_IP=""                     # Set your Contabo VPS IP here, e.g. "123.456.789.0"
VPS_DIR="/opt/wf-website"     # Directory on the VPS where the project lives

# ── Local mode (run this script directly on the VPS) ──────────────────────────
if [[ "${1}" == "--local" ]]; then
  echo "=== [Local] Redeploying wf-website ==="
  cd "$VPS_DIR"
  git pull origin main
  docker compose down
  docker compose up -d --build
  docker image prune -f
  echo "=== Done. Container is up. ==="
  exit 0
fi

# ── Remote mode (run from your local machine via SSH) ─────────────────────────
if [[ -z "$VPS_IP" ]]; then
  echo "Error: Set VPS_IP at the top of this script before running."
  exit 1
fi

echo "=== Deploying to Contabo VPS ($VPS_IP) ==="

# Push any uncommitted changes first
git push origin main

# SSH into VPS and run the local mode
ssh "${VPS_USER}@${VPS_IP}" "bash ${VPS_DIR}/redeploy.sh --local"

echo "=== Deployment complete! https://workfactory.ai ==="
