const { Router } = require('express');
const { register, login, getMe, logout } = require('../controllers/auth.controller');
const authenticate = require('../middlewares/authenticate');

const router = Router();

// ── Public routes ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Register a new staff account.
 * Body: { name, phone, password, role }
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Login and receive a JWT token.
 * Body: { phone, password }
 */
router.post('/login', login);

// ── Protected routes (require valid JWT) ──────────────────────────────────────

/**
 * GET /api/auth/me
 * Return the currently logged-in user's profile.
 * Header: Authorization: Bearer <token>
 */
router.get('/me', authenticate, getMe);

/**
 * POST /api/auth/logout
 * Stateless logout — instructs client to discard the token.
 * Header: Authorization: Bearer <token>
 */
router.post('/logout', authenticate, logout);

module.exports = router;
