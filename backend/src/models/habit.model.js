const db = require('../config/db');

class HabitModel {
  static async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT h.*, i.identity_name 
       FROM habits h
       LEFT JOIN identities i ON h.identity_id = i.id
       WHERE h.user_id = ? AND h.deleted_at IS NULL
       ORDER BY h.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async findByIdentityId(identityId) {
    const [rows] = await db.query(
      'SELECT * FROM habits WHERE identity_id = ? AND deleted_at IS NULL ORDER BY created_at DESC',
      [identityId]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT h.*, i.identity_name 
       FROM habits h
       LEFT JOIN identities i ON h.identity_id = i.id
       WHERE h.id = ? AND h.deleted_at IS NULL`,
      [id]
    );
    return rows[0];
  }

  static async create(habitData) {
    const {
      identity_id,
      user_id,
      habit_name,
      description,
      frequency_type,
      frequency_value,
      target_count,
      unit,
      reminder_enabled,
      reminder_time,
      reminder_days,
      difficulty_level,
      category,
      color,
      icon,
      is_public,
      start_date
    } = habitData;

    const [result] = await db.query(
      `INSERT INTO habits 
       (identity_id, user_id, habit_name, description, frequency_type, frequency_value, 
        target_count, unit, reminder_enabled, reminder_time, reminder_days, difficulty_level, 
        category, color, icon, is_public, start_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        identity_id,
        user_id,
        habit_name,
        description || null,
        frequency_type || 'daily',
        frequency_value || 1,
        target_count || 1,
        unit || null,
        reminder_enabled || false,
        reminder_time || null,
        reminder_days ? JSON.stringify(reminder_days) : null,
        difficulty_level || 'medium',
        category || null,
        color || null,
        icon || null,
        is_public || false,
        start_date || new Date()
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, habitData) {
    const allowedFields = [
      'habit_name',
      'description',
      'frequency_type',
      'frequency_value',
      'target_count',
      'unit',
      'reminder_enabled',
      'reminder_time',
      'reminder_days',
      'difficulty_level',
      'category',
      'color',
      'icon',
      'is_public',
      'is_active',
      'end_date'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (habitData[field] !== undefined) {
        if (field === 'reminder_days' && habitData[field]) {
          updates[field] = JSON.stringify(habitData[field]);
        } else {
          updates[field] = habitData[field];
        }
      }
    });

    if (Object.keys(updates).length === 0) {
      return this.findById(id);
    }

    await db.query(
      'UPDATE habits SET ?, updated_at = NOW() WHERE id = ?',
      [updates, id]
    );

    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await db.query(
      'UPDATE habits SET deleted_at = NOW() WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async findByIdWithStats(id) {
    const [rows] = await db.query(
      `SELECT h.*, i.identity_name,
        (SELECT COUNT(*) FROM completions WHERE habit_id = h.id) as total_completions_count,
        (SELECT completion_date FROM completions WHERE habit_id = h.id ORDER BY completion_date DESC LIMIT 1) as last_completion_date
       FROM habits h
       LEFT JOIN identities i ON h.identity_id = i.id
       WHERE h.id = ? AND h.deleted_at IS NULL`,
      [id]
    );
    return rows[0];
  }

  static async findActiveByUserId(userId) {
    const [rows] = await db.query(
      `SELECT h.*, i.identity_name 
       FROM habits h
       LEFT JOIN identities i ON h.identity_id = i.id
       WHERE h.user_id = ? AND h.is_active = TRUE AND h.deleted_at IS NULL
       ORDER BY h.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async belongsToUser(habitId, userId) {
    const [rows] = await db.query(
      'SELECT id FROM habits WHERE id = ? AND user_id = ? AND deleted_at IS NULL',
      [habitId, userId]
    );
    return rows.length > 0;
  }

  static async updateStreak(id, streakCount) {
    await db.query(
      'UPDATE habits SET streak_count = ?, best_streak = GREATEST(best_streak, ?), updated_at = NOW() WHERE id = ?',
      [streakCount, streakCount, id]
    );
  }
}

module.exports = HabitModel;
