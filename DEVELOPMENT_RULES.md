# Development and Deployment Rules for Workfactory.ai

1. **Local Review First:** Every design and implementation change must go through a local environment review before any deployment steps are taken.
2. **Explicit Approval:** Code can only be deployed to the VPS *after* explicit approval from the USER.
3. **VPS Pre-Check:** Before any deployment, the VPS environment must be checked carefully. Because the VPS has many other Docker Containers, we must verify there is no port or naming overlap with the Workfactory.ai deployments.
4. **VPS Memory Synchronization:** Before deploying, we MUST read the contents of `VPS_MEMORY.md` to understand the current state of the VPS. Any changes to the VPS architecture, containers, or exposed ports must be aggressively updated in `VPS_MEMORY.md`.
5. **Asset Management:** All AI-generated images must be moved and stored in the `/gen-images/` folder going forward to ensure a clean public directory structure.
