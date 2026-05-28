/**
 * GET/POST /api/posts/[id]/comments
 * Get comments or add a new comment
 */

import { getComments, addComment, deleteComment, getPostById } from '../../_db.js';
import { requireAuth, sendError, sendSuccess } from '../../_auth.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return sendError(res, 'Post ID is required');
  }

  try {
    const postId = parseInt(id);

    // Check post exists
    const post = await getPostById(postId);
    if (!post) {
      return sendError(res, 'Post not found', 404);
    }

    if (req.method === 'GET') {
      const comments = await getComments(postId);
      return sendSuccess(res, { comments });
    }

    if (req.method === 'POST') {
      // Require authentication
      const token = req.headers.authorization?.substring(7);
      if (!token) {
        return sendError(res, 'Unauthorized', 401);
      }

      const { content } = req.body;

      if (!content || !content.trim()) {
        return sendError(res, 'Comment content is required');
      }

      const comment = await addComment(postId, req.user.id, content.trim());
      return sendSuccess(res, { comment }, 201);
    }

    return sendError(res, 'Method not allowed', 405);
  } catch (error) {
    console.error('Comments error:', error);
    return sendError(res, 'Internal server error', 500);
  }
}
