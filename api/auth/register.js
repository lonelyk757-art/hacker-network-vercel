/**
 * POST /api/auth/register
 * Register a new user
 */

import { createUser, getUserByEmail } from '../_db.js';
import { hashPassword, generateToken, sendError, sendSuccess, validateEmail, validatePassword, validateUsername } from '../_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendError(res, 'Method not allowed', 405);
  }

  try {
    const { email, password, username } = req.body;

    // Validation
    if (!validateEmail(email)) {
      return sendError(res, 'Invalid email format');
    }

    if (!validatePassword(password)) {
      return sendError(res, 'Password must be at least 8 characters');
    }

    if (!validateUsername(username)) {
      return sendError(res, 'Username must be between 3 and 30 characters');
    }

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return sendError(res, 'Email already registered', 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await createUser(email, passwordHash, username);

    // Generate token
    const token = generateToken(user);

    // Return user data (without password)
    const { password_hash, ...userWithoutPassword } = user;

    return sendSuccess(res, {
      token,
      user: userWithoutPassword,
    }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return sendError(res, 'Internal server error', 500);
  }
}
