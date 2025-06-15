# Webapp Directory Structure: AnonyConnect

This document explains the structure and purpose of each item in the `webapp/` directory.

---

## Root Files & Folders
- **Dockerfile**: Instructions for building the Docker image.
- **docker-compose.yml**: Multi-container orchestration (uses prebuilt image, sets env vars, mounts storage).
- **docker-entrypoint.sh**: Entrypoint script for Docker container startup.
- **next.config.js**: Next.js configuration file.
- **package.json / package-lock.json**: Node.js dependencies and scripts.
- **.env.sample**: Example environment variable file (copy to `.env` and fill in your values).
- **.dockerignore / .gitignore**: Ignore rules for Docker and Git.

## Directories

### components/
Reusable React components for the frontend UI, including:
- Admin login, 2FA dialogs, ticket forms, navbar, footer, etc.
- `defaultConfig.json`: Default UI/config settings for the app.

### lib/
Backend logic and helpers:
- `auth.js`: Authentication helpers (JWT, session validation).
- `db.js`: Database logic (SQLite, ticket/session management).
- `verify-cloudflare.js`: Cloudflare Turnstile verification.

### pages/
Next.js pages and API routes:
- `index.js`, `success.js`, `tickets.js`: Main user-facing pages.
- `admin/`: Admin portal (login, dashboard, ticket management, 2FA setup).
- `api/`: API endpoints for tickets, admin, authentication, notifications.
- `ticket/`: Dynamic ticket detail pages.
- `_document.js`, `404.js`: Custom document and error page.

### public/
Static assets for the web app:
- `assets/`: Bootstrap, CSS, fonts, images, JS.
- `favicon.ico`, `manifest.json`, `robots.txt`: Standard web assets.

### scripts/
Node.js scripts for automation:
- `cron-tickets.js`: Scheduled ticket cleanup/rejection.
- `notify-telegram.js`, `sendTelegramNotification.js`: Telegram notification scripts.

### storage/
Persistent storage for config and database:
- `config.json`: Main app configuration (admin, notifications, etc).
- `database.sqlite`: SQLite database file.

### utils/
Utility functions for authentication and admin page protection:
- `withAdminAuth.js`, `withAdminPageAuth.js`: Middleware for secure admin access.

