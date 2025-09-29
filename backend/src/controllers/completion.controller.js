const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');
const CompletionModel = require('../models/completion.model');
const HabitModel = require('../models/habit.model');

/**
 * Get all completions for current user
 * GET /api/completions
 */
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

/**
 * Get today's completions
 * GET /api/completions/today
 */
exports.getToday = asyncHandler(async (req, res) => {
  const completions = await CompletionModel.getTodayCompletions(req.user.id);
  return response.success(res, completions, 'Today\'s completions retrieved successfully');
});

/**
 * Get completions by habit
 * GET /api/completions/habit/:habitId
 */
exports.getByHabitId = asyncHandler(async (req, res) => {
  const { habitId } = req.params;
  const { limit } = req.query;
  
  // Check if habit belongs to user
  const belongsToUser = await HabitModel.belongsToUser(habitId, req.user.id);
  if (!belongsToUser) {
    return response.forbidden(res, 'Access denied');
  }
  
  const completions = await CompletionModel.findByHabitId(habitId, limit ? parseInt(limit) : 100);
  return response.success(res, completions, 'Completions retrieved successfully');
});

/**
 * Get completion by ID
 * GET /api/completions/:id
 */
exports.getById = asyncHandler(async (req, res) => {
  const completion = await CompletionModel.findById(req.params.id);
  
  if (!completion) {
    return response.notFound(res, 'Completion');
  }

  // Check ownership
  if (completion.user_id !== req.user.id) {
    return response.forbidden(res, 'Access denied');
  }

  return response.success(res, completion, 'Completion retrieved successfully');
});

/**
 * Create new completion
 * POST /api/completions
 */
exports.create = asyncHandler(async (req, res) => {
  const completionData = {
    ...req.body,
    user_id: req.user.id
  };

  // Validation
  if (!completionData.habit_id) {
    return response.validationError(res, [{ field: 'habit_id', message: 'Habit ID is required' }]);
  }

  // Check if habit belongs to user
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

/**
 * Update completion
 * PUT /api/completions/:id
 */
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if completion exists and belongs to user
  const belongsToUser = await CompletionModel.belongsToUser(id, req.user.id);
  if (!belongsToUser) {
    return response.notFound(res, 'Completion');
  }

  const completion = await CompletionModel.update(id, req.body);
  return response.success(res, completion, 'Completion updated successfully');
});

/**
 * Delete completion
 * DELETE /api/completions/:id
 */
exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if completion exists and belongs to user
  const belongsToUser = await CompletionModel.belongsToUser(id, req.user.id);
  if (!belongsToUser) {
    return response.notFound(res, 'Completion');
  }

  await CompletionModel.delete(id);
  return response.success(res, null, 'Completion deleted successfully');
});

/**
 * Get completion statistics for a habit
 * GET /api/completions/habit/:habitId/stats
 */
exports.getHabitStats = asyncHandler(async (req, res) => {
  const { habitId } = req.params;
  
  // Check if habit belongs to user
  const belongsToUser = await HabitModel.belongsToUser(habitId, req.user.id);
  if (!belongsToUser) {
    return response.forbidden(res, 'Access denied');
  }
  
  const stats = await CompletionModel.getHabitStats(habitId);
  return response.success(res, stats, 'Statistics retrieved successfully');
});

/**
 * Get user's completion statistics
 * GET /api/completions/stats
 */
exports.getUserStats = asyncHandler(async (req, res) => {
  const stats = await CompletionModel.getUserStats(req.user.id);
  return response.success(res, stats, 'Statistics retrieved successfully');
});
