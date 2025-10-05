const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');
const HabitModel = require('../models/habit.model');
const IdentityModel = require('../models/identity.model');

exports.getAll = asyncHandler(async (req, res) => {
  const { active } = req.query;

  let habits;
  if (active === 'true') {
    habits = await HabitModel.findActiveByUserId(req.user.id);
  } else {
    habits = await HabitModel.findByUserId(req.user.id);
  }

  return response.success(res, habits, 'Habits retrieved successfully');
});

exports.getByUserId = asyncHandler(async (req, res) => {
  const habits = await HabitModel.findByUserId(req.params.userId);

  const filteredHabits = req.params.userId === req.user.id.toString()
    ? habits
    : habits.filter(h => h.is_public);

  return response.success(res, filteredHabits, 'Habits retrieved successfully');
});

exports.getByIdentityId = asyncHandler(async (req, res) => {
  const { identityId } = req.params;

  const belongsToUser = await IdentityModel.belongsToUser(identityId, req.user.id);
  if (!belongsToUser) {
    return response.forbidden(res, 'Access denied');
  }

  const habits = await HabitModel.findByIdentityId(identityId);
  return response.success(res, habits, 'Habits retrieved successfully');
});

exports.getById = asyncHandler(async (req, res) => {
  const habit = await HabitModel.findByIdWithStats(req.params.id);

  if (!habit) {
    return response.notFound(res, 'Habit');
  }

  if (habit.user_id !== req.user.id && !habit.is_public) {
    return response.forbidden(res, 'Access denied');
  }

  return response.success(res, habit, 'Habit retrieved successfully');
});

exports.create = asyncHandler(async (req, res) => {
  const habitData = {
    ...req.body,
    user_id: req.user.id
  };

  if (!habitData.habit_name) {
    return response.validationError(res, [{ field: 'habit_name', message: 'Habit name is required' }]);
  }

  if (habitData.identity_id) {
    const belongsToUser = await IdentityModel.belongsToUser(habitData.identity_id, req.user.id);
    if (!belongsToUser) {
      return response.error(res, 'Invalid identity', 400);
    }
  }

  const habit = await HabitModel.create(habitData);
  return response.success(res, habit, 'Habit created successfully', 201);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const belongsToUser = await HabitModel.belongsToUser(id, req.user.id);
  if (!belongsToUser) {
    return response.notFound(res, 'Habit');
  }

  const habit = await HabitModel.update(id, req.body);
  return response.success(res, habit, 'Habit updated successfully');
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const belongsToUser = await HabitModel.belongsToUser(id, req.user.id);
  if (!belongsToUser) {
    return response.notFound(res, 'Habit');
  }

  await HabitModel.delete(id);
  return response.success(res, null, 'Habit deleted successfully');
});
