// scripts/sendTelegramNotification.js
// Sends a Telegram message using bot token and chat id from environment variables
import fs from 'fs';
import path from 'path';

/**
 * Reads the notification config from config.json.
 * Returns true if Telegram notification is enabled, false otherwise.
 */
function isTelegramNotificationEnabled() {
  try {
    const configPath = path.join(process.cwd(), 'storage', 'config.json');
    const configRaw = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configRaw);
    const telegramConfig = (config.notification || []).find(n => n.type === 'Telegram');
    return telegramConfig?.enabled;
  } catch (err) {
    console.error('Failed to read config.json:', err);
    return false;
  }
}

/**
 * Sends a Telegram notification with the given ticket info if enabled in config.json.
 * @param {string} ticket_id
 * @param {string} name
 * @param {string} email
 * @param {string} message
 */
async function sendTelegramNotification(ticket_id, name, email, message) {
  if (!isTelegramNotificationEnabled()) return;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (botToken && chatId) {
    // Use 'N/A' if name or email is empty
    const safeName = name?.trim() ? name : 'N/A';
    const safeEmail = email?.trim() ? email : 'N/A';
    const ticketInfo = `ID: ${ticket_id}\nName: ${safeName}\nEmail: ${safeEmail}\nMessage: ${message}`;
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `New ticket received on AnonyConnect:\n${ticketInfo}`
        })
      });
    } catch (err) {
      console.error('Failed to send Telegram notification:', err);
    }
  } else {
    console.error('TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set in environment variables');
  }
}

export default sendTelegramNotification;
