const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');
const IdentityModel = require('../models/identity.model');

exports.getAll = asyncHandler(async (req, res) => {
  const identities = await IdentityModel.findByUserIdWithStats(req.user.id);
  return response.success(res, identities, 'Identities retrieved successfully');
});

exports.getById = asyncHandler(async (req, res) => {
  const identity = await IdentityModel.findByIdWithStats(req.params.id);
  
  if (!identity) {
    return response.notFound(res, 'Identity');
  }

  if (identity.user_id !== req.user.id) {
    return response.forbidden(res, 'Access denied');
  }

  return response.success(res, identity, 'Identity retrieved successfully');
});

exports.create = asyncHandler(async (req, res) => {
  const identityData = {
    ...req.body,
    user_id: req.user.id
  };

  if (!identityData.identity_name) {
    return response.validationError(res, [{ field: 'identity_name', message: 'Identity name is required' }]);
  }

  const identity = await IdentityModel.create(identityData);
  return response.success(res, identity, 'Identity created successfully', 201);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const belongsToUser = await IdentityModel.belongsToUser(id, req.user.id);
  if (!belongsToUser) {
    return response.notFound(res, 'Identity');
  }

  const identity = await IdentityModel.update(id, req.body);
  return response.success(res, identity, 'Identity updated successfully');
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const belongsToUser = await IdentityModel.belongsToUser(id, req.user.id);
  if (!belongsToUser) {
    return response.notFound(res, 'Identity');
  }

  await IdentityModel.delete(id);
  return response.success(res, null, 'Identity deleted successfully');
});
