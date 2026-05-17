/**
 * authorizeRoles middleware factory
 *
 * Restricts a route to one or more allowed roles.
 * Must be used AFTER the `authenticate` middleware (which sets req.user).
 *
 * Usage:
 *   router.get('/admin-only', authenticate, authorizeRoles('admin'), handler);
 *   router.get('/staff',      authenticate, authorizeRoles('admin', 'chef', 'waiter'), handler);
 *
 * @param {...string} roles - Allowed role names (admin | chef | waiter)
 * @returns Express middleware
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      // Safeguard: authenticate middleware should always run first
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}.`,
      });
    }

    next();
  };
};

module.exports = authorizeRoles;
