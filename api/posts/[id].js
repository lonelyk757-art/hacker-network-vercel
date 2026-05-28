/**
 * GET /api/posts/[id]
 * Get a single post with comments
 */

import { getPostById, deletePost } from '../_db.js';
import { requireAuth, sendError, sendSuccess } from '../_auth.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return sendError(res, 'Post ID is required');
  }

  try {
    if (req.method === 'GET') {
      const post = await getPostById(parseInt(id));
      
      if (!post) {
        return sendError(res, 'Post not found', 404);
      }

      return sendSuccess(res, { post });
    }

    if (req.method === 'DELETE') {
      // Require authentication
      const token = req.headers.authorization?.substring(7);
      if (!token) {
        return sendError(res, 'Unauthorized', 401);
      }

      const post = await getPostById(parseInt(id));
      if (!post) {
        return sendError(res, 'Post not found', 404);
      }

      // Check ownership or admin
      if (post.user_id !== req.user?.id && req.user?.role !== 'admin') {
        return sendError(res, 'Forbidden', 403);
      }

      await deletePost(parseInt(id));
      return sendSuccess(res, { message: 'Post deleted' });
    }

    return sendError(res, 'Method not allowed', 405);
  } catch (error) {
    console.error('Get post error:', error);
    return sendError(res, 'Internal server error', 500);
  }
}
