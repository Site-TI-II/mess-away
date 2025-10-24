-- Migration: Create CASA_ACHIEVEMENT table for tracking casa-level achievements
-- Date: 2025-10-23

-- Create casa achievements table
CREATE TABLE IF NOT EXISTS CASA_ACHIEVEMENT (
    id_casa_achievement SERIAL PRIMARY KEY,
    id_casa INTEGER NOT NULL REFERENCES CASA(id_casa) ON DELETE CASCADE,
    id_achievement INTEGER NOT NULL REFERENCES ACHIEVEMENT(id_achievement) ON DELETE CASCADE,
    data_obtencao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_casa, id_achievement)  -- Each achievement can only be unlocked once per casa
);

CREATE INDEX IF NOT EXISTS idx_casa_achievement_casa ON CASA_ACHIEVEMENT(id_casa);
CREATE INDEX IF NOT EXISTS idx_casa_achievement_date ON CASA_ACHIEVEMENT(data_obtencao DESC);
