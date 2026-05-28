/**
 * GET /api/auth/me
 * Get current user info
 */

import { getUserById } from '../_db.js';
import { requireAuth, sendError, sendSuccess } from '../_auth.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendError(res, 'Method not allowed', 405);
  }

  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const { password_hash, ...userWithoutPassword } = user;
    return sendSuccess(res, { user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    return sendError(res, 'Internal server error', 500);
  }
}

export default requireAuth(handler);
