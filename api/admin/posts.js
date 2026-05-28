/**
 * GET/DELETE /api/admin/posts
 * Manage all posts (admin only)
 */

import { getPosts, deletePost } from '../_db.js';
import { requireAdmin, sendError, sendSuccess } from '../_auth.js';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const posts = await getPosts({ limit: 1000 });
      return sendSuccess(res, { posts });
    } catch (error) {
      console.error('Get posts error:', error);
      return sendError(res, 'Internal server error', 500);
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { postId } = req.body;

      if (!postId) {
        return sendError(res, 'Post ID is required');
      }

      await deletePost(postId);
      return sendSuccess(res, { message: 'Post deleted' });
    } catch (error) {
      console.error('Delete post error:', error);
      return sendError(res, 'Internal server error', 500);
    }
  }

  return sendError(res, 'Method not allowed', 405);
}

export default requireAdmin(handler);
