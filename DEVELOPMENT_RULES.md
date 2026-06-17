# Development and Deployment Rules for Workfactory.ai

**DEPLOYMENT PROTOCOL:**
1. **Local Review First:** Any visual or data changes to `wf-website` must first be reviewed on the local dev server using `npm run dev`.
2. **Explicit Approval:** No code goes to production (`/Users/thoainguyen/Antigravity/wf_website/redeploy.sh`) unless explicitly requested by the user. 
3. **VPS Pre-Check & Isolation:** Always run a status check (`docker ps`, port scans) to get an overview of existing applications. **Avoid touching or modifying any other setups** on the VPS (especially when accessing it for the first time).
4. **VPS Memory Synchronization:** Once deployed, update `VPS_MEMORY.md` with the latest deployment timestamp, state, and any newly discovered services. Before deploying, we MUST read the contents of `VPS_MEMORY.md` to understand the current state of the VPS. Any changes to the VPS architecture, containers, or exposed ports must be aggressively updated in `VPS_MEMORY.md`.
5. **Asset Management:** All AI-generated images must be moved and stored in the `/gen-images/` folder going forward to ensure a clean public directory structure.
