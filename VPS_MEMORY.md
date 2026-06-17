# VPS LOG / MEMORY STATE

**Last Updated:** 2026-06-15 (Production Deployment)

## Current Status
Successfully deployed latest design and Obsidian vault content to Contabo VPS (`194.233.68.225`). Project lives at `/root/wf_website` on the remote server.

## Known Hosted Services
* **wf-website:** Running via Docker Compose on port `8080` (`wf_website-wf-website` container).
* **openclaw:** Running via Docker (`ghcr.io/openclaw/openclaw:latest`).

## Active Containers
* `wf-website` (Bound to `127.0.0.1:8080->8080/tcp`)
* `openclaw` (Internal network / no public exposed ports noted from `docker ps`)

## Port Allocations
* `80`: Nginx (Reverse proxy)
* `443`: Nginx / SSL
* `8080`: wf-website Docker Container
