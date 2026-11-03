const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'foodbridge_super_secret_jwt_key_2026';

// Protect routes - verify JWT from cookie or Authorization header
const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check HttpOnly cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Check Authorization Bearer header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login to continue.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user from DB
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please login again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
    });
  }
};

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

// Specific role helpers
const isDonor = authorize('Donor');
const isRecipient = authorize('Recipient');

module.exports = {
  protect,
  authorize,
  isDonor,
  isRecipient,
  JWT_SECRET,
};

