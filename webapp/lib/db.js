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
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      max_age INTEGER NOT NULL
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

function getAllTickets() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT ticket_id, created_at, sender_name, sender_email, status FROM tickets`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getSessionById(session_id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM sessions WHERE session_id = ?`;
    db.get(sql, [session_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
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

function respondToTicket(ticketId, response) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE tickets SET status = 'Responded', response = ? WHERE ticket_id = ?`;
    db.run(sql, [response, ticketId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function rejectTicket(ticketId) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE tickets SET status = 'Rejected' WHERE ticket_id = ?`;
    db.run(sql, [ticketId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function fetchTicketDetails(ticketId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT ticket_id, created_at, sender_name, sender_email, message, status, response, 
                 CASE WHEN password IS NOT NULL THEN 'Yes' ELSE 'No' END AS password_protected 
                 FROM tickets WHERE ticket_id = ?`;
    db.get(sql, [ticketId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Schedule the deletion of expired sessions to run periodically
setInterval(deleteExpiredSessions, 60 * 60 * 1000); // Run every hour

module.exports = {
  db,
  createTicket,
  checkDuplicateTicketId,
  getTicketById,
  getAllTickets,
  getSessionById,
  deleteSessionById,
  deleteExpiredSessions,
  respondToTicket,
  rejectTicket,
  fetchTicketDetails
};