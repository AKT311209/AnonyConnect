# Edit Guide: Customizing Your AnonyConnect Instance

This guide helps you identify where to edit the codebase to customize your AnonyConnect deployment to fit your preferences.

---

## 1. Branding & UI
- **Logo, Colors, Styles:**
  - Edit files in `webapp/public/assets/` (images, CSS).
  - For Bootstrap theme overrides: `webapp/public/assets/css/bs-theme-overrides.css`.
  - For custom CSS: `webapp/public/assets/css/custom.css`.
- **Navbar, Footer, Layout:**
  - Edit React components in `webapp/components/navbar.js`, `footer.js`, and layout-related files.
- **Static Text & Labels:**
  - Update text in React components in `webapp/components/` and page files in `webapp/pages/`.

## 2. Ticket Form & User Experience
- **Form Fields:**
  - Edit ticket form logic in `webapp/components/ticketdetail.js`, `ticketsearch.js`, `ticketverificationform.js`.
- **Success/Failure Messages:**
  - Update in `webapp/components/successcomponent.js` and relevant pages in `webapp/pages/`.

## 3. Admin Portal
- **Login & 2FA:**
  - Edit admin login and 2FA dialogs in `webapp/components/AdminLogin.js`, `Admin2FADialog.js`, `Admin2FASetupDialog.js`.
- **Admin Dashboard & Ticket Management:**
  - Customize in `webapp/components/AdminTicketPortal.js`, `AdminTicketDetail.js`, and admin pages in `webapp/pages/admin/`.

## 4. Notifications & Integrations
- **Telegram Notifications:**
  - Edit logic in `webapp/scripts/notify-telegram.js`, `sendTelegramNotification.js`.
  - Configure in `webapp/storage/config.json` and `.env` variables.
- **Cloudflare Turnstile (anti-bot):**
  - Edit/replace logic in `webapp/lib/verify-cloudflare.js`.
  - Update keys in `.env`.

## 5. Configuration & Security
- **App Settings:**
  - Edit `webapp/storage/config.json` for admin credentials, notification settings, and more.
  - Default config: `webapp/components/defaultConfig.json`.
- **Environment Variables:**
  - Set in `webapp/.env` (copy from `.env.sample`).
- **Database:**
  - SQLite file is at `webapp/storage/database.sqlite` (edit with caution).

## 6. Database Actions
- **See the [database structure documentation](./database-structure.md) for a full description of each table and its columns.**
- **Centralized Database Logic:**
  - All database actions (tickets, sessions, admin settings, tokens, rate limits) are centralized in `webapp/lib/db.js`.
  - To add, modify, or extend database operations, only edit or add functions in `db.js`.
  - All other files (API routes, scripts, components) must import and use these functions—never access the database directly.
- **View/Edit Tickets and Sessions:**
  - The main database is `webapp/storage/database.sqlite` (SQLite format).
  - You can use any SQLite client (e.g., DB Browser for SQLite, sqlite3 CLI) to view or edit ticket and session data directly.
  - **Tables include:**
    - `tickets`: Stores all user-submitted tickets/messages.
    - `sessions`: Stores admin session data.
    - (Other tables may exist for 2FA, etc.)
- **Backup/Restore:**
  - Always back up `database.sqlite` before making direct edits.
  - To restore, replace the file with a backup copy.
- **Automated Cleanup:**
  - The script `webapp/scripts/cron-tickets.js` handles auto-reject and cleanup of old tickets based on your config.
  - Adjust timing and logic in this script or in `webapp/storage/config.json`.

## 7. Deployment
- **Docker:**
  - Edit `webapp/docker-compose.yml` and `Dockerfile` for deployment options.
- **Scripts:**
  - Automation and cron jobs: `webapp/scripts/`.

## 8. UI/UX Centralization
- **All HTML, CSS, and UI logic are centralized in the `webapp/components/` directory.**
  - All page files in `webapp/pages/` should only import and use components for their UI—no direct HTML, CSS, or layout should be present in page files.
  - To customize the look, layout, or behavior of any part of the app, edit or extend the relevant component in `components/`.
  - This ensures a clean separation of concerns and makes it easy to update or theme your instance.

---

For more details, see the project structure docs and code comments in each file. Always back up your config and database before making major changes.
