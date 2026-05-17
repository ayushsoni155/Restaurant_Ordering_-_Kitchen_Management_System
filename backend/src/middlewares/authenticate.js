const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * authenticate middleware
 *
 * Token resolution order:
 *   1. HttpOnly cookie named `token`  (set by login / register)
 *   2. Authorization: Bearer <token>  header (API / mobile clients)
 *
 * On success: attaches `req.user = { userId, role }` and calls next().
 * On failure: responds with 401 Unauthorized.
 *
 * Usage:
 *   router.get('/protected', authenticate, handler);
 */
const authenticate = (req, res, next) => {
  // ── 1. Try cookie first ──────────────────────────────────────────────────────
  let token = req.cookies?.token;

  // ── 2. Fall back to Authorization: Bearer <token> ───────────────────────────
  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { userId, role, iat, exp }
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (err) {
    logger.warn(`JWT verification failed: ${err.message}`);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please log in again.',
    });
  }
};

module.exports = authenticate;
