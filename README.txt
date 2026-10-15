SETUP (same Netlify site)
1. Upload this project to a GitHub repository (all files, including netlify/functions/dashboard.mjs).
2. In existing Netlify project, Project configuration > Build & deploy > Continuous deployment > Link repository (wording may vary), select repository.
3. In Netlify Project configuration > Environment variables add DASHBOARD_PASSWORD with a UNIQUE password at least 12 characters long. Mark sensitive/secret if available. Never put this password in source code.
4. Deploy the Git-based project to the existing site. Ensure deploy log shows one Function (dashboard).
5. Open original URL, enter password on both devices, tick task and verify sync. Updates check every 6 seconds.
6. If you had checked items before upgrade, export a backup from old site BEFORE deployment. Only after new deployment, import your backup while logged in.
IMPORTANT: Do not use the previous drag-and-drop static HTML as the new shared version. A full Netlify build is needed to bundle the function dependency. The shared password is not per-user accounts. Blobs is lightweight storage; simultaneous conflicting edits may need manual backup/reload. Do not store sensitive customer data.
