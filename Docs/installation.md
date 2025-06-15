# Installation Guide for AnonyConnect

This guide covers installation and setup for AnonyConnect, both with and without Docker. You can use the prebuilt Docker image from Docker Hub (`akt311209/anonyconnect`) or run the app locally.

---

## 1. Using Docker (Recommended)

### a. With Docker Compose

1. **Copy and configure environment variables:**
   - Go to `webapp/` directory.
   - Copy `.env.sample` to `.env` and fill in your values:
     ```bash
     cp .env.sample .env
     # Edit .env with your preferred editor
     ```
2. **Edit `docker-compose.yml` if needed:**
   - By default, it uses the prebuilt image and maps storage for persistence.
   - You can change the port or volume mapping as needed.
3. **Start the app:**
   ```bash
   docker-compose up -d
   ```
   - The app will be available at [http://localhost:27893](http://localhost:27893) (or the port you set).

### b. With Docker Only

1. **Pull the prebuilt image:**
   ```bash
   docker pull akt311209/anonyconnect:latest
   ```
2. **Run the container:**
   ```bash
   docker run -d \
     --name anonyconnect \
     -p 3000:3000 \
     -v $(pwd)/webapp/storage:/app/webapp/storage \
     -e ADMIN_USERNAME=admin \
     -e ADMIN_PASSWORD=changeme \
     -e NEXTAUTH_SECRET=your_nextauth_secret \
     -e TELEGRAM_BOT_TOKEN=your_telegram_bot_token \
     -e TELEGRAM_CHAT_ID=your_telegram_chat_id \
     -e NEXT_PUBLIC_BASE_URL=http://localhost:3000 \
     -e TURNSTILE_SECRET_KEY=your_turnstile_secret_key \
     -e NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key \
     akt311209/anonyconnect:latest
   ```
   - Adjust environment variables as needed.
   - The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 2. Without Docker (Manual Setup)

1. **Install Node.js (v18+ recommended) and npm.**
2. **Install dependencies:**
   ```bash
   cd webapp
   npm install
   ```
3. **Copy and configure environment variables:**
   ```bash
   cp .env.sample .env.local
   # Edit .env with your preferred editor
   ```
4. **Start the app:**
   ```bash
   npm run dev
   ```
   - The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 3. Configuration Notes
- All persistent data (config, database) is stored in `webapp/storage/`.
- For production, set strong secrets and passwords.
- For Telegram and Turnstile, obtain API keys and fill them in your `.env` or Docker environment.

---

For troubleshooting and advanced configuration, see other docs in the `/Docs` folder.
