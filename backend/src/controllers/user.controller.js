const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');
const UserModel = require('../models/user.model');


exports.getById = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  
  if (!user) {
    return response.notFound(res, 'User');
  }

  return response.success(res, user, 'User retrieved successfully');
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) !== req.user.id) {
    return response.forbidden(res, 'You can only update your own profile');
  }

  const user = await UserModel.update(id, req.body);
  return response.success(res, user, 'Profile updated successfully');
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) !== req.user.id) {
    return response.forbidden(res, 'You can only delete your own account');
  }

  await UserModel.delete(id);
  return response.success(res, null, 'Account deleted successfully');
});

exports.getStats = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) !== req.user.id) {
    return response.forbidden(res, 'Access denied');
  }

  const stats = await UserModel.getStats(id);
  return response.success(res, stats, 'Statistics retrieved successfully');
});
