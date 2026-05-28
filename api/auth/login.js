/**
 * POST /api/auth/login
 * Login with email and password
 */

import { getUserByEmail, getUserById } from '../_db.js';
import { verifyPassword, generateToken, sendError, sendSuccess, validateEmail } from '../_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendError(res, 'Method not allowed', 405);
  }

  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !validateEmail(email)) {
      return sendError(res, 'Invalid email format');
    }

    if (!password || password.length < 8) {
      return sendError(res, 'Invalid password');
    }

    // Find user
    const user = await getUserByEmail(email);
    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken(user);

    // Return user data (without password)
    const { password_hash, ...userWithoutPassword } = user;

    return sendSuccess(res, {
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, 'Internal server error', 500);
  }
}
