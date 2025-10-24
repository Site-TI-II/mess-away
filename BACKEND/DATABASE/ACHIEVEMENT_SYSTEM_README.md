# Achievement System - Casa Points & Achievements

## Overview
The achievement system tracks casa (house) progress through points and unlocks achievements based on accumulated points. The system implements an automatic tiering mechanism where earning a higher-level achievement automatically includes all lower-level achievements.

## Key Concepts

### 1. **Casa Points**
- Each casa accumulates points through task completion and other activities
- Points are stored in the `CASA.pontos` column
- All point changes are logged in `CASA_POINTS_LOG` for auditing and tracking

### 2. **Achievement Tiers**
Achievements are organized into four tiers based on point requirements:

| Tier | Point Range | Color | Badge |
|------|------------|-------|-------|
| Bronze | 0-99 | #CD7F32 | 🥉 |
| Silver | 100-499 | #C0C0C0 | 🥈 |
| Gold | 500-999 | #FFD700 | 🥇 |
| Platinum | 1000+ | #E5E4E2 | 💎 |

### 3. **Automatic Achievement Unlocking**
When a casa reaches a certain point threshold:
- The achievement for that threshold is unlocked
- **All achievements with lower point requirements are automatically included**
- Example: If a casa has 150 points, they will show achievements for 10, 25, 50, 75, 100, and 150 points

## Database Schema

### Tables

