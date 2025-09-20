-- Atomize Database Seed Data
-- Sample data for development and testing

-- ============================================================================
-- SEED USERS
-- ============================================================================
INSERT INTO users (email, password_hash, username, full_name, timezone, locale) VALUES
('john.doe@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'johndoe', 'John Doe', 'America/New_York', 'en'),
('jane.smith@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'janesmith', 'Jane Smith', 'America/Los_Angeles', 'en'),
('alex.johnson@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'alexj', 'Alex Johnson', 'Europe/London', 'en'),
('maria.garcia@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'mariag', 'Maria Garcia', 'America/Mexico_City', 'es');

-- ============================================================================
-- SEED IDENTITIES
-- ============================================================================
INSERT INTO identities (user_id, identity_name, description, vision_statement, core_values, is_primary, color_theme, icon) VALUES
(1, 'Athlete', 'My fitness and sports identity', 'To become the strongest version of myself', '["discipline", "perseverance", "health"]', TRUE, '#FF6B6B', 'dumbbell'),
(1, 'Professional', 'My career and work identity', 'To excel in my career and make an impact', '["excellence", "innovation", "growth"]', FALSE, '#4ECDC4', 'briefcase'),
(2, 'Student', 'My learning and academic identity', 'To be a lifelong learner', '["curiosity", "dedication", "knowledge"]', TRUE, '#95E1D3', 'book'),
(2, 'Creative', 'My artistic and creative side', 'To express myself through art', '["creativity", "authenticity", "expression"]', FALSE, '#F38181', 'palette'),
(3, 'Entrepreneur', 'My business and startup identity', 'To build successful ventures', '["innovation", "risk-taking", "impact"]', TRUE, '#AA96DA', 'rocket'),
(4, 'Parent', 'My role as a parent', 'To raise happy and healthy children', '["love", "patience", "guidance"]', TRUE, '#FCBAD3', 'heart');

-- ============================================================================
-- SEED HABITS
-- ============================================================================
INSERT INTO habits (identity_id, user_id, habit_name, description, frequency_type, target_count, unit, reminder_enabled, start_date, category, color, icon, difficulty_level) VALUES
-- John's Athlete habits
(1, 1, 'Morning Run', 'Run 5km every morning', 'daily', 1, 'session', TRUE, CURDATE(), 'fitness', '#FF6B6B', 'running', 'medium'),
(1, 1, 'Gym Workout', 'Strength training at the gym', 'weekly', 3, 'session', TRUE, CURDATE(), 'fitness', '#FF6B6B', 'dumbbell', 'hard'),
(1, 1, 'Drink Water', 'Drink 8 glasses of water', 'daily', 8, 'glasses', FALSE, CURDATE(), 'health', '#4ECDC4', 'droplet', 'easy'),

-- John's Professional habits
(2, 1, 'Code Review', 'Review team code submissions', 'daily', 1, 'session', TRUE, CURDATE(), 'work', '#4ECDC4', 'code', 'medium'),
(2, 1, 'Learn New Tech', 'Study new technology or framework', 'weekly', 3, 'hours', TRUE, CURDATE(), 'learning', '#4ECDC4', 'book', 'medium'),

-- Jane's Student habits
(3, 2, 'Study Session', 'Focused study time', 'daily', 2, 'hours', TRUE, CURDATE(), 'education', '#95E1D3', 'book', 'medium'),
(3, 2, 'Practice Problems', 'Solve practice problems', 'daily', 5, 'problems', TRUE, CURDATE(), 'education', '#95E1D3', 'pencil', 'hard'),

-- Jane's Creative habits
(4, 2, 'Sketch Daily', 'Daily sketching practice', 'daily', 1, 'sketch', TRUE, CURDATE(), 'art', '#F38181', 'palette', 'easy'),
(4, 2, 'Creative Writing', 'Write creatively', 'weekly', 3, 'sessions', FALSE, CURDATE(), 'writing', '#F38181', 'pen', 'medium'),

-- Alex's Entrepreneur habits
(5, 3, 'Network', 'Connect with new people', 'weekly', 5, 'people', TRUE, CURDATE(), 'business', '#AA96DA', 'users', 'medium'),
(5, 3, 'Product Development', 'Work on product features', 'daily', 1, 'session', TRUE, CURDATE(), 'business', '#AA96DA', 'rocket', 'hard'),

-- Maria's Parent habits
(6, 4, 'Quality Time', 'Spend quality time with kids', 'daily', 1, 'hour', TRUE, CURDATE(), 'family', '#FCBAD3', 'heart', 'easy'),
(6, 4, 'Read Bedtime Story', 'Read to children before bed', 'daily', 1, 'story', TRUE, CURDATE(), 'family', '#FCBAD3', 'book', 'easy');

-- ============================================================================
-- SEED COMPLETIONS (Last 7 days)
-- ============================================================================
INSERT INTO completions (habit_id, user_id, completion_date, completion_value, mood, energy_level) VALUES
-- John's completions
(1, 1, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 1, 'great', 5),
(1, 1, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 1, 'good', 4),
(1, 1, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 1, 'great', 5),
(1, 1, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 1, 'good', 4),
(1, 1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 1, 'okay', 3),
(1, 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1, 'great', 5),
(1, 1, CURDATE(), 1, 'great', 5),

(3, 1, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 8, 'good', 4),
(3, 1, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 8, 'good', 4),
(3, 1, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 7, 'okay', 3),
(3, 1, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 8, 'good', 4),
(3, 1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 8, 'great', 5),

-- Jane's completions
(6, 2, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 2, 'good', 4),
(6, 2, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 2, 'great', 5),
(6, 2, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 2, 'good', 4),
(6, 2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 3, 'great', 5),
(6, 2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 2, 'good', 4),

(8, 2, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 1, 'great', 5),
(8, 2, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 1, 'good', 4),
(8, 2, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 1, 'great', 5),
(8, 2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 1, 'great', 5);

-- ============================================================================
-- SEED SQUADS
-- ============================================================================
INSERT INTO squads (squad_name, description, squad_type, owner_id, invite_code, max_members) VALUES
('Fitness Warriors', 'A group dedicated to fitness and healthy living', 'public', 1, 'FIT2024', 100),
('Study Buddies', 'Students supporting each other in learning', 'private', 2, 'STUDY24', 50),
('Startup Founders', 'Entrepreneurs building the future', 'invite_only', 3, 'STARTUP', 30),
('Morning Risers', 'Early birds who conquer the day', 'public', 1, 'MORNING', 200);

-- ============================================================================
-- SEED SQUAD MEMBERS
-- ============================================================================
INSERT INTO squad_members (squad_id, user_id, role, invited_by) VALUES
-- Fitness Warriors
(1, 1, 'owner', NULL),
(1, 2, 'member', 1),
(1, 3, 'member', 1),

-- Study Buddies
(2, 2, 'owner', NULL),
(2, 1, 'member', 2),

-- Startup Founders
(3, 3, 'owner', NULL),
(3, 1, 'member', 3),

-- Morning Risers
(4, 1, 'owner', NULL),
(4, 2, 'admin', 1),
(4, 3, 'member', 1),
(4, 4, 'member', 1);

-- ============================================================================
-- SEED SQUAD ACTIVITIES
-- ============================================================================
INSERT INTO squad_activities (squad_id, user_id, activity_type, activity_data) VALUES
(1, 1, 'habit_completed', '{"habit_name": "Morning Run", "streak": 7}'),
(1, 2, 'member_joined', '{"username": "janesmith"}'),
(1, 3, 'member_joined', '{"username": "alexj"}'),
(2, 2, 'milestone_reached', '{"milestone": "100 study hours"}'),
(4, 1, 'achievement_unlocked', '{"achievement": "7 day streak"}');

-- ============================================================================
-- SEED NOTIFICATIONS
-- ============================================================================
INSERT INTO notifications (user_id, notification_type, title, message, data) VALUES
(1, 'streak_milestone', 'Amazing! 7 Day Streak! 🔥', 'You have maintained a 7-day streak on Morning Run', '{"habit_id": 1, "streak": 7}'),
(2, 'squad_invite', 'New Squad Invitation', 'John invited you to join Fitness Warriors', '{"squad_id": 1, "invited_by": 1}'),
(3, 'habit_reminder', 'Time to Network!', 'Don\'t forget your networking goal for today', '{"habit_id": 10}'),
(1, 'squad_activity', 'Squad Update', 'Jane completed a study session in Study Buddies', '{"squad_id": 2, "user_id": 2}');
