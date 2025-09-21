# Entity Relationship Diagram

## Core Entities and Relationships

```
┌─────────────┐
│    USERS    │
│─────────────│
│ id (PK)     │
│ email       │
│ password    │
│ username    │
│ ...         │
└──────┬──────┘
       │
       │ 1:N
       │
       ├──────────────────────────────────┐
       │                                  │
       │                                  │
┌──────▼──────────┐              ┌───────▼────────┐
│   IDENTITIES    │              │ SQUAD_MEMBERS  │
│─────────────────│              │────────────────│
│ id (PK)         │              │ id (PK)        │
│ user_id (FK)    │              │ squad_id (FK)  │
│ identity_name   │              │ user_id (FK)   │
│ description     │              │ role           │
│ ...             │              │ ...            │
└────────┬────────┘              └───────┬────────┘
         │                               │
         │ 1:N                           │ N:1
         │                               │
┌────────▼────────┐              ┌───────▼────────┐
│     HABITS      │              │     SQUADS     │
│─────────────────│              │────────────────│
│ id (PK)         │              │ id (PK)        │
│ identity_id(FK) │              │ squad_name     │
│ user_id (FK)    │              │ owner_id (FK)  │
│ habit_name      │              │ description    │
│ frequency       │              │ ...            │
│ ...             │              └────────────────┘
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│   COMPLETIONS   │
│─────────────────│
│ id (PK)         │
│ habit_id (FK)   │
│ user_id (FK)    │
│ completed_at    │
│ mood            │
│ ...             │
└─────────────────┘
```

## Relationship Details

### Users → Identities (1:N)
- One user can have multiple identities
- Each identity belongs to exactly one user
- Cascade delete: Deleting a user deletes all their identities

### Identities → Habits (1:N)
- One identity can have multiple habits
- Each habit belongs to exactly one identity
- Cascade delete: Deleting an identity deletes all its habits

### Habits → Completions (1:N)
- One habit can have multiple completions
- Each completion belongs to exactly one habit
- Cascade delete: Deleting a habit deletes all its completions

### Users ↔ Squads (N:M via squad_members)
- Users can belong to multiple squads
- Squads can have multiple members
- Junction table: `squad_members`
- Includes role-based permissions

### Users → Squads (1:N as owner)
- One user can own multiple squads
- Each squad has exactly one owner
- Cascade delete: Deleting a user deletes their owned squads

## Supporting Relationships

### squad_activities
- Links to: squads (N:1), users (N:1)
- Tracks activities within squads

### user_sessions
- Links to: users (N:1)
- Manages authentication tokens

### notifications
- Links to: users (N:1)
- Stores user notifications

## Key Constraints

1. **Unique Constraints**
   - `users.email` - No duplicate emails
   - `users.username` - No duplicate usernames
   - `squads.invite_code` - Unique invite codes
   - `completions(habit_id, completion_date)` - One completion per habit per day

2. **Foreign Key Constraints**
   - All relationships enforced with foreign keys
   - Cascade deletes maintain referential integrity
   - Some nullable FKs for optional relationships

3. **Check Constraints**
   - `completions.energy_level` - Must be between 1 and 5
   - Various ENUM constraints for predefined values

## Indexes

### Primary Indexes
- All `id` columns are primary keys with auto-increment

### Foreign Key Indexes
- All foreign key columns are indexed for join performance

### Query Optimization Indexes
- `users.email` - For login queries
- `habits.is_active` - For filtering active habits
- `completions.completion_date` - For date range queries
- `squad_members(squad_id, user_id)` - For membership checks

## Data Flow Examples

### Creating a Habit
1. User creates an identity
2. Identity is linked to user via `user_id`
3. Habit is created linked to identity via `identity_id`
4. Habit also stores `user_id` for direct user access

### Completing a Habit
1. User marks habit as complete
2. Completion record created with `habit_id` and `user_id`
3. Trigger updates habit's `streak_count` and `total_completions`
4. Squad activity may be created if habit is shared

### Joining a Squad
1. User receives invite or finds public squad
2. Record created in `squad_members` with `squad_id` and `user_id`
3. Trigger increments squad's `current_member_count`
4. Squad activity created for member join event
