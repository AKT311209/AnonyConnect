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

// Utility to auto-reject and auto-cleanup tickets (for scheduled/cron use or API)
function autoRejectAndCleanup(config, callback) {
  const now = Math.floor(Date.now() / 1000);
  let rejected = 0;
  let deleted = 0;
  // Auto Reject
  if (config.autoReject?.enabled) {
    console.log(`[TicketCleaner] Running auto-reject task at ${new Date().toISOString()}`);
    const timeout = Number(config.autoReject.timeout) || 2592000;
    db.all(`SELECT ticket_id, created_at FROM tickets WHERE status = 'Pending'`, [], async (err, rows) => {
      if (err) return callback(err);
      for (const row of rows) {
        const created = Math.floor(new Date(row.created_at).getTime() / 1000);
        if (now - created > timeout) {
          await rejectTicket(row.ticket_id);
          rejected++;
        }
      }
      // Auto Cleanup
      if (config.autoCleanup?.enabled) {
        console.log(`[TicketCleaner] Running auto-cleanup task at ${new Date().toISOString()}`);
        const cleanupTimeout = Number(config.autoCleanup.timeout) || 2592000;
        db.run(`DELETE FROM tickets WHERE (strftime('%s','now') - strftime('%s', created_at)) > ?`, [cleanupTimeout], function (cleanupErr) {
          if (cleanupErr) return callback(cleanupErr);
          deleted = this.changes;
          callback(null, { rejected, deleted });
        });
      } else {
        callback(null, { rejected });
      }
    });
  } else if (config.autoCleanup?.enabled) {
    // Only cleanup
    console.log(`[TicketCleaner] Running auto-cleanup task at ${new Date().toISOString()}`);
    const cleanupTimeout = Number(config.autoCleanup.timeout) || 2592000;
    db.run(`DELETE FROM tickets WHERE (strftime('%s','now') - strftime('%s', created_at)) > ?`, [cleanupTimeout], function (cleanupErr) {
      if (cleanupErr) return callback(cleanupErr);
      deleted = this.changes;
      callback(null, { deleted });
    });
  } else {
    callback(null, { message: 'No action taken' });
  }
}

// Schedule the deletion of expired sessions to run periodically
setInterval(deleteExpiredSessions, 60 * 60 * 1000); // Run every hour

// Start background auto-reject and cleanup task
(function startBackgroundTicketCleaner() {
  const path = require('path');
  const fs = require('fs');
  const configPath = path.resolve(process.cwd(), 'storage', 'config.json');
  function runCleaner() {
    let config;
    try {
      const configRaw = fs.readFileSync(configPath, 'utf-8');
      config = JSON.parse(configRaw);
    } catch (e) {
      console.error('[TicketCleaner] Failed to read config file:', e);
      setTimeout(runCleaner, 60 * 60 * 1000); // 1 hour
      return;
    }
    autoRejectAndCleanup(config, (err, result) => {
      if (err) {
        console.error('[TicketCleaner] Error:', err);
      } else {
        console.log(`[TicketCleaner ${new Date().toISOString()}]`, result);
      }
      setTimeout(runCleaner, 60 * 60 * 1000); // 1 hour
    });
  }
  if (process.env.NODE_ENV !== 'test') runCleaner();
})();

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
  fetchTicketDetails,
  autoRejectAndCleanup
};