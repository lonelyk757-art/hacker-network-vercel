/**
 * GET /api/posts/list
 * List posts with optional filters
 */

import { getPosts } from '../_db.js';
import { sendError, sendSuccess } from '../_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendError(res, 'Method not allowed', 405);
  }

  try {
    const { type, tag, userId, limit } = req.query;

    const filters = {
      type: type && type !== 'all' ? type : null,
      tag: tag || null,
      userId: userId ? parseInt(userId) : null,
      limit: limit ? Math.min(parseInt(limit), 100) : 50,
    };

    const posts = await getPosts(filters);

    return sendSuccess(res, { posts });
  } catch (error) {
    console.error('List posts error:', error);
    return sendError(res, 'Internal server error', 500);
  }
}
