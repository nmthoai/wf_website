# VPS LOG / MEMORY STATE

**Last Updated:** 2026-04-14 (Initial Setup)

## Current Status
The actual VPS environment has not yet been scanned. The VPS IP has not been provided (`redeploy.sh` shows it as empty). 

## Known Hosted Services
* **wf-website:** Designed to run via Docker Compose on port `8080`, reverse proxied via Nginx. 

## Active Containers (To Be Discovered)
*(Run `docker ps` on the VPS to populate this list and avoid port overlapping)*
* *Pending Discovery...*

## Port Allocations
* `80`: Nginx (Used by wf-website reverse proxy)
* `443`: Nginx / SSL (Expected soon via Certbot)
* `8080`: wf-website Docker Container (Target)
* *Pending Discovery for other ports...*
