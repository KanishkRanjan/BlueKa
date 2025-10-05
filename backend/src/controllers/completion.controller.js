const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');
const CompletionModel = require('../models/completion.model');
const HabitModel = require('../models/habit.model');

exports.getAll = asyncHandler(async (req, res) => {
  const { limit, startDate, endDate } = req.query;

  let completions;
  if (startDate && endDate) {
    completions = await CompletionModel.findByDateRange(req.user.id, startDate, endDate);
  } else {
    completions = await CompletionModel.findByUserId(req.user.id, limit ? parseInt(limit) : 100);
  }

  return response.success(res, completions, 'Completions retrieved successfully');
});

exports.getToday = asyncHandler(async (req, res) => {
  const completions = await CompletionModel.getTodayCompletions(req.user.id);
  return response.success(res, completions, 'Today\'s completions retrieved successfully');
});

exports.getByHabitId = asyncHandler(async (req, res) => {
  const { habitId } = req.params;
  const { limit } = req.query;

  const belongsToUser = await HabitModel.belongsToUser(habitId, req.user.id);
  if (!belongsToUser) {
    return response.forbidden(res, 'Access denied');
  }

  const completions = await CompletionModel.findByHabitId(habitId, limit ? parseInt(limit) : 100);
  return response.success(res, completions, 'Completions retrieved successfully');
});

exports.getById = asyncHandler(async (req, res) => {
  const completion = await CompletionModel.findById(req.params.id);

  if (!completion) {
    return response.notFound(res, 'Completion');
  }

  if (completion.user_id !== req.user.id) {
    return response.forbidden(res, 'Access denied');
  }

  return response.success(res, completion, 'Completion retrieved successfully');
});

exports.create = asyncHandler(async (req, res) => {
  const completionData = {
    ...req.body,
    user_id: req.user.id
  };

  if (!completionData.habit_id) {
    return response.validationError(res, [{ field: 'habit_id', message: 'Habit ID is required' }]);
  }
  const belongsToUser = await HabitModel.belongsToUser(completionData.habit_id, req.user.id);
  if (!belongsToUser) {
    return response.error(res, 'Invalid habit', 400);
  }

  try {
    const completion = await CompletionModel.create(completionData);
    return response.success(res, completion, 'Completion created successfully', 201);
  } catch (error) {
    if (error.message === 'Completion already exists for this date') {
      return response.error(res, error.message, 409);
    }
    throw error;
  }
});

exports.toggle = asyncHandler(async (req, res) => {
  const completionData = {
    ...req.body,
    user_id: req.user.id
  };

  if (!completionData.habit_id) {
    return response.validationError(res, [{ field: 'habit_id', message: 'Habit ID is required' }]);
  }

  const belongsToUser = await HabitModel.belongsToUser(completionData.habit_id, req.user.id);
  if (!belongsToUser) {
    return response.error(res, 'Invalid habit', 400);
  }

  const result = await CompletionModel.toggle(completionData);
  return response.success(res, result, result.action === 'marked' ? 'Habit completed!' : 'Completion removed');
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const belongsToUser = await CompletionModel.belongsToUser(id, req.user.id);
  if (!belongsToUser) {
    return response.notFound(res, 'Completion');
  }

  const completion = await CompletionModel.update(id, req.body);
  return response.success(res, completion, 'Completion updated successfully');
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const belongsToUser = await CompletionModel.belongsToUser(id, req.user.id);
  if (!belongsToUser) {
    return response.notFound(res, 'Completion');
  }

  await CompletionModel.delete(id);
  return response.success(res, null, 'Completion deleted successfully');
});

exports.getHabitStats = asyncHandler(async (req, res) => {
  const { habitId } = req.params;

  const belongsToUser = await HabitModel.belongsToUser(habitId, req.user.id);
  if (!belongsToUser) {
    return response.forbidden(res, 'Access denied');
  }

  const stats = await CompletionModel.getHabitStats(habitId);
  return response.success(res, stats, 'Statistics retrieved successfully');
});

exports.getUserStats = asyncHandler(async (req, res) => {
  const stats = await CompletionModel.getUserStats(req.user.id);

  // Calculate completion rate: total_completions / (total_active_habits * days_since_start)
  // For MVP, let's just do: total_completions / (total_active_habits * 30) assuming 30 days window?
  // Or simpler: today's completion rate?
  // Let's use a simpler metric: total_completions / (total_active_habits * 1) if looking at "today"
  // But stats is historical.

  // Better metric: Average completion rate of all active habits.
  const activeHabits = await HabitModel.findActiveByUserId(req.user.id);
  const totalActiveHabits = activeHabits.length;

  let completion_rate = 0;
  let streak = 0;

  if (totalActiveHabits > 0) {
    // Calculate streak as the sum of all active habit streaks (or max?)
    // Let's use MAX streak of any habit for "Day Streak"
    streak = activeHabits.reduce((max, h) => Math.max(max, h.streak_count || 0), 0);

    // Completion rate: (total_completions / (totalActiveHabits * unique_days)) * 100
    // If unique_days is 0, rate is 0.
    if (stats.unique_days > 0) {
      completion_rate = (stats.total_completions / (totalActiveHabits * stats.unique_days)) * 100;
    }
  }

  // Ensure we return numbers, not NaN
  const safeStats = {
    ...stats,
    streak: streak || 0,
    completion_rate: isNaN(completion_rate) ? 0 : Math.min(100, Math.round(completion_rate))
  };

  return response.success(res, safeStats, 'Statistics retrieved successfully');
});
