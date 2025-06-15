# Database Structure: AnonyConnect

This document describes each table in the SQLite database (`webapp/storage/database.sqlite`) used by AnonyConnect.

---

## tickets
- **Purpose:** Stores all user-submitted tickets/messages.
- **Columns:**
  - `id` (INTEGER, PK, AUTOINCREMENT): Internal row ID
  - `ticket_id` (TEXT): Public ticket identifier
  - `created_at` (TEXT): Timestamp of creation
  - `sender_name` (TEXT): Name of sender (optional)
  - `sender_email` (TEXT): Email of sender (optional)
  - `message` (TEXT): Ticket message content
  - `password` (TEXT): Optional password for private tickets
  - `status` (TEXT): Ticket status (Pending, Responded, Rejected)
  - `response` (TEXT): Admin response (if any)

## sessions
- **Purpose:** Stores admin session data for authentication.
- **Columns:**
  - `id` (INTEGER, PK, AUTOINCREMENT)
  - `session_id` (TEXT): Session token
  - `username` (TEXT): Admin username
  - `created_at` (TEXT): Session creation timestamp
  - `max_age` (INTEGER): Session validity (seconds)

## ticket_tokens
- **Purpose:** One-time tokens for secure ticket access.
- **Columns:**
  - `id` (INTEGER, PK, AUTOINCREMENT)
  - `token` (TEXT): Token value
  - `ticket_id` (TEXT): Associated ticket
  - `used` (INTEGER): 0 = unused, 1 = used
  - `expires_at` (INTEGER): Expiry timestamp (UNIX)

## admin_settings
- **Purpose:** Stores admin configuration and 2FA secrets.
- **Columns:**
  - `key` (TEXT, PK): Setting key
  - `value` (TEXT): Setting value

## admin_login_tokens
- **Purpose:** One-time tokens for admin login (e.g., 2FA, passwordless).
- **Columns:**
  - `id` (INTEGER, PK, AUTOINCREMENT)
  - `token` (TEXT): Token value
  - `username` (TEXT): Admin username
  - `expires_at` (INTEGER): Expiry timestamp (UNIX)
  - `used` (INTEGER): 0 = unused, 1 = used

## ticket_rate_limits
- **Purpose:** Tracks ticket creation rate by IP for anti-spam.
- **Columns:**
  - `id` (INTEGER, PK, AUTOINCREMENT)
  - `ip` (TEXT): IP address
  - `created_at` (INTEGER): Timestamp (UNIX)

---

For more details or schema changes, see `webapp/lib/db.js`.
