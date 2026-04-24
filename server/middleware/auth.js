import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && JWT_SECRET.length < 32) {
  throw new Error('[AUTH] JWT_SECRET must be set to at least 32 characters in production.');
}

const tokenSecret = JWT_SECRET || 'dev-only-mrt-jwt-secret-change-before-production';

export function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, tokenSecret, { expiresIn: '7d' });
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, tokenSecret);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
