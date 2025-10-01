const db = require('../config/db');

class SquadModel {
  static async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT s.*, sm.role, sm.joined_at
       FROM squads s
       JOIN squad_members sm ON s.id = sm.squad_id
       WHERE sm.user_id = ? AND sm.is_active = TRUE AND s.deleted_at IS NULL
       ORDER BY sm.joined_at DESC`,
      [userId]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM squads WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    return rows[0];
  }

  static async findByInviteCode(inviteCode) {
    const [rows] = await db.query(
      'SELECT * FROM squads WHERE invite_code = ? AND is_active = TRUE AND deleted_at IS NULL',
      [inviteCode]
    );
    return rows[0];
  }

  static async create(squadData) {
    const {
      squad_name,
      description,
      squad_type,
      avatar_url,
      cover_image_url,
      max_members,
      owner_id,
      settings
    } = squadData;

    const invite_code = this.generateInviteCode();

    const [result] = await db.query(
      `INSERT INTO squads 
       (squad_name, description, squad_type, avatar_url, cover_image_url, max_members, owner_id, invite_code, settings) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        squad_name,
        description || null,
        squad_type || 'private',
        avatar_url || null,
        cover_image_url || null,
        max_members || 50,
        owner_id,
        invite_code,
        settings ? JSON.stringify(settings) : null
      ]
    );

    const squadId = result.insertId;

    await db.query(
      'INSERT INTO squad_members (squad_id, user_id, role) VALUES (?, ?, ?)',
      [squadId, owner_id, 'owner']
    );

    return this.findById(squadId);
  }

  static async update(id, squadData) {
    const allowedFields = [
      'squad_name',
      'description',
      'squad_type',
      'avatar_url',
      'cover_image_url',
      'max_members',
      'is_active',
      'settings'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (squadData[field] !== undefined) {
        if (field === 'settings' && squadData[field]) {
          updates[field] = JSON.stringify(squadData[field]);
        } else {
          updates[field] = squadData[field];
        }
      }
    });

    if (Object.keys(updates).length === 0) {
      return this.findById(id);
    }

    await db.query(
      'UPDATE squads SET ?, updated_at = NOW() WHERE id = ?',
      [updates, id]
    );

    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await db.query(
      'UPDATE squads SET deleted_at = NOW() WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async getMembers(squadId) {
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.full_name, u.avatar_url, sm.role, sm.joined_at, sm.contribution_score
       FROM squad_members sm
       JOIN users u ON sm.user_id = u.id
       WHERE sm.squad_id = ? AND sm.is_active = TRUE
       ORDER BY sm.role, sm.joined_at`,
      [squadId]
    );
    return rows;
  }

  static async addMember(squadId, userId, invitedBy = null) {
    const [existing] = await db.query(
      'SELECT id FROM squad_members WHERE squad_id = ? AND user_id = ?',
      [squadId, userId]
    );

    if (existing.length > 0) {
      await db.query(
        'UPDATE squad_members SET is_active = TRUE WHERE squad_id = ? AND user_id = ?',
        [squadId, userId]
      );
      return true;
    }

    await db.query(
      'INSERT INTO squad_members (squad_id, user_id, invited_by) VALUES (?, ?, ?)',
      [squadId, userId, invitedBy]
    );

    return true;
  }

  static async removeMember(squadId, userId) {
    const [result] = await db.query(
      'UPDATE squad_members SET is_active = FALSE WHERE squad_id = ? AND user_id = ?',
      [squadId, userId]
    );
    return result.affectedRows > 0;
  }

  static async updateMemberRole(squadId, userId, role) {
    const [result] = await db.query(
      'UPDATE squad_members SET role = ? WHERE squad_id = ? AND user_id = ?',
      [role, squadId, userId]
    );
    return result.affectedRows > 0;
  }

  static async isMember(squadId, userId) {
    const [rows] = await db.query(
      'SELECT id FROM squad_members WHERE squad_id = ? AND user_id = ? AND is_active = TRUE',
      [squadId, userId]
    );
    return rows.length > 0;
  }

  static async isOwnerOrAdmin(squadId, userId) {
    const [rows] = await db.query(
      'SELECT role FROM squad_members WHERE squad_id = ? AND user_id = ? AND is_active = TRUE',
      [squadId, userId]
    );
    return rows.length > 0 && (rows[0].role === 'owner' || rows[0].role === 'admin');
  }

  static async getStats(squadId) {
    const [stats] = await db.query(
      `SELECT 
        s.current_member_count,
        (SELECT COUNT(*) FROM squad_activities WHERE squad_id = s.id) as total_activities,
        (SELECT COUNT(DISTINCT c.user_id) 
         FROM completions c 
         JOIN squad_members sm ON c.user_id = sm.user_id 
         WHERE sm.squad_id = s.id AND sm.is_active = TRUE) as active_members
       FROM squads s
       WHERE s.id = ?`,
      [squadId]
    );
    return stats[0];
  }

  static generateInviteCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  static async searchPublic(searchTerm, limit = 20) {
    const [rows] = await db.query(
      `SELECT * FROM squads 
       WHERE squad_type = 'public' 
       AND is_active = TRUE 
       AND deleted_at IS NULL
       AND (squad_name LIKE ? OR description LIKE ?)
       ORDER BY current_member_count DESC
       LIMIT ?`,
      [`%${searchTerm}%`, `%${searchTerm}%`, limit]
    );
    return rows;
  }
}

module.exports = SquadModel;
