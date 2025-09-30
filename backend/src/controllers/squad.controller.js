const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');
const SquadModel = require('../models/squad.model');

/**
 * Get all squads for current user
 * GET /api/squads
 */
exports.getAll = asyncHandler(async (req, res) => {
  const squads = await SquadModel.findByUserId(req.user.id);
  return response.success(res, squads, 'Squads retrieved successfully');
});

/**
 * Get squad by ID
 * GET /api/squads/:id
 */
exports.getById = asyncHandler(async (req, res) => {
  const squad = await SquadModel.findById(req.params.id);
  
  if (!squad) {
    return response.notFound(res, 'Squad');
  }

  // Check if user is a member
  const isMember = await SquadModel.isMember(squad.id, req.user.id);
  if (!isMember && squad.squad_type !== 'public') {
    return response.forbidden(res, 'Access denied');
  }

  return response.success(res, squad, 'Squad retrieved successfully');
});

/**
 * Create new squad
 * POST /api/squads
 */
exports.create = asyncHandler(async (req, res) => {
  const squadData = {
    ...req.body,
    owner_id: req.user.id
  };

  // Validation
  if (!squadData.squad_name) {
    return response.validationError(res, [{ field: 'squad_name', message: 'Squad name is required' }]);
  }

  const squad = await SquadModel.create(squadData);
  return response.success(res, squad, 'Squad created successfully', 201);
});

/**
 * Update squad
 * PUT /api/squads/:id
 */
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user is owner or admin
  const isOwnerOrAdmin = await SquadModel.isOwnerOrAdmin(id, req.user.id);
  if (!isOwnerOrAdmin) {
    return response.forbidden(res, 'Only owners and admins can update squad');
  }

  const squad = await SquadModel.update(id, req.body);
  return response.success(res, squad, 'Squad updated successfully');
});

/**
 * Delete squad
 * DELETE /api/squads/:id
 */
exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const squad = await SquadModel.findById(id);
  if (!squad) {
    return response.notFound(res, 'Squad');
  }

  // Only owner can delete squad
  if (squad.owner_id !== req.user.id) {
    return response.forbidden(res, 'Only the owner can delete the squad');
  }

  await SquadModel.delete(id);
  return response.success(res, null, 'Squad deleted successfully');
});

/**
 * Get squad members
 * GET /api/squads/:id/members
 */
exports.getMembers = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user is a member or squad is public
  const squad = await SquadModel.findById(id);
  if (!squad) {
    return response.notFound(res, 'Squad');
  }

  const isMember = await SquadModel.isMember(id, req.user.id);
  if (!isMember && squad.squad_type !== 'public') {
    return response.forbidden(res, 'Access denied');
  }

  const members = await SquadModel.getMembers(id);
  return response.success(res, members, 'Members retrieved successfully');
});

/**
 * Join squad
 * POST /api/squads/:id/join
 */
exports.join = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const squad = await SquadModel.findById(id);
  if (!squad) {
    return response.notFound(res, 'Squad');
  }

  // Check if squad is full
  if (squad.current_member_count >= squad.max_members) {
    return response.error(res, 'Squad is full', 400);
  }

  // Check if already a member
  const isMember = await SquadModel.isMember(id, req.user.id);
  if (isMember) {
    return response.error(res, 'Already a member of this squad', 400);
  }

  // Check if squad is invite-only
  if (squad.squad_type === 'invite_only') {
    return response.forbidden(res, 'This squad is invite-only');
  }

  await SquadModel.addMember(id, req.user.id);
  return response.success(res, null, 'Joined squad successfully', 201);
});

/**
 * Leave squad
 * POST /api/squads/:id/leave
 */
exports.leave = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const squad = await SquadModel.findById(id);
  if (!squad) {
    return response.notFound(res, 'Squad');
  }

  // Owner cannot leave
  if (squad.owner_id === req.user.id) {
    return response.error(res, 'Owner cannot leave squad. Transfer ownership or delete the squad.', 400);
  }

  const isMember = await SquadModel.isMember(id, req.user.id);
  if (!isMember) {
    return response.error(res, 'Not a member of this squad', 400);
  }

  await SquadModel.removeMember(id, req.user.id);
  return response.success(res, null, 'Left squad successfully');
});

