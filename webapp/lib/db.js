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

    db.run(`CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      username TEXT NOT NULL,
      token TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      max_age INTEGER NOT NULL,
      invalidated INTEGER DEFAULT 0
    )`, (err) => {
      if (err) {
        console.error('Error creating sessions table', err);
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

function getTicketById(ticket_id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM tickets WHERE ticket_id = ?`;
    db.get(sql, [ticket_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function getSessionByToken(token) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM sessions WHERE token = ? AND invalidated = 0`;
    db.get(sql, [token], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function invalidateSessionById(session_id) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE sessions SET invalidated = 1 WHERE session_id = ?`;
    db.run(sql, [session_id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

function deleteSessionById(session_id) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM sessions WHERE session_id = ?`;
    db.run(sql, [session_id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

function deleteExpiredSessions() {
  const now = Math.floor(Date.now() / 1000);
  const sql = `DELETE FROM sessions WHERE (strftime('%s', 'now') - strftime('%s', created_at)) > max_age`;
  db.run(sql, [], function(err) {
    if (err) {
      console.error('Error deleting expired sessions', err);
    } else {
      console.log(`Deleted ${this.changes} expired sessions`);
    }
  });
}

// Schedule the deletion of expired sessions to run periodically
setInterval(deleteExpiredSessions, 60 * 60 * 1000); // Run every hour

module.exports = {
  db,
  createTicket,
  checkDuplicateTicketId,
  getTicketById,
  getSessionByToken,
  invalidateSessionById,
  deleteSessionById,
  deleteExpiredSessions
};