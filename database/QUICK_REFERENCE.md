# Database Quick Reference

## Table Summary

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `users` | User accounts | id, email, username |
| `identities` | User identities | id, user_id, identity_name |
| `habits` | Habit definitions | id, identity_id, habit_name |
| `completions` | Habit completions | id, habit_id, completion_date |
| `squads` | Social groups | id, squad_name, owner_id |
| `squad_members` | Squad membership | id, squad_id, user_id, role |

## Common Query Patterns

### User Queries

```sql
-- Get user by email
SELECT * FROM users WHERE email = ?;

-- Get user with identities
SELECT u.*, i.* 
FROM users u
LEFT JOIN identities i ON u.id = i.user_id
WHERE u.id = ?;

-- Get user's active habits
SELECT h.* 
FROM habits h
WHERE h.user_id = ? AND h.is_active = TRUE;
```

### Habit Queries

```sql
-- Get habits for an identity
SELECT * FROM habits 
WHERE identity_id = ? AND is_active = TRUE;

-- Get habit with recent completions
SELECT h.*, c.*
FROM habits h
LEFT JOIN completions c ON h.id = c.habit_id
WHERE h.id = ?
ORDER BY c.completion_date DESC
LIMIT 30;

-- Get habit streak
SELECT 
    h.habit_name,
    h.streak_count,
    h.best_streak,
    h.total_completions
FROM habits h
WHERE h.id = ?;
```

### Completion Queries

```sql
-- Get completions for a date range
SELECT * FROM completions
WHERE habit_id = ?
AND completion_date BETWEEN ? AND ?;

-- Get today's completions for user
SELECT h.habit_name, c.*
FROM completions c
JOIN habits h ON c.habit_id = h.id
WHERE c.user_id = ? 
AND c.completion_date = CURDATE();

-- Get completion rate
SELECT 
    h.habit_name,
    COUNT(c.id) as completed_days,
    DATEDIFF(CURDATE(), h.start_date) as total_days,
    (COUNT(c.id) / DATEDIFF(CURDATE(), h.start_date) * 100) as completion_rate
FROM habits h
LEFT JOIN completions c ON h.id = c.habit_id
WHERE h.user_id = ?
GROUP BY h.id;
```

### Squad Queries

```sql
-- Get user's squads
SELECT s.*, sm.role
FROM squads s
JOIN squad_members sm ON s.id = sm.squad_id
WHERE sm.user_id = ? AND sm.is_active = TRUE;

-- Get squad members
SELECT u.*, sm.role, sm.joined_at
FROM squad_members sm
JOIN users u ON sm.user_id = u.id
WHERE sm.squad_id = ? AND sm.is_active = TRUE;

-- Get squad leaderboard
SELECT 
    u.username,
    u.full_name,
    COUNT(DISTINCT c.id) as total_completions,
    COUNT(DISTINCT h.id) as active_habits,
    SUM(h.streak_count) as total_streak
FROM squad_members sm
JOIN users u ON sm.user_id = u.id
LEFT JOIN habits h ON u.id = h.user_id AND h.is_active = TRUE
LEFT JOIN completions c ON h.id = c.habit_id
WHERE sm.squad_id = ? AND sm.is_active = TRUE
GROUP BY u.id
ORDER BY total_completions DESC;
```

### Analytics Queries

```sql
-- Get user's overall stats
SELECT 
    COUNT(DISTINCT i.id) as total_identities,
    COUNT(DISTINCT h.id) as total_habits,
    COUNT(DISTINCT c.id) as total_completions,
    AVG(h.streak_count) as avg_streak,
    MAX(h.best_streak) as best_streak
FROM users u
LEFT JOIN identities i ON u.id = i.user_id
LEFT JOIN habits h ON i.id = h.identity_id
LEFT JOIN completions c ON h.id = c.habit_id
WHERE u.id = ?;

-- Get completion trend (last 30 days)
SELECT 
    DATE(c.completion_date) as date,
    COUNT(c.id) as completions
FROM completions c
WHERE c.user_id = ?
AND c.completion_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(c.completion_date)
ORDER BY date;

-- Get mood analysis
SELECT 
    c.mood,
    COUNT(*) as count,
    AVG(c.energy_level) as avg_energy
FROM completions c
WHERE c.user_id = ?
AND c.mood IS NOT NULL
GROUP BY c.mood;
```

## Enum Values

### habits.frequency_type
- `daily`
- `weekly`
- `monthly`
- `custom`

### habits.difficulty_level
- `easy`
- `medium`
- `hard`

### completions.mood
- `great`
- `good`
- `okay`
- `bad`
- `terrible`

### squads.squad_type
- `public`
- `private`
- `invite_only`

### squad_members.role
- `owner`
- `admin`
- `moderator`
- `member`

## Triggers

### after_squad_member_insert
Updates `squads.current_member_count` when a member joins

### after_squad_member_delete
Updates `squads.current_member_count` when a member leaves

### after_completion_insert
Updates habit's `total_completions`, `streak_count`, and `best_streak`

## Best Practices

1. **Always use prepared statements** to prevent SQL injection
2. **Index foreign keys** for better join performance
3. **Use transactions** for multi-table operations
4. **Soft delete** using `deleted_at` instead of hard deletes
5. **Store timestamps in UTC** and convert in application layer
6. **Use JSON columns** for flexible metadata, but don't query them frequently
7. **Batch insert completions** for better performance
8. **Cache frequently accessed data** (user profiles, squad info)

## Performance Tips

- Use `EXPLAIN` to analyze query performance
- Add composite indexes for common WHERE clauses
- Limit result sets with `LIMIT` and pagination
- Use `COUNT(*)` sparingly on large tables
- Consider read replicas for analytics queries
- Archive old completions to separate tables
