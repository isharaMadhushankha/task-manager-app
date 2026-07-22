const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_2026';

/**
 * POST /api/auth/login
 * Authenticates a user by email and password.
 * Returns a signed JWT token on success.
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // ── Validate Input ────────────────────────────────────────────────────────
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // ── Look up user by email in the users table ───────────────────────────
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // ── Compare provided password with hashed password ─────────────────────
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // ── Sign JWT Token ─────────────────────────────────────────────────────
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role || 'user',
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // ── Return token and basic user info ───────────────────────────────────
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || null,
        role: user.role || 'user',
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
};

module.exports = { login };
