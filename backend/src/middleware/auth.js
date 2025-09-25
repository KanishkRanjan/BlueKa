const jwt = require('jsonwebtoken');
const response = require('../utils/response');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.unauthorized(res, 'No token provided');
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return response.unauthorized(res, 'Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      return response.unauthorized(res, 'Token expired');
    }
    return response.error(res, 'Authentication failed', 500);
  }
};

module.exports = auth;
