const db = require('../config/db');

class CompletionModel {
  static async findByUserId(userId, limit = 100) {
    const [rows] = await db.query(
      `SELECT c.*, h.habit_name, h.color, h.icon
       FROM completions c
       JOIN habits h ON c.habit_id = h.id
       WHERE c.user_id = ?
       ORDER BY c.completion_date DESC, c.completed_at DESC
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  }

  static async findByHabitId(habitId, limit = 100) {
    const [rows] = await db.query(
      'SELECT * FROM completions WHERE habit_id = ? ORDER BY completion_date DESC LIMIT ?',
      [habitId, limit]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT c.*, h.habit_name
       FROM completions c
       JOIN habits h ON c.habit_id = h.id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByHabitAndDate(habitId, date) {
    const [rows] = await db.query(
      'SELECT * FROM completions WHERE habit_id = ? AND completion_date = ?',
      [habitId, date]
    );
    return rows[0];
  }

  static async create(completionData) {
    const {
      habit_id,
      user_id,
      completion_date,
      completion_value,
      notes,
      mood,
      energy_level,
      location,
      duration_minutes,
      metadata
    } = completionData;

    const existing = await this.findByHabitAndDate(habit_id, completion_date);
    if (existing) {
      throw new Error('Completion already exists for this date');
    }

    const [result] = await db.query(
      `INSERT INTO completions 
       (habit_id, user_id, completion_date, completion_value, notes, mood, energy_level, location, duration_minutes, metadata) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        habit_id,
        user_id,
        completion_date || new Date().toISOString().split('T')[0],
        completion_value || 1,
        notes || null,
        mood || null,
        energy_level || null,
        location || null,
        duration_minutes || null,
        metadata ? JSON.stringify(metadata) : null
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, completionData) {
    const allowedFields = [
      'completion_value',
      'notes',
      'mood',
      'energy_level',
      'location',
      'duration_minutes',
      'metadata'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (completionData[field] !== undefined) {
        if (field === 'metadata' && completionData[field]) {
          updates[field] = JSON.stringify(completionData[field]);
        } else {
          updates[field] = completionData[field];
        }
      }
    });

    if (Object.keys(updates).length === 0) {
      return this.findById(id);
    }

    await db.query(
      'UPDATE completions SET ?, updated_at = NOW() WHERE id = ?',
      [updates, id]
    );

    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM completions WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findByDateRange(userId, startDate, endDate) {
    const [rows] = await db.query(
      `SELECT c.*, h.habit_name, h.color, h.icon
       FROM completions c
       JOIN habits h ON c.habit_id = h.id
       WHERE c.user_id = ? AND c.completion_date BETWEEN ? AND ?
       ORDER BY c.completion_date DESC`,
      [userId, startDate, endDate]
    );
    return rows;
  }

  static async getHabitStats(habitId) {
    const [stats] = await db.query(
      `SELECT 
        COUNT(*) as total_completions,
        AVG(completion_value) as avg_value,
        MIN(completion_date) as first_completion,
        MAX(completion_date) as last_completion,
        AVG(CASE WHEN energy_level IS NOT NULL THEN energy_level END) as avg_energy,
        COUNT(CASE WHEN mood = 'great' THEN 1 END) as great_mood_count,
        COUNT(CASE WHEN mood = 'good' THEN 1 END) as good_mood_count,
        COUNT(CASE WHEN mood = 'okay' THEN 1 END) as okay_mood_count
       FROM completions
       WHERE habit_id = ?`,
      [habitId]
    );
    return stats[0];
  }

  static async getUserStats(userId) {
    const [stats] = await db.query(
      `SELECT 
        COUNT(*) as total_completions,
        COUNT(DISTINCT habit_id) as habits_completed,
        COUNT(DISTINCT DATE(completion_date)) as unique_days,
        AVG(CASE WHEN energy_level IS NOT NULL THEN energy_level END) as avg_energy
       FROM completions
       WHERE user_id = ?`,
      [userId]
    );
    return stats[0];
  }

  static async belongsToUser(completionId, userId) {
    const [rows] = await db.query(
      'SELECT id FROM completions WHERE id = ? AND user_id = ?',
      [completionId, userId]
    );
    return rows.length > 0;
  }

  static async getTodayCompletions(userId) {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await db.query(
      `SELECT c.*, h.habit_name, h.color, h.icon
       FROM completions c
       JOIN habits h ON c.habit_id = h.id
       WHERE c.user_id = ? AND c.completion_date = ?`,
      [userId, today]
    );
    return rows;
  }
}

module.exports = CompletionModel;
