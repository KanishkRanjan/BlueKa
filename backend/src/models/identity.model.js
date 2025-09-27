const db = require('../config/db');

class IdentityModel {
  /**
   * Find all identities for a user
   */
  static async findByUserId(userId) {
    const [rows] = await db.query(
      'SELECT * FROM identities WHERE user_id = ? AND deleted_at IS NULL ORDER BY display_order, created_at',
      [userId]
    );
    return rows;
  }

  /**
   * Find identity by ID
   */
  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM identities WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    return rows[0];
  }

  /**
   * Create new identity
   */
  static async create(identityData) {
    const {
      user_id,
      identity_name,
      description,
      vision_statement,
      core_values,
      is_primary,
      color_theme,
      icon,
      display_order
    } = identityData;

    // If this is set as primary, unset other primary identities
    if (is_primary) {
      await db.query(
        'UPDATE identities SET is_primary = FALSE WHERE user_id = ?',
        [user_id]
      );
    }

    const [result] = await db.query(
      `INSERT INTO identities 
       (user_id, identity_name, description, vision_statement, core_values, is_primary, color_theme, icon, display_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        identity_name,
        description || null,
        vision_statement || null,
        core_values ? JSON.stringify(core_values) : null,
        is_primary || false,
        color_theme || null,
        icon || null,
        display_order || 0
      ]
    );

    return this.findById(result.insertId);
  }

  /**
   * Update identity
   */
  static async update(id, identityData) {
    const allowedFields = [
      'identity_name',
      'description',
      'vision_statement',
      'core_values',
      'is_primary',
      'color_theme',
      'icon',
      'display_order',
      'is_active'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (identityData[field] !== undefined) {
        if (field === 'core_values' && identityData[field]) {
          updates[field] = JSON.stringify(identityData[field]);
        } else {
          updates[field] = identityData[field];
        }
      }
    });

    if (Object.keys(updates).length === 0) {
      return this.findById(id);
    }

    // If setting as primary, get user_id first
    if (updates.is_primary) {
      const identity = await this.findById(id);
      if (identity) {
        await db.query(
          'UPDATE identities SET is_primary = FALSE WHERE user_id = ?',
          [identity.user_id]
        );
      }
    }

    await db.query(
      'UPDATE identities SET ?, updated_at = NOW() WHERE id = ?',
      [updates, id]
    );

    return this.findById(id);
  }

  /**
   * Soft delete identity
   */
  static async delete(id) {
    const [result] = await db.query(
      'UPDATE identities SET deleted_at = NOW() WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Get identity with habits count
   */
  static async findByIdWithStats(id) {
    const [rows] = await db.query(
      `SELECT i.*, 
        (SELECT COUNT(*) FROM habits WHERE identity_id = i.id AND deleted_at IS NULL) as habits_count
       FROM identities i
       WHERE i.id = ? AND i.deleted_at IS NULL`,
      [id]
    );
    return rows[0];
  }

  /**
   * Get all identities for a user with habits count
   */
  static async findByUserIdWithStats(userId) {
    const [rows] = await db.query(
      `SELECT i.*, 
        (SELECT COUNT(*) FROM habits WHERE identity_id = i.id AND deleted_at IS NULL) as habits_count
       FROM identities i
       WHERE i.user_id = ? AND i.deleted_at IS NULL
       ORDER BY i.display_order, i.created_at`,
      [userId]
    );
    return rows;
  }

  /**
   * Check if identity belongs to user
   */
  static async belongsToUser(identityId, userId) {
    const [rows] = await db.query(
      'SELECT id FROM identities WHERE id = ? AND user_id = ? AND deleted_at IS NULL',
      [identityId, userId]
    );
    return rows.length > 0;
  }
}

module.exports = IdentityModel;
