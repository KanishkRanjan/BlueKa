const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');
const UserModel = require('../models/user.model');


const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};


exports.register = asyncHandler(async (req, res) => {
  const { email, password, username, full_name, timezone, locale } = req.body;

  if (!email || !password) {
    return response.validationError(res, [{ field: 'email/password', message: 'Email and password are required' }]);
  }

  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    return response.error(res, 'User with this email already exists', 409);
  }

  if (username) {
    const existingUsername = await UserModel.findByUsername(username);
    if (existingUsername) {
      return response.error(res, 'Username already taken', 409);
    }
  }

  const user = await UserModel.create({
    email,
    password,
    username,
    full_name,
    timezone,
    locale
  });

  const token = generateToken(user);

  return response.success(
    res,
    {
      user,
      token
    },
    'User registered successfully',
    201
  );
});
 
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return response.validationError(res, [{ field: 'email/password', message: 'Email and password are required' }]);
  }

  const user = await UserModel.findByEmail(email);
  if (!user) {
    return response.unauthorized(res, 'Invalid credentials');
  }
  const isValidPassword = await UserModel.verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    return response.unauthorized(res, 'Invalid credentials');
  }

  await UserModel.updateLastLogin(user.id);

  delete user.password_hash;

  const token = generateToken(user);

  return response.success(res, {
    user,
    token
  }, 'Login successful');
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user.id);
  
  if (!user) {
    return response.notFound(res, 'User');
  }

  return response.success(res, user, 'User retrieved successfully');
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return response.validationError(res, [{ field: 'passwords', message: 'Current and new passwords are required' }]);
  }

  const user = await UserModel.findByEmail(req.user.email);
  
  const isValid = await UserModel.verifyPassword(currentPassword, user.password_hash);
  if (!isValid) {
    return response.unauthorized(res, 'Current password is incorrect');
  }

  await UserModel.updatePassword(req.user.id, newPassword);

  return response.success(res, null, 'Password updated successfully');
});
