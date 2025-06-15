# AnonyConnect

A privacy-first, anonymous contact and ticketing platform. Inspired by traditional contact forms, AnonyConnect allows users to submit messages or tickets anonymously and enables direct, secure responses—without exposing personal information.

## Aim
- Create a platform for anonymous contact and communication.
- Go beyond basic contact forms by allowing admins to respond directly to anonymous tickets.
- Ensure privacy, security, and ease of use for both users and administrators.

## Tech Stack
- **Frontend:** Next.js (React), Bootstrap 5
- **Backend:** Node.js, Next.js API routes
- **Database:** SQLite (file-based, simple and portable)
- **Authentication:** JWT, Admin 2FA (TOTP)
- **Verification:** Cloudflare Turnstile (anti-bot)
- **Notifications:** Telegram integration
- **Containerization:** Docker, Docker Compose

## Features
- Anonymous ticket/message creation
- Admin portal with login, 2FA, and ticket management
- Direct admin-to-user responses (without revealing identities)
- Telegram notifications for ticket events
- Cloudflare Turnstile verification for spam/bot protection
- Responsive, modern UI (Bootstrap-based)
- SQLite database for lightweight, persistent storage
- Docker support for easy deployment

## Documentation & Installation
- The `/Docs` directory contains detailed documentation on installation, configuration, project structure, database schema, and customization guides for this project.
- Quick start: use the prebuilt Docker image or follow the guides in `/Docs` for manual/local installation.

## Contribution
We welcome contributions! Please see [CONTRIBUTE.md](CONTRIBUTE.md) for guidelines.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


