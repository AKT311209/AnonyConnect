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
  }
});

const dbReady = new Promise((resolve, reject) => {
  let pending = 6;
  function checkDone(err) {
    if (err) {
      reject(err);
    } else if (--pending === 0) {
      resolve();
    }
  }
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
  )`, checkDone);

  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    username TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    max_age INTEGER NOT NULL
  )`, checkDone);

  db.run(`CREATE TABLE IF NOT EXISTS ticket_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL,
    ticket_id TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    expires_at INTEGER NOT NULL
  )`, checkDone);

  db.run(`CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )`, checkDone);

  db.run(`CREATE TABLE IF NOT EXISTS admin_login_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL,
    username TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    used INTEGER DEFAULT 0
  )`, checkDone);
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

function getTicketsPaginated(offset, limit, sortBy = 'status', sortDir = 'ASC', status = 'All', publicOnly = false) {
  let orderBy = 'status ASC, created_at DESC';
  if (sortBy === 'submission_time') {
    orderBy = 'created_at DESC';
  } else if (sortBy === 'status') {
    orderBy = 'status ASC, created_at DESC';
  }
  let where = [];
  let params = [];
  if (publicOnly) {
    // For public tickets, do not show password-protected tickets
    where.push('(password IS NULL OR password = "")');
  }
  if (status && status !== 'All') {
    where.push('status = ?');
    params.push(status);
  }
  let whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return runAll(
    `SELECT ticket_id, created_at, sender_name, sender_email, status FROM tickets ${whereClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
}

function getTicketsCount(status = 'All', publicOnly = false) {
  let where = [];
  let params = [];
  if (publicOnly) {
    // For public tickets, do not show password-protected tickets
    where.push('(password IS NULL OR password = "")');
  }
  if (status && status !== 'All') {
    where.push('status = ?');
    params.push(status);
  }
  let whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return runGet(`SELECT COUNT(*) as count FROM tickets ${whereClause}`, params).then(row => row.count);
}

function createOneTimeToken(ticket_id, token, expires_at) {
  const sql = 'INSERT INTO ticket_tokens (token, ticket_id, expires_at) VALUES (?, ?, ?)';
  return runExec(sql, [token, ticket_id, expires_at]);
}

function getValidToken(token, ticket_id) {
  const now = Math.floor(Date.now() / 1000);
  return runGet('SELECT * FROM ticket_tokens WHERE token = ? AND ticket_id = ? AND used = 0 AND expires_at > ?', [token, ticket_id, now]);
}

function markTokenUsed(token) {
  return runExec('UPDATE ticket_tokens SET used = 1 WHERE token = ?', [token]);
}

function cleanupExpiredTokens() {
  const now = Math.floor(Date.now() / 1000);
  db.run('DELETE FROM ticket_tokens WHERE expires_at <= ?', [now], (err) => {
    if (err) {
      if (typeof window === 'undefined') {
        console.error('Error deleting expired tokens', err);
      }
    }
  });
}

setInterval(cleanupExpiredTokens, 60 * 60 * 1000); // Clean up expired tokens every hour

// Centralized DB actions for admin_settings
function getAdminSetting(key) {
  return new Promise((resolve, reject) => {
    db.get('SELECT value FROM admin_settings WHERE key = ?', [key], (err, row) => {
      if (err) return reject(err);
      resolve(row ? row.value : null);
    });
  });
}

function setAdminSetting(key, value) {
  return new Promise((resolve, reject) => {
    db.run('INSERT OR REPLACE INTO admin_settings (key, value) VALUES (?, ?)', [key, value], function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function removeAdminSetting(key) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM admin_settings WHERE key = ?', [key], function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function clear2FASettings() {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM admin_settings WHERE key = "2fa_secret"', [], function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function runArbitrarySql(sql) {
  // Only allow SELECT/PRAGMA/EXPLAIN/SHOW/BEGIN/ROLLBACK/COMMIT/INSERT/UPDATE/DELETE/CREATE/DROP/ALTER
  const safe = /^(select|pragma|explain|show|begin|rollback|commit|insert|update|delete|create|drop|alter)\b/i.test(sql.trim());
  if (!safe) throw new Error('Only standard SQL statements are allowed.');
  if (/^select\b/i.test(sql.trim())) {
    return runAll(sql);
  } else {
    const changes = await runExec(sql);
    return `Query OK. Rows affected: ${changes}`;
  }
}

// Admin login tokens helpers
function createAdminLoginToken(token, username, expires_at) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO admin_login_tokens (token, username, expires_at) VALUES (?, ?, ?)', [token, username, expires_at], function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function getValidAdminLoginToken(token) {
  const now = Math.floor(Date.now() / 1000);
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM admin_login_tokens WHERE token = ? AND used = 0 AND expires_at > ?', [token, now], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function markAdminLoginTokenUsed(token) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE admin_login_tokens SET used = 1 WHERE token = ?', [token], function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function cleanupExpiredAdminLoginTokens() {
  const now = Math.floor(Date.now() / 1000);
  db.run('DELETE FROM admin_login_tokens WHERE expires_at <= ?', [now], (err) => {
    if (err) {
      if (typeof window === 'undefined') {
        console.error('Error deleting expired admin login tokens', err);
      }
    }
  });
}

setInterval(cleanupExpiredAdminLoginTokens, 60 * 60 * 1000); // Clean up expired admin login tokens every hour

function deleteAllAdminSessions() {
  return runExec('DELETE FROM sessions WHERE username = ?', [process.env.ADMIN_USERNAME]);
}

module.exports = {
  db,
  dbReady,
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
  getTicketsCount,
  createOneTimeToken,
  getValidToken,
  markTokenUsed,
  getAdminSetting,
  setAdminSetting,
  runArbitrarySql,
  removeAdminSetting,
  clear2FASettings,
  createAdminLoginToken,
  getValidAdminLoginToken,
  markAdminLoginTokenUsed,
  deleteAllAdminSessions,
};