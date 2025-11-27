# Data Migration Plan: 17 Tables → 8 Tables

**Goal:** Safely migrate existing MessAway data to the optimized schema

---

## 📋 Migration Overview

### Phase 1: Create New Schema  
### Phase 2: Migrate Data
### Phase 3: Update Application Code
### Phase 4: Test & Deploy

---

## 🔄 Table Mapping

| **Old Tables (17)** | **New Table** | **Migration Strategy** |
|---------------------|---------------|----------------------|
| USUARIO + CONTA + CONTA_USUARIO | → **users** | Merge with JSON settings |
| CASA + multi-casa logic | → **houses** | Simplify ownership |
| COMODO + CATEGORIA | → **rooms** | Embed category as field |
| TAREFA | → **tasks** | Add JSON metadata |
| GASTO + META_GASTO + GASTO_USUARIO + META_GASTO_USUARIO | → **expenses** | Unify with flags |
| USUARIO_CASA | → **user_houses** | Add role-based access |
| ACHIEVEMENT + USUARIO_ACHIEVEMENT + CASA_ACHIEVEMENT + CASA_POINTS_LOG | → **achievements** | Simplify tracking |
| INSIGHT | → **app_settings** | Store as JSON config |

---

## 📝 Migration Scripts

### 1. Create New Schema
```sql
-- Run the simplified schema
\i schema_simplified.sql
```

### 2. Data Migration Queries

#### 2.1 Migrate Users
```sql
-- Merge USUARIO + CONTA + CONTA_USUARIO into users table
INSERT INTO users (
    id, email, password_hash, full_name, display_name, 
    is_admin, settings, created_at, active
)
SELECT DISTINCT
    u.id_usuario,
    COALESCE(c.email, u.email),
    COALESCE(c.senha, u.senha),
    COALESCE(c.nome, u.nome),
    cu.apelido,
    COALESCE(c.is_admin, FALSE),
    json_build_object(
        'color', cu.cor,
        'permission', cu.permissao,
        'preferences', '{}'
    ),
    COALESCE(u.data_criacao, c.data_cadastro),
    COALESCE(u.ativo, c.ativo, TRUE)
FROM USUARIO u
LEFT JOIN CONTA_USUARIO cu ON u.id_usuario = cu.id_usuario  
LEFT JOIN CONTA c ON cu.id_conta = c.id_conta
WHERE u.ativo = TRUE;
```

#### 2.2 Migrate Houses
```sql
-- Migrate CASA to houses table
INSERT INTO houses (
    id, name, description, address, owner_id, 
    total_points, settings, created_at, active
)
SELECT 
    c.id_casa,
    c.nome,
    c.descricao,
    c.endereco,
    COALESCE(c.id_conta, 1), -- Default to first user if no owner
    COALESCE(c.pontos, 0),
    json_build_object(
        'image', c.imagem,
        'preferences', '{}'
    ),
    c.data_criacao,
    c.ativo
FROM CASA c
WHERE c.ativo = TRUE;
```

#### 2.3 Migrate Rooms
```sql
-- Merge COMODO + CATEGORIA into rooms table
INSERT INTO rooms (
    id, house_id, name, category, description, 
    color, created_at, active
)
SELECT 
    cm.id_comodo,
    cm.id_casa,
    cm.nome,
    COALESCE(cat.nome, 'general'),
    COALESCE(cm.descricao, cat.descricao),
    '#6366f1', -- Default color
    cm.data_criacao,
    cm.ativo
FROM COMODO cm
LEFT JOIN CATEGORIA cat ON TRUE  -- Categories will be handled differently
WHERE cm.ativo = TRUE;
```

#### 2.4 Migrate Tasks
```sql
-- Migrate TAREFA to tasks table with enhanced fields
INSERT INTO tasks (
    id, room_id, assigned_user_id, title, description,
    status, priority, due_date, completed_at, points_value,
    frequency_days, metadata, created_at, updated_at
)
SELECT 
    t.id_tarefa,
    t.id_comodo,
    t.id_usuario,
    t.nome,
    t.descricao,
    CASE 
        WHEN t.ativo = TRUE THEN 'completed'
        ELSE 'pending'
    END,
    2, -- Default normal priority
    t.data_estimada,
    CASE WHEN t.ativo = TRUE THEN t.data_criacao ELSE NULL END,
    10, -- Default points
    t.frequencia,
    json_build_object(
        'original_category_id', t.id_categoria,
        'legacy_data', '{}'
    ),
    t.data_criacao,
    t.data_criacao
FROM TAREFA t
WHERE t.id_comodo IN (SELECT id FROM rooms);
```

#### 2.5 Migrate Expenses
```sql
-- Unify all expense tables into single expenses table
-- House expenses
INSERT INTO expenses (
    house_id, user_id, category, title, amount, 
    is_personal, expense_date, created_at
)
SELECT 
    g.id_casa,
    1, -- Default user, update based on your logic
    'general',
    g.nome,
    g.valor,
    FALSE, -- House expense
    g.data_criacao::date,
    g.data_criacao
FROM GASTO g;

-- User personal expenses  
INSERT INTO expenses (
    house_id, user_id, category, title, amount,
    is_personal, expense_date, created_at
)
SELECT 
    NULL, -- Personal expense
    gu.id_usuario,
    'personal',
    gu.nome,
    gu.valor,
    TRUE, -- Personal expense
    gu.data_criacao::date,
    gu.data_criacao
FROM GASTO_USUARIO gu;
```