/**
 * Invite user to squad
 * POST /api/squads/:id/invite
 */
exports.invite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return response.validationError(res, [{ field: 'userId', message: 'User ID is required' }]);
  }

  // Check if user is owner or admin
  const isOwnerOrAdmin = await SquadModel.isOwnerOrAdmin(id, req.user.id);
  if (!isOwnerOrAdmin) {
    return response.forbidden(res, 'Only owners and admins can invite members');
  }

  const squad = await SquadModel.findById(id);
  if (!squad) {
    return response.notFound(res, 'Squad');
  }

  // Check if squad is full
  if (squad.current_member_count >= squad.max_members) {
    return response.error(res, 'Squad is full', 400);
  }

  await SquadModel.addMember(id, userId, req.user.id);
  return response.success(res, null, 'User invited successfully', 201);
});

/**
 * Remove member from squad
 * DELETE /api/squads/:id/members/:userId
 */
exports.removeMember = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;

  // Check if user is owner or admin
  const isOwnerOrAdmin = await SquadModel.isOwnerOrAdmin(id, req.user.id);
  if (!isOwnerOrAdmin) {
    return response.forbidden(res, 'Only owners and admins can remove members');
  }

  const squad = await SquadModel.findById(id);
  if (!squad) {
    return response.notFound(res, 'Squad');
  }

  // Cannot remove owner
  if (squad.owner_id === parseInt(userId)) {
    return response.error(res, 'Cannot remove squad owner', 400);
  }

  await SquadModel.removeMember(id, userId);
  return response.success(res, null, 'Member removed successfully');
});

/**
 * Update member role
 * PUT /api/squads/:id/members/:userId/role
 */
exports.updateMemberRole = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;
  const { role } = req.body;

  if (!role || !['admin', 'moderator', 'member'].includes(role)) {
    return response.validationError(res, [{ field: 'role', message: 'Valid role is required' }]);
  }

  const squad = await SquadModel.findById(id);
  if (!squad) {
    return response.notFound(res, 'Squad');
  }

  // Only owner can change roles
  if (squad.owner_id !== req.user.id) {
    return response.forbidden(res, 'Only the owner can change member roles');
  }

  await SquadModel.updateMemberRole(id, userId, role);
  return response.success(res, null, 'Member role updated successfully');
});

/**
 * Join squad by invite code
 * POST /api/squads/join-by-code
 */
exports.joinByCode = asyncHandler(async (req, res) => {
  const { inviteCode } = req.body;

  if (!inviteCode) {
    return response.validationError(res, [{ field: 'inviteCode', message: 'Invite code is required' }]);
  }

  const squad = await SquadModel.findByInviteCode(inviteCode);
  if (!squad) {
    return response.notFound(res, 'Squad with this invite code');
  }

  // Check if squad is full
  if (squad.current_member_count >= squad.max_members) {
    return response.error(res, 'Squad is full', 400);
  }

  // Check if already a member
  const isMember = await SquadModel.isMember(squad.id, req.user.id);
  if (isMember) {
    return response.error(res, 'Already a member of this squad', 400);
  }

  await SquadModel.addMember(squad.id, req.user.id);
  return response.success(res, squad, 'Joined squad successfully', 201);
});

/**
 * Search public squads
 * GET /api/squads/search
 */
exports.search = asyncHandler(async (req, res) => {
  const { q, limit } = req.query;

  if (!q) {
    return response.validationError(res, [{ field: 'q', message: 'Search query is required' }]);
  }

  const squads = await SquadModel.searchPublic(q, limit ? parseInt(limit) : 20);
  return response.success(res, squads, 'Squads retrieved successfully');
});

/**
 * Get squad statistics
 * GET /api/squads/:id/stats
 */
exports.getStats = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user is a member
  const isMember = await SquadModel.isMember(id, req.user.id);
  if (!isMember) {
    return response.forbidden(res, 'Access denied');
  }

  const stats = await SquadModel.getStats(id);
  return response.success(res, stats, 'Statistics retrieved successfully');
});
