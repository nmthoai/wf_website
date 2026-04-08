#!/bin/bash
# setup_contabo.sh - One-time VPS environment setup for WorkFactory.ai
# Run once on a fresh Contabo VPS: sudo bash setup_contabo.sh
# After this, use redeploy.sh for all future updates.

set -e

DOMAIN="workfactory.ai"
NGINX_CONF="/etc/nginx/sites-available/wf-website"

echo "=========================================================="
echo " Starting Contabo VPS Environment Setup (WorkFactory)     "
echo "=========================================================="

# 1. Update & Install Docker
echo "[1/5] Installing Docker Engine..."
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 2. Install Nginx & Certbot
echo "[2/5] Installing Nginx and Certbot..."
apt-get install -y nginx certbot python3-certbot-nginx

# 3. Write Nginx config (HTTP only — Certbot will upgrade to HTTPS)
echo "[3/5] Configuring Nginx reverse proxy..."
cat > "$NGINX_CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 1000;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Pass real client info to Express
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_cache_bypass \$http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;

        # Limit request body (contact form only needs small payloads)
        client_max_body_size 1m;
    }
}
EOF

ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl restart nginx

# 4. Firewall: allow SSH, HTTP, HTTPS
echo "[4/5] Configuring UFW firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# 5. Instructions for next steps
echo ""
echo "=========================================================="
echo " Setup Complete!                                          "
echo "=========================================================="
echo ""
echo " NEXT STEPS:"
echo ""
echo " 1. Point your domain DNS A records to this VPS IP:"
echo "      $DOMAIN     → <your VPS IP>"
echo "      www.$DOMAIN → <your VPS IP>"
echo ""
echo " 2. Wait for DNS to propagate, then issue SSL certificate:"
echo "      sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo " 3. Create your .env file on the VPS:"
echo "      nano /opt/wf-website/.env"
echo "    Contents:"
echo "      EMAIL_USER=your_gmail@gmail.com"
echo "      EMAIL_PASS=your_16_char_app_password"
echo "      PORT=8080"
echo ""
echo " 4. Deploy the app:"
echo "      cd /opt/wf-website && sudo docker compose up -d --build"
echo ""
echo " For future updates, use: bash redeploy.sh"
echo "=========================================================="
