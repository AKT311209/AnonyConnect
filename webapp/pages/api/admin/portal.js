import fs from 'fs';
import path from 'path';
import { getTicketsPaginated, getTicketsCount } from '../../../lib/db';
import { withAdminAuth } from '../../../utils/withAdminAuth';

const configPath = path.join(process.cwd(), 'storage', 'config.json');

export default withAdminAuth(async function handler(req, res) {
  try {
    // Read config for default page size
    let config = { appearance: { admin: { ticketsPagination: 20 } } };
    try {
      const data = fs.readFileSync(configPath, 'utf-8');
      config = JSON.parse(data);
    } catch (e) {}
    const defaultPageSize = config.appearance?.admin?.ticketsPagination || 20;

    // Parse query params
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || defaultPageSize;
    const sortBy = req.query.sortBy || 'status';
    const sortDir = req.query.sortDir || 'ASC';
    const offset = (page - 1) * pageSize;

    // Fetch paginated tickets and total count
    const [tickets, total] = await Promise.all([
      getTicketsPaginated(offset, pageSize, sortBy, sortDir),
      getTicketsCount()
    ]);
    res.status(200).json({ tickets, total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});
