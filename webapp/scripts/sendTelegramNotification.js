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
    // Trim message to 500 chars, but keep last word full
    let trimmedMessage = message;
    if (message && message.length > 500) {
      let cut = message.slice(0, 500);
      // If the 500th char is not a space and not the end, backtrack to last space
      if (message[500] && message[500] !== ' ' && cut.lastIndexOf(' ') > 0) {
        cut = cut.slice(0, cut.lastIndexOf(' '));
      }
      trimmedMessage = `${cut}...`;
    }
    // Determine the base URL dynamically from environment or fallback to localhost
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'http://localhost:3000';
    // Bold the content using Markdown (Telegram supports *bold* with Markdown)
    const ticketInfo = `ID: *${ticket_id}*\nName: *${safeName}*\nEmail: *${safeEmail}*\nMessage:\n*${trimmedMessage}*\n\n[View Detail](${baseUrl}/admin/ticket/${ticket_id})`;
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `New ticket received on *AnonyConnect*:\n${ticketInfo}`,
          parse_mode: 'Markdown'
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
