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
    )`, (err2) => {
      if (err2) {
        console.error('Error creating table', err2);
      }
    });

    db.run(`CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      username TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      max_age INTEGER NOT NULL
    )`, (err3) => {
      if (err3) {
        console.error('Error creating sessions table', err3);
      }
    });
  }
});

// Generic helpers
function runGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function runAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function runExec(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
}

function createTicket({ ticket_id, sender_name, sender_email, message, password, status, response }) {
  const sql = 'INSERT INTO tickets (ticket_id, sender_name, sender_email, message, password, status, response) VALUES (?, ?, ?, ?, ?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.run(sql, [ticket_id, sender_name, sender_email, message, password, status, response], function(err) {
      if (err) return reject(err);
      return resolve({ id: this.lastID });
    });
  });
}

function checkDuplicateTicketId(ticket_id) {
  return runGet('SELECT COUNT(*) AS count FROM tickets WHERE ticket_id = ?', [ticket_id])
    .then(row => row.count > 0);
}

function getTicketById(ticket_id) {
  return runGet('SELECT * FROM tickets WHERE ticket_id = ?', [ticket_id]);
}

function getAllTickets() {
  return runAll('SELECT ticket_id, created_at, sender_name, sender_email, status FROM tickets');
}

function getSessionById(session_id) {
  return runGet('SELECT * FROM sessions WHERE session_id = ?', [session_id]);
}

function deleteSessionById(session_id) {
  console.log('Deleting session with ID:', session_id);
  return runExec('DELETE FROM sessions WHERE session_id = ?', [session_id]);
}

function deleteExpiredSessions() {
  const sql = "DELETE FROM sessions WHERE (strftime('%s', 'now') - strftime('%s', created_at)) > max_age";
  db.run(sql, [], (err) => {
    if (err) {
      if (typeof window === 'undefined') {
        console.error('Error deleting expired sessions', err);
      }
    }
  });
}

function respondToTicket(ticketId, response) {
  return runExec('UPDATE tickets SET status = \'Responded\', response = ? WHERE ticket_id = ?', [response, ticketId]);
}

function rejectTicket(ticketId) {
  return runExec('UPDATE tickets SET status = \'Rejected\' WHERE ticket_id = ?', [ticketId]);
}

function fetchTicketDetails(ticketId) {
  return runGet('SELECT ticket_id, created_at, sender_name, sender_email, message, status, response, CASE WHEN password IS NOT NULL THEN \'Yes\' ELSE \'No\' END AS password_protected FROM tickets WHERE ticket_id = ?', [ticketId]);
}

// Utility to auto-reject and auto-cleanup tickets (for scheduled/cron use or API)
async function autoRejectAndCleanup(config, callback) {
  try {
    const now = Math.floor(Date.now() / 1000);
    let rejected = 0;
    let deleted = 0;
    if (config.autoReject?.enabled) {
      const timeout = Number(config.autoReject.timeout) || 2592000;
      const pendingTickets = await runAll('SELECT ticket_id, created_at FROM tickets WHERE status = \'Pending\'');
      for (const row of pendingTickets) {
        const created = Math.floor(new Date(row.created_at).getTime() / 1000);
        if (now - created > timeout) {
          await rejectTicket(row.ticket_id);
          rejected++;
        }
      }
    }
    if (config.autoCleanup?.enabled) {
      const cleanupTimeout = Number(config.autoCleanup.timeout) || 2592000;
      // Only delete tickets that are NOT 'Pending' and are older than the timeout
      deleted = await runExec("DELETE FROM tickets WHERE status != 'Pending' AND (strftime('%s','now') - strftime('%s', created_at)) > ?", [cleanupTimeout]);
    }
    callback(null, { rejected, deleted });
  } catch (err) {
    callback(err);
  }
}

// Schedule the deletion of expired sessions to run periodically
setInterval(deleteExpiredSessions, 60 * 60 * 1000); // Run every hour

function undoTicketAction(ticketId) {
  return runExec("UPDATE tickets SET status = 'Pending', response = NULL WHERE ticket_id = ?", [ticketId]);
}

function getTicketsPaginated(offset, limit, sortBy = 'status', sortDir = 'ASC') {
  let orderBy = 'status ASC, created_at DESC';
  if (sortBy === 'submission_time') {
    orderBy = 'created_at DESC';
  } else if (sortBy === 'status') {
    orderBy = 'status ASC, created_at DESC';
  }
  return runAll(
    `SELECT ticket_id, created_at, sender_name, sender_email, status FROM tickets ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    [limit, offset]
  );
}

function getTicketsCount() {
  return runGet('SELECT COUNT(*) as count FROM tickets').then(row => row.count);
}

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
  autoRejectAndCleanup,
  undoTicketAction,
  getTicketsPaginated,
  getTicketsCount
};