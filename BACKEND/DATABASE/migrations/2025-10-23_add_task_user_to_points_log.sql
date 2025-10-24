-- Migration: Add task_id and user_id columns to CASA_POINTS_LOG
-- Date: 2025-10-23

-- Add optional task_id and user_id columns to track which task/user earned the points
ALTER TABLE CASA_POINTS_LOG 
ADD COLUMN IF NOT EXISTS task_id INTEGER REFERENCES TAREFA(id_tarefa) ON DELETE SET NULL;

ALTER TABLE CASA_POINTS_LOG 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES USUARIO(id_usuario) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_casa_points_log_task ON CASA_POINTS_LOG(task_id);
CREATE INDEX IF NOT EXISTS idx_casa_points_log_user ON CASA_POINTS_LOG(user_id);
