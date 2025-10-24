-- Insert casa-based achievements (HOUSE_POINTS type)
-- These achievements are unlocked based on total house points
-- The tiering system is automatic: if achievement 4 is unlocked, 1-3 are also shown

INSERT INTO ACHIEVEMENT (name, icon, description, requirement_type, requirement_value)
VALUES
-- Bronze tier (0-99 points)
('Casa Iniciante', '🏠', 'Conquiste seus primeiros 10 pontos', 'HOUSE_POINTS', 10),
('Primeiros Passos', '👣', 'Alcance 25 pontos na casa', 'HOUSE_POINTS', 25),
('Em Progresso', '📈', 'Chegue a 50 pontos', 'HOUSE_POINTS', 50),
('Crescendo', '🌱', 'Atinja 75 pontos', 'HOUSE_POINTS', 75),

-- Silver tier (100-499 points)
('Casa de Prata', '🥈', 'Conquiste 100 pontos!', 'HOUSE_POINTS', 100),
('Organização Prata', '✨', 'Alcance 150 pontos', 'HOUSE_POINTS', 150),
('Consistente', '💪', 'Atinja 200 pontos', 'HOUSE_POINTS', 200),
('Dedicado', '⭐', 'Chegue a 300 pontos', 'HOUSE_POINTS', 300),
('Quase Ouro', '🌟', 'Alcance 400 pontos', 'HOUSE_POINTS', 400),

-- Gold tier (500-999 points)
('Casa de Ouro', '🥇', 'Conquiste 500 pontos!', 'HOUSE_POINTS', 500),
('Elite Dourada', '👑', 'Atinja 600 pontos', 'HOUSE_POINTS', 600),
('Mestre da Organização', '🎖️', 'Alcance 700 pontos', 'HOUSE_POINTS', 700),
('Lenda', '🌠', 'Chegue a 850 pontos', 'HOUSE_POINTS', 850),

-- Platinum tier (1000+ points)
('Casa de Platina', '💎', 'Conquiste 1000 pontos!', 'HOUSE_POINTS', 1000),
('Perfeição Absoluta', '🏆', 'Atinja 1500 pontos', 'HOUSE_POINTS', 1500),
('Casa dos Sonhos', '🌈', 'Alcance 2000 pontos', 'HOUSE_POINTS', 2000),
('Inigualável', '✨', 'Chegue a 3000 pontos', 'HOUSE_POINTS', 3000);

-- Example: Give some achievements to Casa 1 (Daniela's house)
-- Assuming casa has earned achievements up to 150 points
-- This will automatically show Bronze (10, 25, 50, 75) and Silver (100, 150) achievements
INSERT INTO CASA_ACHIEVEMENT (id_casa, id_achievement)
SELECT 1, id_achievement 
FROM ACHIEVEMENT 
WHERE requirement_type = 'HOUSE_POINTS' 
AND requirement_value <= 150
ORDER BY requirement_value;
