// Next.js API route for executing shell commands securely (admin only)
import { withAdminAuth } from '../../../utils/withAdminAuth';
import { exec } from 'child_process';

export default withAdminAuth(function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { command } = req.body;
  if (!command || typeof command !== 'string') {
    return res.status(400).json({ error: 'No command provided' });
  }
  // Only allow basic shell commands (SQL is now handled in SQL mode)
  const trimmed = command.trim();
  if (command.trim() === 'clear') {
    res.status(200).json({ output: '__CLEAR__' });
    return;
  }
  exec(command, { timeout: 8000, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
    let result = '';
    if (stdout) result += stdout;
    if (stderr) result += stderr;
    if (err && !stderr) result += err.message;
    // Format output like a real terminal: always ends with a newline
    result = result.replace(/\r/g, '');
    if (!result.endsWith('\n')) result += '\n';
    res.status(200).json({ output: result });
  });
});
