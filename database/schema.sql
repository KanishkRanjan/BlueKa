
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(100),
    avatar_url VARCHAR(500),
    phone_number VARCHAR(20),
    email_verified_at TIMESTAMP NULL,
    phone_verified_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    locale VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE identities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    identity_name VARCHAR(100) NOT NULL,
    description TEXT,
    vision_statement TEXT,
    core_values JSON,
    is_primary BOOLEAN DEFAULT FALSE,
    color_theme VARCHAR(7),
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_primary (is_primary),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE habits (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    identity_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    habit_name VARCHAR(100) NOT NULL,
    description TEXT,
    frequency_type ENUM('daily', 'weekly', 'monthly', 'custom') DEFAULT 'daily',
    frequency_value INT DEFAULT 1,
    target_count INT DEFAULT 1,
    unit VARCHAR(50),
    reminder_enabled BOOLEAN DEFAULT FALSE,
    reminder_time TIME NULL,
    reminder_days JSON,
    streak_count INT DEFAULT 0,
    best_streak INT DEFAULT 0,
    total_completions INT DEFAULT 0,
    difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    category VARCHAR(50),
    color VARCHAR(7),
    icon VARCHAR(50),
    is_public BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_identity_id (identity_id),
    INDEX idx_user_id (user_id),
    INDEX idx_is_active (is_active),
    INDEX idx_start_date (start_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE completions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    habit_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_date DATE NOT NULL,
    completion_value DECIMAL(10, 2) DEFAULT 1.00,
    notes TEXT,
    mood ENUM('great', 'good', 'okay', 'bad', 'terrible') NULL,
    energy_level TINYINT CHECK (energy_level BETWEEN 1 AND 5),
    location VARCHAR(100),
    duration_minutes INT,
    metadata JSON,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_habit_completion (habit_id, completion_date),
    INDEX idx_habit_id (habit_id),
    INDEX idx_user_id (user_id),
    INDEX idx_completion_date (completion_date),
    INDEX idx_completed_at (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE squads (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    squad_name VARCHAR(100) NOT NULL,
    description TEXT,
    squad_type ENUM('public', 'private', 'invite_only') DEFAULT 'private',
    avatar_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    max_members INT DEFAULT 50,
    current_member_count INT DEFAULT 0,
    owner_id BIGINT UNSIGNED NOT NULL,
    invite_code VARCHAR(20) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_owner_id (owner_id),
    INDEX idx_squad_type (squad_type),
    INDEX idx_invite_code (invite_code),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE squad_members (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    squad_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    role ENUM('owner', 'admin', 'moderator', 'member') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    invited_by BIGINT UNSIGNED NULL,
    is_active BOOLEAN DEFAULT TRUE,
    notification_enabled BOOLEAN DEFAULT TRUE,
    last_activity_at TIMESTAMP NULL,
    contribution_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (squad_id) REFERENCES squads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_squad_member (squad_id, user_id),
    INDEX idx_squad_id (squad_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role (role),
    INDEX idx_joined_at (joined_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE squad_activities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    squad_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    activity_type ENUM('habit_completed', 'milestone_reached', 'member_joined', 'challenge_created', 'achievement_unlocked') NOT NULL,
    activity_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (squad_id) REFERENCES squads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_squad_id (squad_id),
    INDEX idx_user_id (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    refresh_token VARCHAR(255) UNIQUE,
    device_type VARCHAR(50),
    device_name VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER //
CREATE TRIGGER after_squad_member_insert
AFTER INSERT ON squad_members
FOR EACH ROW
BEGIN
    IF NEW.is_active = TRUE THEN
        UPDATE squads 
        SET current_member_count = current_member_count + 1 
        WHERE id = NEW.squad_id;
    END IF;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_squad_member_delete
AFTER DELETE ON squad_members
FOR EACH ROW
BEGIN
    IF OLD.is_active = TRUE THEN
        UPDATE squads 
        SET current_member_count = current_member_count - 1 
        WHERE id = OLD.squad_id;
    END IF;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_completion_insert
AFTER INSERT ON completions
FOR EACH ROW
BEGIN
    UPDATE habits 
    SET total_completions = total_completions + 1,
        streak_count = streak_count + 1,
        best_streak = GREATEST(best_streak, streak_count + 1)
    WHERE id = NEW.habit_id;
END//
DELIMITER ;
