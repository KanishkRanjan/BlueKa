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
  return response.success(res, stats, 'Statistics retrieved successfully');
});
