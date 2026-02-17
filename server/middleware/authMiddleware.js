// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Removed: const asyncHandler = require('express-async-handler'); // Remove if present

const protect = (roles = []) => async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request object (excluding password)
      // Check if roles array is provided and user role is allowed
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      // Check if user's role is included in the allowed roles
      if (roles.length > 0 && !roles.includes(user.role)) {
        res.status(403); // Forbidden
        throw new Error(`Forbidden: ${user.role} is not authorized for this action`);
      }

      // For doctors, check if they are approved
      if (user.role === 'doctor' && !user.isApproved && !req.path.includes('/doctors/pending')) { // Allow pending doctors to access pending list
        res.status(403); // Forbidden
        throw new Error('Doctor account not approved');
      }

      req.user = user; // Attach user to request
      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

module.exports = { protect };