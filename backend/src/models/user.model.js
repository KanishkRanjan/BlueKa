const db = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {
  /**
   * Find all users
   */
  static async findAll() {
    const [rows] = await db.query(
      'SELECT id, email, username, full_name, avatar_url, timezone, locale, created_at FROM users WHERE deleted_at IS NULL'
    );
    return rows;
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, email, username, full_name, avatar_url, phone_number, timezone, locale, is_active, created_at, updated_at FROM users WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    return rows[0];
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
      [email]
    );
    return rows[0];
  }

  /**
   * Find user by username
   */
  static async findByUsername(username) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ? AND deleted_at IS NULL',
      [username]
    );
    return rows[0];
  }

  /**
   * Create new user
   */
  static async create(userData) {
    const { email, password, username, full_name, timezone, locale } = userData;
    
    // Hash password
    const password_hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);
    
    const [result] = await db.query(
      'INSERT INTO users (email, password_hash, username, full_name, timezone, locale) VALUES (?, ?, ?, ?, ?, ?)',
      [email, password_hash, username, full_name, timezone || 'UTC', locale || 'en']
    );
    
    return this.findById(result.insertId);
  }

  /**
   * Update user
   */
  static async update(id, userData) {
    const allowedFields = ['username', 'full_name', 'avatar_url', 'phone_number', 'timezone', 'locale'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (userData[field] !== undefined) {
        updates[field] = userData[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return this.findById(id);
    }

    await db.query('UPDATE users SET ?, updated_at = NOW() WHERE id = ?', [updates, id]);
    return this.findById(id);
  }

  /**
   * Update password
   */
  static async updatePassword(id, newPassword) {
    const password_hash = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 10);
    await db.query('UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?', [password_hash, id]);
    return true;
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Soft delete user
   */
  static async delete(id) {
    const [result] = await db.query('UPDATE users SET deleted_at = NOW() WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * Update last login
   */
  static async updateLastLogin(id) {
    await db.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [id]);
  }

  /**
   * Get user statistics
   */
  static async getStats(userId) {
    const [stats] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM identities WHERE user_id = ? AND deleted_at IS NULL) as total_identities,
        (SELECT COUNT(*) FROM habits WHERE user_id = ? AND deleted_at IS NULL) as total_habits,
        (SELECT COUNT(*) FROM completions WHERE user_id = ?) as total_completions,
        (SELECT COUNT(*) FROM squad_members WHERE user_id = ? AND is_active = TRUE) as total_squads
    `, [userId, userId, userId, userId]);
    return stats[0];
  }
}

module.exports = UserModel;
