# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-04-14

### Added
- **AI Master-Build Engine:** Integrated backend endpoint (`/api/admin/translate`) powered by Gemini 2.5 Flash to automatically translate central English content directly into robust flat-files (`.vn`, `.de`, `.cn`).
- **State Persistence:** Engineered local storage cache into `App.jsx` to perfectly freeze and retain User Language and Theme settings out-of-band across manual hard browser refreshes.
- **Glassmorphic Language Interfaces:** Ripped out rigid generic dropdown menus and replaced them with seamlessly animated sleek textual toggles (`.en`, `.vn`).
- **Container Volume Persistence:** Statically mapped the raw `./data` folder to Docker `runner` stages to completely persist newly AI-generated localization files safely across container/server reboots.

### Changed
- **Cinematic Glass Upgrade:** Uniformly scaled back the intense `var(--glass-blur)` opacity to a sheer `0.15` overlay in Dark Mode, alongside syncing global panel frost down to exactly `15px`. This morphs the thick opaque panels into extremely high-end, see-through window panes hovering over the factory background. 

### Fixed
- **Safari Total Render Crash:** Rewrote universal background anchoring CSS (`body::after`) to directly bypass an old, notorious macOS/iOS WebKit engine glitch triggered by compounding `background-attachment: fixed` logic which previously generated a totally blank white screen.
- **Dangling Dropdown Contexts:** Designed a synchronized `.glass-dropdown` engine style overriding standard drop-menus reverting back to opaque states, and fixed structural issues forcing menus to instantly vanish when hovered slightly out of frame boundaries.

## [0.1.0] - 2026-03-31

### Added
- Initial project setup using React and Vite.
- Express server configuration (`server.js`) for backend API handling and static file serving.
- Responsive landing page UI signifying "Under Construction" / platform launch for WorkFactory.ai.
- Contact form integration with Nodemailer for email notifications.
- Security and performance middleware (`helmet`, `cors`, `express-rate-limit`).
- Dockerfile for production deployment.
- Initial global and local styling configurations in `index.css` and App components.
