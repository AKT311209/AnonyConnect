const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(process.cwd(), 'database.sqlite');

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
      status TEXT DEFAULT 'Pending'
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err);
      }
    });
  }
});

function createTicket(ticket_id, sender_name, sender_email, message, password, status, callback) {
  const sql = `INSERT INTO tickets (ticket_id, sender_name, sender_email, message, password, status) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [ticket_id, sender_name, sender_email, message, password, status], function(err) {
    if (err) {
      return callback(err);
    }
    callback(null, { id: this.lastID });
  });
}

module.exports = {
  db,
  createTicket
};