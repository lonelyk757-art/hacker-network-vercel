/**
 * GET /api/admin/users
 * List all users (admin only)
 */

import { getAllUsers, deleteUser } from '../_db.js';
import { requireAdmin, sendError, sendSuccess } from '../_auth.js';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const users = await getAllUsers();
      return sendSuccess(res, { users });
    } catch (error) {
      console.error('Get users error:', error);
      return sendError(res, 'Internal server error', 500);
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { userId } = req.body;

      if (!userId) {
        return sendError(res, 'User ID is required');
      }

      await deleteUser(userId);
      return sendSuccess(res, { message: 'User deleted' });
    } catch (error) {
      console.error('Delete user error:', error);
      return sendError(res, 'Internal server error', 500);
    }
  }

  return sendError(res, 'Method not allowed', 405);
}

export default requireAdmin(handler);
