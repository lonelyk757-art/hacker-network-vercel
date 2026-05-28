/**
 * PUT /api/admin/users/[id]/credits
 * Update user credits (admin only)
 */

import { updateUserCredits, getUserById } from '../../../_db.js';
import { requireAdmin, sendError, sendSuccess } from '../../../_auth.js';

async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return sendError(res, 'User ID is required');
  }

  if (req.method !== 'PUT') {
    return sendError(res, 'Method not allowed', 405);
  }

  try {
    const { amount } = req.body;

    if (amount === undefined || typeof amount !== 'number') {
      return sendError(res, 'Amount must be a number');
    }

    const user = await getUserById(parseInt(id));
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const updatedUser = await updateUserCredits(parseInt(id), amount);

    return sendSuccess(res, {
      user: updatedUser,
      message: `Credits updated: ${amount > 0 ? '+' : ''}${amount}`,
    });
  } catch (error) {
    console.error('Update credits error:', error);
    return sendError(res, 'Internal server error', 500);
  }
}

export default requireAdmin(handler);