#### 2.6 Migrate User-House Relationships
```sql
-- Migrate USUARIO_CASA to user_houses with roles
INSERT INTO user_houses (
    user_id, house_id, role, nickname, points, 
    joined_at, active
)
SELECT 
    uc.id_usuario,
    uc.id_casa,
    CASE 
        WHEN uc.permissao ILIKE '%admin%' THEN 'admin'
        WHEN uc.permissao ILIKE '%owner%' THEN 'owner'  
        ELSE 'member'
    END,
    NULL, -- Will be filled from user settings
    0, -- Reset points
    uc.data_associacao,
    TRUE
FROM USUARIO_CASA uc;
```

#### 2.7 Migrate Achievements
```sql
-- Simplify achievement system
-- House achievements
INSERT INTO achievements (
    house_id, achievement_type, achievement_level, title,
    description, icon_emoji, points_awarded, earned_at
)
SELECT 
    ca.id_casa,
    'points_milestone',
    CASE 
        WHEN a.requirement_value < 200 THEN 'bronze'
        WHEN a.requirement_value < 600 THEN 'silver'
        WHEN a.requirement_value < 1200 THEN 'gold'
        ELSE 'platinum'
    END,
    a.name,
    a.description,
    COALESCE(a.icon, '🏆'),
    a.requirement_value,
    ca.data_obtencao
FROM CASA_ACHIEVEMENT ca
JOIN ACHIEVEMENT a ON ca.id_achievement = a.id_achievement;

-- User achievements  
INSERT INTO achievements (
    user_id, achievement_type, achievement_level, title,
    description, icon_emoji, points_awarded, earned_at
)
SELECT 
    ua.id_usuario,
    'user_milestone',
    CASE 
        WHEN a.requirement_value < 200 THEN 'bronze'
        WHEN a.requirement_value < 600 THEN 'silver'
        WHEN a.requirement_value < 1200 THEN 'gold'
        ELSE 'platinum'
    END,
    a.name,
    a.description,
    COALESCE(a.icon, '🏆'),
    a.requirement_value,
    ua.data_obtencao
FROM USUARIO_ACHIEVEMENT ua
JOIN ACHIEVEMENT a ON ua.id_achievement = a.id_achievement;
```

#### 2.8 Migrate Settings
```sql
-- Convert INSIGHT to app_settings
INSERT INTO app_settings (setting_key, setting_value, description, is_system)
SELECT 
    CONCAT('insight_', i.type),
    json_build_object(
        'title', i.title,
        'message', i.message,
        'color', i.color,
        'icon', i.icon
    ),
    CONCAT('Migrated insight: ', i.type),
    TRUE
FROM INSIGHT i
WHERE i.active = TRUE;
```

---

## ⚡ Post-Migration Tasks

### 1. Update Sequences
```sql
-- Reset sequences to prevent ID conflicts
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('houses_id_seq', (SELECT MAX(id) FROM houses));  
SELECT setval('rooms_id_seq', (SELECT MAX(id) FROM rooms));
SELECT setval('tasks_id_seq', (SELECT MAX(id) FROM tasks));
SELECT setval('expenses_id_seq', (SELECT MAX(id) FROM expenses));
SELECT setval('user_houses_id_seq', (SELECT MAX(id) FROM user_houses));
SELECT setval('achievements_id_seq', (SELECT MAX(id) FROM achievements));
SELECT setval('app_settings_id_seq', (SELECT MAX(id) FROM app_settings));
```

### 2. Create Indexes and Analyze
```sql
-- Update statistics for query planner
ANALYZE;

-- Verify data integrity
SELECT 
    'users' as table_name, COUNT(*) as rows FROM users
UNION ALL
SELECT 'houses', COUNT(*) FROM houses
UNION ALL  
SELECT 'rooms', COUNT(*) FROM rooms
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'expenses', COUNT(*) FROM expenses
UNION ALL
SELECT 'user_houses', COUNT(*) FROM user_houses
UNION ALL
SELECT 'achievements', COUNT(*) FROM achievements
UNION ALL
SELECT 'app_settings', COUNT(*) FROM app_settings;
```

### 3. Test Queries
```sql
-- Test core functionality
SELECT u.full_name, h.name as house_name, uh.role
FROM users u
JOIN user_houses uh ON u.id = uh.user_id  
JOIN houses h ON uh.house_id = h.id
LIMIT 5;

-- Test task assignment
SELECT t.title, u.full_name as assigned_to, r.name as room_name
FROM tasks t
LEFT JOIN users u ON t.assigned_user_id = u.id
JOIN rooms r ON t.room_id = r.id  
LIMIT 5;
```

---

## 🚨 Migration Checklist

- [ ] **Create new simplified schema**
- [ ] **Run migration scripts**
- [ ] **Verify data integrity**
- [ ] **Update application code**
- [ ] **Test all functionality**
- [ ] **Deploy to Azure**
- [ ] **Monitor performance**

---

---

**Estimated Migration Time:** 1-2 hours  
**Estimated Downtime:** 15-30 minutes  
**Risk Level:** Low (simplified approach)

Ready to proceed with the migration? 🚀