/**
 * Authentication Helper Module
 * Handles JWT token generation and verification
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const TOKEN_EXPIRY = '7d';

// ============================================
// PASSWORD HASHING
// ============================================

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// ============================================
// JWT TOKENS
// ============================================

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function extractToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// ============================================
// MIDDLEWARE
// ============================================

export function requireAuth(handler) {
  return async (req, res) => {
    try {
      const token = extractToken(req.headers.authorization);
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = verifyToken(token);
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = user;
      return handler(req, res);
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export function requireAdmin(handler) {
  return requireAuth(async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return handler(req, res);
  });
}

// ============================================
// RESPONSE HELPERS
// ============================================

export function sendError(res, message, status = 400) {
  return res.status(status).json({ message });
}

export function sendSuccess(res, data, status = 200) {
  return res.status(status).json(data);
}

// ============================================
// VALIDATION
// ============================================

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 8;
}

export function validateUsername(username) {
  return username && username.length >= 3 && username.length <= 30;
}
