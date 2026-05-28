/**
 * POST /api/posts/create
 * Create a new post (requires authentication and credits)
 */

import { createPost, getUserById, updateUserCredits } from '../_db.js';
import { requireAuth, sendError, sendSuccess } from '../_auth.js';

const CREDIT_COST = 10; // Cost per post

async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendError(res, 'Method not allowed', 405);
  }

  try {
    const { title, content, type, tags, imageUrl } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return sendError(res, 'Title is required');
    }

    if (!content || !content.trim()) {
      return sendError(res, 'Content is required');
    }

    if (!type || !['news', 'blog', 'image'].includes(type)) {
      return sendError(res, 'Invalid post type');
    }

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return sendError(res, 'At least one tag is required');
    }

    // Check user credits
    const user = await getUserById(req.user.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    if (user.credits < CREDIT_COST) {
      return sendError(res, `Insufficient credits. You need ${CREDIT_COST} credits to post.`, 402);
    }

    // Create post
    const post = await createPost(
      req.user.id,
      title.trim(),
      content.trim(),
      type,
      tags,
      imageUrl || null
    );

    // Deduct credits
    await updateUserCredits(req.user.id, -CREDIT_COST);

    return sendSuccess(res, {
      post,
      creditsRemaining: user.credits - CREDIT_COST,
    }, 201);
  } catch (error) {
    console.error('Create post error:', error);
    return sendError(res, 'Internal server error', 500);
  }
}

export default requireAuth(handler);
