import { join } from 'path';
import { promises as fs } from 'fs';
import sqlite3 from 'sqlite3';

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};

const dbPath = join(process.cwd(), 'storage', 'database.sqlite');

function runSql(sql) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) return reject('Failed to open database: ' + err.message);
    });
    // Only allow SELECT/PRAGMA/EXPLAIN/SHOW/BEGIN/ROLLBACK/COMMIT/INSERT/UPDATE/DELETE/CREATE/DROP/ALTER
    const safe = /^(select|pragma|explain|show|begin|rollback|commit|insert|update|delete|create|drop|alter)\b/i.test(sql.trim());
    if (!safe) {
      db.close();
      return reject('Only standard SQL statements are allowed.');
    }
    // If SELECT, use all; else run
    if (/^select\b/i.test(sql.trim())) {
      db.all(sql, (err, rows) => {
        db.close();
        if (err) return reject(err.message);
        resolve(JSON.stringify(rows, null, 2));
      });
    } else {
      db.run(sql, function(err) {
        db.close();
        if (err) return reject(err.message);
        resolve(`Query OK. Rows affected: ${this.changes}`);
      });
    }
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { sql } = req.body;
  if (!sql || typeof sql !== 'string') return res.status(400).json({ error: 'Missing SQL' });
  try {
    const output = await runSql(sql);
    res.status(200).json({ output });
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
}
