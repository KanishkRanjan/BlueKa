SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS squad_members;
DROP TABLE IF EXISTS squads;
DROP TABLE IF EXISTS completions;
DROP TABLE IF EXISTS habits;
DROP TABLE IF EXISTS identities;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(100),
  avatar_url VARCHAR(255),
  phone_number VARCHAR(20),
  timezone VARCHAR(50) DEFAULT 'UTC',
  locale VARCHAR(10) DEFAULT 'en',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  last_login_at TIMESTAMP NULL
);

-- Identities table
CREATE TABLE IF NOT EXISTS identities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  identity_name VARCHAR(100) NOT NULL,
  description TEXT,
  vision_statement TEXT,
  core_values JSON,
  is_primary BOOLEAN DEFAULT FALSE,
  color_theme VARCHAR(20),
  icon VARCHAR(50),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  identity_id INT,
  user_id INT NOT NULL,
  habit_name VARCHAR(255) NOT NULL,
  description TEXT,
  frequency_type VARCHAR(20) DEFAULT 'daily',
  frequency_value INT DEFAULT 1,
  target_count INT DEFAULT 1,
  unit VARCHAR(50),
  reminder_enabled BOOLEAN DEFAULT FALSE,
  reminder_time TIME,
  reminder_days JSON,
  difficulty_level VARCHAR(20) DEFAULT 'medium',
  category VARCHAR(50),
  color VARCHAR(20),
  icon VARCHAR(50),
  is_public BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  start_date DATE,
  end_date DATE,
  streak_count INT DEFAULT 0,
  best_streak INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (identity_id) REFERENCES identities(id)
);

-- Completions table
CREATE TABLE IF NOT EXISTS completions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  habit_id INT NOT NULL,
  completion_date DATE NOT NULL,
  completion_value INT DEFAULT 1,
  energy_level INT,
  mood VARCHAR(20),
  notes TEXT,
  location VARCHAR(100),
  duration_minutes INT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (habit_id) REFERENCES habits(id)
);

-- Squads table
CREATE TABLE IF NOT EXISTS squads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  squad_name VARCHAR(100) NOT NULL,
  description TEXT,
  squad_type VARCHAR(20) DEFAULT 'private',
  avatar_url VARCHAR(255),
  cover_image_url VARCHAR(255),
  max_members INT DEFAULT 50,
  current_member_count INT DEFAULT 1,
  owner_id INT NOT NULL,
  invite_code VARCHAR(20),
  settings JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Squad Members table
CREATE TABLE IF NOT EXISTS squad_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  squad_id INT NOT NULL,
  user_id INT NOT NULL,
  role VARCHAR(20) DEFAULT 'member',
  is_active BOOLEAN DEFAULT TRUE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  contribution_score INT DEFAULT 0,
  invited_by INT,
  FOREIGN KEY (squad_id) REFERENCES squads(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (invited_by) REFERENCES users(id)
);
