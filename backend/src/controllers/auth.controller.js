const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const logger = require('../utils/logger');

// ── Helper: sign JWT ───────────────────────────────────────────────────────────
const signToken = (payload) =>
    jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

// ── Helper: cookie options ───────────────────────────────────────────────────
const cookieOptions = () => {
    // Parse JWT_EXPIRES_IN (e.g. "7d", "24h", "3600") → milliseconds for maxAge
    const raw = process.env.JWT_EXPIRES_IN || '7d';
    const units = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
    const match = raw.match(/^(\d+)([smhd]?)$/);
    const maxAge = match
        ? parseInt(match[1], 10) * (units[match[2]] || 1000)
        : 7 * 86_400_000; // fallback: 7 days

    return {
        httpOnly: true,                              // not accessible via JS
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
        sameSite: 'strict',
        maxAge,                                      // milliseconds
        path: '/',
    };
};

// ── POST /api/auth/register ────────────────────────────────────────────────────
/**
 * Register a new staff account.
 * Body: { name, phone, password, role }
 * role must be one of: admin | chef | waiter
 */
const register = async (req, res, next) => {
    try {
        const { name, phone, password, role } = req.body;

        // ── Validate required fields ─────────────────────────────────────────────
        if (!name || !phone || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'name, phone, password, and role are required.',
            });
        }

        // ── Check if phone already exists ────────────────────────────────────────
        const existingUser = await User.findOne({ where: { phone } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'A user with this phone number already exists.',
            });
        }

        // ── Resolve role → role_id ───────────────────────────────────────────────
        const roleRecord = await Role.findOne({ where: { name: role } });
        if (!roleRecord) {
            return res.status(400).json({
                success: false,
                message: `Role '${role}' is not valid. Allowed: admin, chef, waiter.`,
            });
        }

        // ── Hash password ────────────────────────────────────────────────────────
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // ── Create user ──────────────────────────────────────────────────────────
        const user = await User.create({
            name,
            phone,
            password_hash,
            role_id: roleRecord.role_id,
        });
        // ── Sign JWT ─────────────────────────────────────────────────────────────
        const token = signToken({
            userId: user.user_id,
            role: user.role
        });
        logger.info(`New user registered: ${name} (${phone}) as ${role}`);

        // ── Set token cookie ─────────────────────────────────────────────────────
        res.cookie('token', token, cookieOptions());

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            data: {
                userId: user.user_id,
                name: user.name,
                phone: user.phone,
                role,
            },
        });
    } catch (err) {
        next(err);
    }
};

// ── POST /api/auth/login ───────────────────────────────────────────────────────
/**
 * Login and receive a JWT.
 * Body: { phone, password }
 */
const login = async (req, res, next) => {
    try {
        const { phone, password } = req.body;

        // ── Validate required fields ─────────────────────────────────────────────
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'phone and password are required.',
            });
        }

        // ── Find user with role ──────────────────────────────────────────────────
        const user = await User.findOne({
            where: { phone },
            include: [{ model: Role, as: 'role', attributes: ['name'] }],
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid phone or password.',
            });
        }

        // ── Check account is active ──────────────────────────────────────────────
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Contact the admin.',
            });
        }

        // ── Verify password ──────────────────────────────────────────────────────
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid phone or password.',
            });
        }

        // ── Sign JWT ─────────────────────────────────────────────────────────────
        const token = signToken({
            userId: user.user_id,
            role: user.role.name,
        });

        logger.info(`User logged in: ${user.name} (${user.phone})`);

        // ── Set token cookie ─────────────────────────────────────────────────────
        res.cookie('token', token, cookieOptions());

        return res.status(200).json({
            success: true,
            token,
            data: {
                userId: user.user_id,
                name: user.name,
                role: user.role.name,
            },
        });
    } catch (err) {
        next(err);
    }
};

// ── GET /api/auth/me ───────────────────────────────────────────────────────────
/**
 * Return the currently authenticated user's profile.
 * Requires: Authorization: Bearer <token>
 */
const getMe = async (req, res, next) => {
    try {
        // req.user is attached by the authenticate middleware
        const user = await User.findByPk(req.user.userId, {
            attributes: ['user_id', 'name', 'phone', 'is_active', 'created_at'],
            include: [{ model: Role, as: 'role', attributes: ['name'] }],
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                userId: user.user_id,
                name: user.name,
                phone: user.phone,
                role: user.role.name,
                isActive: user.is_active,
                createdAt: user.created_at,
            },
        });
    } catch (err) {
        next(err);
    }
};

// ── POST /api/auth/logout ──────────────────────────────────────────────────────
/**
 * Stateless logout — instructs the client to discard its token.
 * Requires: Authorization: Bearer <token>
 */
const logout = (req, res) => {
    logger.info(`User logged out: userId=${req.user.userId}`);
    // ── Clear token cookie ───────────────────────────────────────────────────────
    res.clearCookie('token', { httpOnly: true, sameSite: 'strict', path: '/' });
    return res.status(200).json({
        success: true,
        message: 'Logged out successfully.',
    });
};

module.exports = { register, login, getMe, logout };
