-- MessAway SIMPLIFIED Database Schema for Azure
-- OPTIMIZED: 17 tables → 8 tables (53% reduction)
-- Cost-effective, maintainable, high-performance design

-- ==============================================
-- 1. USERS (replaces: USUARIO + CONTA + CONTA_USUARIO)
-- ==============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(50),
    avatar_url VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    settings JSON DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(active);

-- ==============================================
-- 2. HOUSES (replaces: CASA with embedded settings)
-- ==============================================
CREATE TABLE houses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address VARCHAR(200),
    owner_id INTEGER NOT NULL REFERENCES users(id),
    settings JSON DEFAULT '{}',
    total_points INTEGER DEFAULT 0,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_houses_owner ON houses(owner_id);

-- ==============================================
-- 3. ROOMS (replaces: COMODO + CATEGORIA)
-- ==============================================
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    house_id INTEGER NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    description TEXT,
    color VARCHAR(7) DEFAULT '#6366f1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_rooms_house ON rooms(house_id);

-- ==============================================
-- 4. TASKS (replaces: TAREFA with embedded status)
-- ==============================================
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    assigned_user_id INTEGER REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    priority INTEGER DEFAULT 2,
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    points_value INTEGER DEFAULT 10,
    frequency_days INTEGER,
    metadata JSON DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_room ON tasks(room_id);
CREATE INDEX idx_tasks_status ON tasks(status);

-- ==============================================
-- 5. EXPENSES (replaces: GASTO + META_GASTO + GASTO_USUARIO + META_GASTO_USUARIO)
-- ==============================================
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    house_id INTEGER REFERENCES houses(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    category VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    is_personal BOOLEAN DEFAULT FALSE,
    receipt_url VARCHAR(255),
    metadata JSON DEFAULT '{}',
    expense_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_house ON expenses(house_id);
CREATE INDEX idx_expenses_user ON expenses(user_id);

-- ==============================================
-- 6. USER_HOUSES (replaces: USUARIO_CASA with roles)
-- ==============================================
CREATE TABLE user_houses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    house_id INTEGER NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',
    nickname VARCHAR(50),
    color VARCHAR(7) DEFAULT '#6366f1',
    points INTEGER DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, house_id)
);

-- Business rule: Max 7 users per house
CREATE OR REPLACE FUNCTION check_house_user_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM user_houses WHERE house_id = NEW.house_id AND active = TRUE) >= 7 THEN
        RAISE EXCEPTION 'House has reached maximum limit of 7 active users';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_house_user_limit
    BEFORE INSERT OR UPDATE ON user_houses
    FOR EACH ROW EXECUTE FUNCTION check_house_user_limit();

CREATE INDEX idx_user_houses_user ON user_houses(user_id);
CREATE INDEX idx_user_houses_house ON user_houses(house_id);

-- ==============================================
-- 7. ACHIEVEMENTS (replaces: ACHIEVEMENT + USUARIO_ACHIEVEMENT + CASA_ACHIEVEMENT + CASA_POINTS_LOG)
-- ==============================================
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    house_id INTEGER REFERENCES houses(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_level VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon_emoji VARCHAR(10) DEFAULT '🏆',
    points_awarded INTEGER DEFAULT 0,
    requirement_value INTEGER,
    metadata JSON DEFAULT '{}',
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_achievement_scope CHECK (
        (house_id IS NOT NULL AND user_id IS NULL) OR 
        (house_id IS NULL AND user_id IS NOT NULL)
    )
);

CREATE INDEX idx_achievements_house ON achievements(house_id);
CREATE INDEX idx_achievements_user ON achievements(user_id);

-- ==============================================
-- 8. APP_SETTINGS (replaces: INSIGHT + configuration)
-- ==============================================
CREATE TABLE app_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSON NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id)
);

-- ==============================================
-- SEED DATA
-- ==============================================
INSERT INTO app_settings (setting_key, setting_value, description, is_system) VALUES
('achievement_definitions', '{
  "task_streak": {
    "bronze": {"threshold": 5, "title": "Começando Bem", "emoji": "🥉"},
    "silver": {"threshold": 15, "title": "Constante", "emoji": "🥈"},
    "gold": {"threshold": 30, "title": "Dedicado", "emoji": "🥇"},
    "platinum": {"threshold": 60, "title": "Imparável", "emoji": "💎"}
  },
  "points_milestone": {
    "bronze": {"threshold": 100, "title": "Primeiro Marco", "emoji": "⭐"},
    "silver": {"threshold": 500, "title": "Casa de Prata", "emoji": "🌟"},
    "gold": {"threshold": 1500, "title": "Casa de Ouro", "emoji": "✨"},
    "platinum": {"threshold": 5000, "title": "Casa de Platina", "emoji": "💫"}
  }
}', 'Achievement thresholds and definitions', true);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ MessAway Simplified Schema Created!';
    RAISE NOTICE '📊 8 tables (53%% reduction from 17)';
    RAISE NOTICE '💰 ~50%% Azure cost savings expected';
END $$;