#### ACHIEVEMENT
```sql
CREATE TABLE ACHIEVEMENT (
    id_achievement SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL,              -- Emoji icon
    description TEXT NOT NULL,
    requirement_type VARCHAR(50) NOT NULL,  -- 'HOUSE_POINTS', 'TASKS_COMPLETED', etc.
    requirement_value INT NOT NULL,         -- Threshold value
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### CASA_ACHIEVEMENT
```sql
CREATE TABLE CASA_ACHIEVEMENT (
    id_casa_achievement SERIAL PRIMARY KEY,
    id_casa INTEGER NOT NULL REFERENCES CASA(id_casa),
    id_achievement INTEGER NOT NULL REFERENCES ACHIEVEMENT(id_achievement),
    data_obtencao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_casa, id_achievement)
);
```

#### CASA_POINTS_LOG
```sql
CREATE TABLE CASA_POINTS_LOG (
    id_points_log SERIAL PRIMARY KEY,
    id_casa INTEGER NOT NULL REFERENCES CASA(id_casa),
    delta INTEGER NOT NULL,                 -- Points added (can be negative)
    reason VARCHAR(100) NOT NULL,           -- 'task_completion', 'manual_simulation', etc.
    task_id INTEGER REFERENCES TAREFA(id_tarefa),
    user_id INTEGER REFERENCES USUARIO(id_usuario),
    data_log TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Get Casa Achievements
```
GET /MessAway/casas/:id/achievements
```
Returns all achievements unlocked by a specific casa, sorted by requirement_value (ascending).

**Response:**
```json
[
  {
    "id": 1,
    "name": "Casa Iniciante",
    "icon": "🏠",
    "description": "Conquiste seus primeiros 10 pontos",
    "requirementType": "HOUSE_POINTS",
    "requirementValue": 10,
    "dataCriacao": "2025-10-23T..."
  }
]
```

### Simulate Points (Testing)
```
POST /MessAway/casas/:id/simulate-points
Body: { "points": 100 }
```
Adds points to a casa and automatically unlocks appropriate achievements.

**Response:**
```json
{
  "newTotal": 250
}
```

## Frontend Implementation

### AchievementsSection Component
Located at: `FRONTEND/src/pages/Dashboard/components/AchievementsSection.jsx`

**Features:**
- Dynamic display of casa achievements
- Automatic tier calculation based on points
- Progress bar showing advancement to next tier
- Tooltip showing achievement details
- Color-coded borders based on achievement tier
- Hover animations for better UX
- Empty state when no achievements are unlocked

**Props:**
```jsx
<AchievementsSection 
  achievements={[...]}  // Array of achievement objects
  totalPoints={150}      // Total casa points
/>
```

### Dashboard Integration
The Dashboard component (`FRONTEND/src/pages/Dashboard/Dashboard.jsx`) automatically:
1. Loads casa data including points
2. Fetches achievements for the current casa
3. Passes data to AchievementsSection component
4. Updates when casa changes

## Achievement Progression Examples

### Scenario 1: Casa with 150 points
**Unlocked achievements:**
- Bronze tier: 10, 25, 50, 75 points ✅
- Silver tier: 100, 150 points ✅
- Not unlocked: 200+ points ❌

**Display:** Shows 6 achievement cards (all Bronze + first 2 Silver)

### Scenario 2: Casa with 600 points
**Unlocked achievements:**
- Bronze tier: All (10, 25, 50, 75) ✅
- Silver tier: All (100, 150, 200, 300, 400) ✅
- Gold tier: 500, 600 ✅
- Not unlocked: 700+ points ❌

**Display:** Shows 11 achievement cards (all Bronze, Silver, and first 2 Gold)

## Backend Logic

### AchievementDAO.java

#### `listCasaAchievements(long casaId)`
Retrieves all achievements earned by a casa, sorted by requirement_value.

#### `simulatePoints(long casaId, int points)`
1. Logs point change in CASA_POINTS_LOG
2. Updates CASA.pontos atomically
3. Automatically inserts achievements into CASA_ACHIEVEMENT for all thresholds met
4. Returns new total points

Key SQL logic:
```sql
INSERT INTO CASA_ACHIEVEMENT (id_casa, id_achievement)
SELECT ?, a.id_achievement
FROM ACHIEVEMENT a
WHERE a.requirement_type = 'HOUSE_POINTS' 
  AND a.requirement_value <= (current_points)
  AND NOT EXISTS (
    SELECT 1 FROM CASA_ACHIEVEMENT ca 
    WHERE ca.id_casa = ? AND ca.id_achievement = a.id_achievement
  );
```

This ensures:
- Only HOUSE_POINTS type achievements are auto-unlocked
- Only achievements the casa has earned are inserted
- No duplicate achievements (due to UNIQUE constraint)

## Migration Files

Run these migrations in order:
1. `2025-10-23_add_points_and_achievements.sql` - Base tables
2. `2025-10-23_add_task_user_to_points_log.sql` - Tracking columns
3. `2025-10-23_create_casa_achievements.sql` - Casa achievement tracking
4. `2025-10-23_insert_casa_achievements.sql` - Sample achievements data

## Testing

### Manual Testing
1. Create a casa
2. Use the simulate-points endpoint to add points:
   ```bash
   curl -X POST http://localhost:4567/MessAway/casas/1/simulate-points \
     -H "Content-Type: application/json" \
     -d '{"points": 150}'
   ```
3. Check achievements endpoint:
   ```bash
   curl http://localhost:4567/MessAway/casas/1/achievements
   ```
4. Verify the dashboard displays achievements correctly

### Expected Behavior
- Adding 150 points should unlock 6 achievements (Bronze: 4, Silver: 2)
- Each achievement should display with correct tier color
- Progress bar should show correct advancement
- Tooltips should show achievement details

## Future Enhancements

1. **Multiple Casa Support**: Allow users to switch between casas in dashboard
2. **Achievement Notifications**: Show popup when new achievement is unlocked
3. **Achievement History**: Timeline of when achievements were earned
4. **Special Achievements**: Add non-points-based achievements (streaks, task types, etc.)
5. **Leaderboard**: Compare casa points across multiple houses
6. **Achievement Rewards**: Unlock themes, badges, or features based on achievements

## Troubleshooting

### Achievements not appearing
- Check if CASA_ACHIEVEMENT table exists
- Verify casa has points: `SELECT pontos FROM CASA WHERE id_casa = ?`
- Check if achievements exist: `SELECT * FROM ACHIEVEMENT WHERE requirement_type = 'HOUSE_POINTS'`
- Verify casa_achievements: `SELECT * FROM CASA_ACHIEVEMENT WHERE id_casa = ?`

### Points not updating
- Check CASA_POINTS_LOG for recent entries
- Verify CASA.pontos column exists and is correctly updated
- Check database transaction logs for errors

### Frontend not loading
- Verify API endpoint is accessible
- Check browser console for errors
- Verify casaId is being passed correctly
- Check API response format matches expected structure
