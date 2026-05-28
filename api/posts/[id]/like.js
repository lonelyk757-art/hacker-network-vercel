/**
 * POST /api/posts/[id]/like
 * Like a post
 */

import { likePost, getPostById } from '../../_db.js';
import { requireAuth, sendError, sendSuccess } from '../../_auth.js';

async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return sendError(res, 'Post ID is required');
  }

  if (req.method !== 'POST') {
    return sendError(res, 'Method not allowed', 405);
  }

  try {
    const post = await getPostById(parseInt(id));
    if (!post) {
      return sendError(res, 'Post not found', 404);
    }

    const updatedPost = await likePost(parseInt(id));
    return sendSuccess(res, { post: updatedPost });
  } catch (error) {
    console.error('Like post error:', error);
    return sendError(res, 'Internal server error', 500);
  }
}

export default requireAuth(handler);
