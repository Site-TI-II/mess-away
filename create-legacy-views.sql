-- MessAway Legacy Compatibility Views
-- These views provide backward compatibility for existing Java code

-- 1. USUARIO view (maps to users table)
CREATE OR REPLACE VIEW USUARIO AS
SELECT 
    id AS id_usuario,
    full_name AS nome,
    email AS email,
    password_hash AS senha,
    created_at AS data_criacao,
    active AS ativo
FROM users;

-- 2. CASA view (maps to houses table)  
CREATE OR REPLACE VIEW CASA AS
SELECT
    id AS id_casa,
    name AS nome,
    description AS descricao,
    address AS endereco,
    owner_id AS id_usuario_proprietario,
    total_points AS pontos,
    image_url AS imagem,
    created_at AS data_criacao,
    active AS ativo
FROM houses;

-- 3. TAREFA view (maps to tasks table with rooms join)
CREATE OR REPLACE VIEW TAREFA AS
SELECT
    t.id AS id_tarefa,
    t.room_id AS id_comodo,
    t.assigned_user_id AS id_usuario,
    1 AS id_categoria, -- Default category
    t.title AS nome,
    t.description AS descricao,
    t.created_at AS data_criacao,
    t.due_date AS data_estimada,
    t.frequency_days AS frequencia,
    CASE WHEN t.status = 'completed' THEN true ELSE false END AS concluida,
    CASE WHEN t.status != 'cancelled' THEN true ELSE false END AS ativo,
    t.assigned_user_id AS id_usuario_responsavel
FROM tasks t;

-- 4. COMODO view (maps to rooms table)
CREATE OR REPLACE VIEW COMODO AS
SELECT
    id AS id_comodo,
    house_id AS id_casa,
    name AS nome,
    description AS descricao,
    created_at AS data_criacao,
    active AS ativo
FROM rooms;

-- 5. CATEGORIA view (synthetic categories)
CREATE OR REPLACE VIEW CATEGORIA AS
SELECT 
    1 AS id_categoria,
    'Limpeza' AS nome,
    'Tarefas de limpeza geral' AS descricao
UNION ALL
SELECT 
    2 AS id_categoria,
    'Manutenção' AS nome,
    'Tarefas de manutenção' AS descricao
UNION ALL
SELECT 
    3 AS id_categoria,
    'Cozinha' AS nome,
    'Tarefas relacionadas à cozinha' AS descricao;

-- 6. USUARIO_CASA view (maps to user_houses table)
CREATE OR REPLACE VIEW USUARIO_CASA AS
SELECT
    id AS id_usuario_casa,
    user_id AS id_usuario,
    house_id AS id_casa,
    role AS permissao,
    nickname AS apelido,
    joined_at AS data_associacao
FROM user_houses;

-- Success message
SELECT '✅ Legacy compatibility views created successfully!' as status;