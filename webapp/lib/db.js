const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const storageDir = path.resolve(process.cwd(), 'storage');
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir);
}

const dbPath = path.resolve(storageDir, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      sender_name TEXT,
      sender_email TEXT,
      message TEXT NOT NULL,
      password TEXT,
      status TEXT DEFAULT 'Pending',
      response TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err);
      }
    });
  }
});

function createTicket(ticket_id, sender_name, sender_email, message, password, status, response, callback) {
  const sql = `INSERT INTO tickets (ticket_id, sender_name, sender_email, message, password, status, response) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [ticket_id, sender_name, sender_email, message, password, status, response], function(err) {
    if (err) {
      return callback(err);
    }
    callback(null, { id: this.lastID });
  });
}

function checkDuplicateTicketId(ticket_id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT COUNT(*) AS count FROM tickets WHERE ticket_id = ?`;
    db.get(sql, [ticket_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count > 0);
      }
    });
  });
}

module.exports = {
  db,
  createTicket,
  checkDuplicateTicketId
};