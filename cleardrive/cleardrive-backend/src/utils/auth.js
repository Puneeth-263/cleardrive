const jwt = require('jsonwebtoken');

// IMPORTANT: set a real JWT_SECRET in your .env in production. This
// fallback is only for local demo use and is NOT safe to ship as-is.
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me';

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: '30d',
  });
}

// Attaches req.user if a valid Bearer token is present; does not block
// the request if missing (use requireAuth for that).
function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      req.user = null;
    }
  }
  next();
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Login required' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session, please log in again' });
  }
}

// Simple shared-password admin gate (not per-user accounts). Set
// ADMIN_PASSWORD in your .env; the admin login route trades that
// password for a short-lived admin token.
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Admin login required' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired admin session' });
  }
}

function signAdminToken() {
  return jwt.sign({ isAdmin: true }, JWT_SECRET, { expiresIn: '12h' });
}

module.exports = { signToken, optionalAuth, requireAuth, requireAdmin, signAdminToken };
