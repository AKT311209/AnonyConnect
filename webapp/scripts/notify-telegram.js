require('dotenv').config();
const fetch = require('node-fetch');

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!botToken || !chatId) {
  console.error('TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set in .env');
  process.exit(1);
}

// Get ticket details from command line arguments or stdin
const [,, ...args] = process.argv;
let ticketDetail = args.join(' ');

if (!ticketDetail) {
  console.error('Please provide ticket details as argument.');
  process.exit(1);
}

const message = `New ticket received:\n${ticketDetail}`;

fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: chatId,
    text: message
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      console.log('Notification sent to Telegram.');
    } else {
      console.error('Failed to send Telegram message:', data);
    }
  })
  .catch(err => {
    console.error('Error sending Telegram message:', err);
  });
