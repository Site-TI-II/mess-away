-- Migration: Add points tracking and achievements tables
-- Date: 2025-10-23

-- 1) Add points column to CASA for tracking total points
ALTER TABLE CASA ADD COLUMN IF NOT EXISTS pontos INTEGER DEFAULT 0;

-- 2) Create points log table for tracking point changes
CREATE TABLE IF NOT EXISTS CASA_POINTS_LOG (
    id_points_log SERIAL PRIMARY KEY,
    id_casa INTEGER NOT NULL REFERENCES CASA(id_casa) ON DELETE CASCADE,
    delta INTEGER NOT NULL,  -- Can be positive or negative
    reason VARCHAR(100) NOT NULL,  -- e.g., 'task_completed', 'achievement_unlocked', 'manual_simulation'
    data_log TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_casa_points_log_casa ON CASA_POINTS_LOG(id_casa);
CREATE INDEX IF NOT EXISTS idx_casa_points_log_date ON CASA_POINTS_LOG(data_log DESC);

-- 3) Create achievements table
CREATE TABLE IF NOT EXISTS ACHIEVEMENT (
    id_achievement SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    pontos INTEGER NOT NULL DEFAULT 0,
    icone VARCHAR(200),  -- URL or path to achievement icon
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4) Create user achievements table for tracking unlocked achievements
CREATE TABLE IF NOT EXISTS USUARIO_ACHIEVEMENT (
    id_usuario_achievement SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    id_achievement INTEGER NOT NULL REFERENCES ACHIEVEMENT(id_achievement) ON DELETE CASCADE,
    data_desbloqueio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_usuario, id_achievement)  -- Each achievement can only be unlocked once per user
);

CREATE INDEX IF NOT EXISTS idx_usuario_achievement_user ON USUARIO_ACHIEVEMENT(id_usuario);