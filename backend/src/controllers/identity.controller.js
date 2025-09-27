const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');
const IdentityModel = require('../models/identity.model');

/**
 * Get all identities for current user
 * GET /api/identities
 */
exports.getAll = asyncHandler(async (req, res) => {
  const identities = await IdentityModel.findByUserIdWithStats(req.user.id);
  return response.success(res, identities, 'Identities retrieved successfully');
});

/**
 * Get identity by ID
 * GET /api/identities/:id
 */
exports.getById = asyncHandler(async (req, res) => {
  const identity = await IdentityModel.findByIdWithStats(req.params.id);
  
  if (!identity) {
    return response.notFound(res, 'Identity');
  }

  // Check ownership
  if (identity.user_id !== req.user.id) {
    return response.forbidden(res, 'Access denied');
  }

  return response.success(res, identity, 'Identity retrieved successfully');
});

/**
 * Create new identity
 * POST /api/identities
 */
exports.create = asyncHandler(async (req, res) => {
  const identityData = {
    ...req.body,
    user_id: req.user.id
  };

  // Validation
  if (!identityData.identity_name) {
    return response.validationError(res, [{ field: 'identity_name', message: 'Identity name is required' }]);
  }

  const identity = await IdentityModel.create(identityData);
  return response.success(res, identity, 'Identity created successfully', 201);
});

/**
 * Update identity
 * PUT /api/identities/:id
 */
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if identity exists and belongs to user
  const belongsToUser = await IdentityModel.belongsToUser(id, req.user.id);
  if (!belongsToUser) {
    return response.notFound(res, 'Identity');
  }

  const identity = await IdentityModel.update(id, req.body);
  return response.success(res, identity, 'Identity updated successfully');
});

/**
 * Delete identity
 * DELETE /api/identities/:id
 */
exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if identity exists and belongs to user
  const belongsToUser = await IdentityModel.belongsToUser(id, req.user.id);
  if (!belongsToUser) {
    return response.notFound(res, 'Identity');
  }

  await IdentityModel.delete(id);
  return response.success(res, null, 'Identity deleted successfully');
});
