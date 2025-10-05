const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');
const SquadModel = require('../models/squad.model');


exports.getAll = asyncHandler(async (req, res) => {
  const squads = await SquadModel.findByUserId(req.user.id);
  return response.success(res, squads, 'Squads retrieved successfully');
});


exports.getById = asyncHandler(async (req, res) => {
  const squad = await SquadModel.findById(req.params.id);

  if (!squad) {
    return response.notFound(res, 'Squad');
  }

  const isMember = await SquadModel.isMember(squad.id, req.user.id);
  if (!isMember && squad.squad_type !== 'public') {
    return response.forbidden(res, 'Access denied');
  }

  return response.success(res, squad, 'Squad retrieved successfully');
});

exports.create = asyncHandler(async (req, res) => {
  const squadData = {
    ...req.body,
    owner_id: req.user.id
  };

  if (!squadData.squad_name) {
    return response.validationError(res, [{ field: 'squad_name', message: 'Squad name is required' }]);
  }

  const squad = await SquadModel.create(squadData);
  return response.success(res, squad, 'Squad created successfully', 201);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const isOwnerOrAdmin = await SquadModel.isOwnerOrAdmin(id, req.user.id);
  if (!isOwnerOrAdmin) {
    return response.forbidden(res, 'Only owners and admins can update squad');
  }

  const squad = await SquadModel.update(id, req.body);
  return response.success(res, squad, 'Squad updated successfully');
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const squad = await SquadModel.findById(id);
  if (!squad) {
    return response.notFound(res, 'Squad');
  }

  if (squad.owner_id !== req.user.id) {
    return response.forbidden(res, 'Only the owner can delete the squad');
  }

  await SquadModel.delete(id);
  return response.success(res, null, 'Squad deleted successfully');
});

exports.getMembers = asyncHandler(async (req, res) => {
  const { id } = req.params;

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

exports.join = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const squad = await SquadModel.findById(id);
  if (!squad) {
    return response.notFound(res, 'Squad');
  }

  if (squad.current_member_count >= squad.max_members) {
    return response.error(res, 'Squad is full', 400);
  }
  const isMember = await SquadModel.isMember(id, req.user.id);
  if (isMember) {
    return response.error(res, 'Already a member of this squad', 400);
  }

  if (squad.squad_type === 'invite_only') {
    return response.forbidden(res, 'This squad is invite-only');
  }

  await SquadModel.addMember(id, req.user.id);
  return response.success(res, null, 'Joined squad successfully', 201);
});

exports.leave = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const squad = await SquadModel.findById(id);
  if (!squad) {
    return response.notFound(res, 'Squad');
  }

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

exports.invite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return response.validationError(res, [{ field: 'userId', message: 'User ID is required' }]);
  }

  const isOwnerOrAdmin = await SquadModel.isOwnerOrAdmin(id, req.user.id);
  if (!isOwnerOrAdmin) {
    return response.forbidden(res, 'Only owners and admins can invite members');
  }

  const squad = await SquadModel.findById(id);
  if (!squad) {
    return response.notFound(res, 'Squad');
  }

  if (squad.current_member_count >= squad.max_members) {
    return response.error(res, 'Squad is full', 400);
  }

  await SquadModel.addMember(id, userId, req.user.id);
  return response.success(res, null, 'User invited successfully', 201);
});

exports.removeMember = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;

  const isOwnerOrAdmin = await SquadModel.isOwnerOrAdmin(id, req.user.id);
  if (!isOwnerOrAdmin) {
    return response.forbidden(res, 'Only owners and admins can remove members');
  }

  const squad = await SquadModel.findById(id);
  if (!squad) {
    return response.notFound(res, 'Squad');
  }

  if (squad.owner_id === parseInt(userId)) {
    return response.error(res, 'Cannot remove squad owner', 400);
  }

  await SquadModel.removeMember(id, userId);
  return response.success(res, null, 'Member removed successfully');
});

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

  if (squad.owner_id !== req.user.id) {
    return response.forbidden(res, 'Only the owner can change member roles');
  }

  await SquadModel.updateMemberRole(id, userId, role);
  return response.success(res, null, 'Member role updated successfully');
});

exports.joinByCode = asyncHandler(async (req, res) => {
  const { inviteCode } = req.body;

  if (!inviteCode) {
    return response.validationError(res, [{ field: 'inviteCode', message: 'Invite code is required' }]);
  }

  const squad = await SquadModel.findByInviteCode(inviteCode);
  if (!squad) {
    return response.notFound(res, 'Squad with this invite code');
  }

  if (squad.current_member_count >= squad.max_members) {
    return response.error(res, 'Squad is full', 400);
  }

  const isMember = await SquadModel.isMember(squad.id, req.user.id);
  if (isMember) {
    return response.error(res, 'Already a member of this squad', 400);
  }

  await SquadModel.addMember(squad.id, req.user.id);
  return response.success(res, squad, 'Joined squad successfully', 201);
});

exports.search = asyncHandler(async (req, res) => {
  const { q, limit } = req.query;

  const searchTerm = q || '';

  const squads = await SquadModel.searchPublic(searchTerm, limit ? parseInt(limit) : 20);
  return response.success(res, squads, 'Squads retrieved successfully');
});

exports.getStats = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const isMember = await SquadModel.isMember(id, req.user.id);
  if (!isMember) {
    return response.forbidden(res, 'Access denied');
  }

  const stats = await SquadModel.getStats(id);
  return response.success(res, stats, 'Statistics retrieved successfully');
});
