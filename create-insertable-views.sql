-- MessAway Legacy Compatibility - INSERTABLE VIEWS
-- These views handle both SELECT and INSERT operations for backward compatibility

-- Drop existing views
DROP VIEW IF EXISTS USUARIO;
DROP VIEW IF EXISTS CASA;
DROP VIEW IF EXISTS TAREFA;
DROP VIEW IF EXISTS COMODO;
DROP VIEW IF EXISTS CATEGORIA;
DROP VIEW IF EXISTS USUARIO_CASA;
DROP VIEW IF EXISTS CONTA;
DROP VIEW IF EXISTS CONTA_USUARIO;

-- 1. USUARIO - Insertable view for users
CREATE OR REPLACE VIEW USUARIO AS
SELECT 
    id AS id_usuario,
    full_name AS nome,
    email AS email,
    password_hash AS senha,
    created_at AS data_criacao,
    active AS ativo
FROM users;

-- Make USUARIO insertable
CREATE OR REPLACE RULE usuario_insert AS
ON INSERT TO USUARIO DO INSTEAD
    INSERT INTO users (full_name, email, password_hash, active)
    VALUES (NEW.nome, NEW.email, NEW.senha, COALESCE(NEW.ativo, true))
    RETURNING 
        id AS id_usuario,
        full_name AS nome,
        email AS email,
        password_hash AS senha,
        created_at AS data_criacao,
        active AS ativo;

-- 2. CASA - Insertable view for houses  
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

-- Make CASA insertable (requires owner_id)
CREATE OR REPLACE RULE casa_insert AS
ON INSERT TO CASA DO INSTEAD
    INSERT INTO houses (name, description, address, owner_id, active)
    VALUES (NEW.nome, NEW.descricao, NEW.endereco, 
           COALESCE(NEW.id_usuario_proprietario, 1), -- Default to user 1 if not provided
           COALESCE(NEW.ativo, true))
    RETURNING 
        id AS id_casa,
        name AS nome,
        description AS descricao,
        address AS endereco,
        owner_id AS id_usuario_proprietario,
        total_points AS pontos,
        image_url AS imagem,
        created_at AS data_criacao,
        active AS ativo;

-- 3. COMODO - Insertable view for rooms
CREATE OR REPLACE VIEW COMODO AS
SELECT
    id AS id_comodo,
    house_id AS id_casa,
    name AS nome,
    description AS descricao,
    created_at AS data_criacao,
    active AS ativo
FROM rooms;

CREATE OR REPLACE RULE comodo_insert AS
ON INSERT TO COMODO DO INSTEAD
    INSERT INTO rooms (house_id, name, description, active)
    VALUES (NEW.id_casa, NEW.nome, NEW.descricao, COALESCE(NEW.ativo, true))
    RETURNING 
        id AS id_comodo,
        house_id AS id_casa,
        name AS nome,
        description AS descricao,
        created_at AS data_criacao,
        active AS ativo;

-- 4. TAREFA - Insertable view for tasks
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

CREATE OR REPLACE RULE tarefa_insert AS
ON INSERT TO TAREFA DO INSTEAD
    INSERT INTO tasks (room_id, assigned_user_id, title, description, due_date, frequency_days, status)
    VALUES (NEW.id_comodo, NEW.id_usuario, NEW.nome, NEW.descricao, NEW.data_estimada, 
           NEW.frequencia, CASE WHEN NEW.ativo = false THEN 'cancelled' ELSE 'pending' END)
    RETURNING 
        id AS id_tarefa,
        room_id AS id_comodo,
        assigned_user_id AS id_usuario,
        1 AS id_categoria,
        title AS nome,
        description AS descricao,
        created_at AS data_criacao,
        due_date AS data_estimada,
        frequency_days AS frequencia,
        CASE WHEN status = 'completed' THEN true ELSE false END AS concluida,
        CASE WHEN status != 'cancelled' THEN true ELSE false END AS ativo,
        assigned_user_id AS id_usuario_responsavel;

-- 5. USUARIO_CASA - Insertable view for user_houses
CREATE OR REPLACE VIEW USUARIO_CASA AS
SELECT
    id AS id_usuario_casa,
    user_id AS id_usuario,
    house_id AS id_casa,
    role AS permissao,
    nickname AS apelido,
    joined_at AS data_associacao
FROM user_houses;

CREATE OR REPLACE RULE usuario_casa_insert AS
ON INSERT TO USUARIO_CASA DO INSTEAD
    INSERT INTO user_houses (user_id, house_id, role, nickname, active)
    VALUES (NEW.id_usuario, NEW.id_casa, NEW.permissao, NEW.apelido, true)
    RETURNING 
        id AS id_usuario_casa,
        user_id AS id_usuario,
        house_id AS id_casa,
        role AS permissao,
        nickname AS apelido,
        joined_at AS data_associacao;

-- 6. Legacy CONTA and CONTA_USUARIO (map to users table for now)
CREATE OR REPLACE VIEW CONTA AS
SELECT
    id AS id_conta,
    full_name AS nome,
    email AS email,
    password_hash AS senha,
    created_at AS data_cadastro,
    1 AS id_casa, -- Default house
    active AS ativo
FROM users;

CREATE OR REPLACE RULE conta_insert AS
ON INSERT TO CONTA DO INSTEAD
    INSERT INTO users (full_name, email, password_hash, active)
    VALUES (NEW.nome, NEW.email, NEW.senha, COALESCE(NEW.ativo, true))
    RETURNING 
        id AS id_conta,
        full_name AS nome,
        email AS email,
        password_hash AS senha,
        created_at AS data_cadastro,
        1 AS id_casa,
        active AS ativo;

-- 7. CONTA_USUARIO view (simplified mapping)
CREATE OR REPLACE VIEW CONTA_USUARIO AS
SELECT
    id AS id_conta_usuario,
    id AS id_conta,
    id AS id_usuario,
    display_name AS apelido,
    '#6366f1' AS cor,
    CASE WHEN is_admin THEN 'admin' ELSE 'member' END AS permissao,
    created_at AS data_associacao
FROM users;

CREATE OR REPLACE RULE conta_usuario_insert AS
ON INSERT TO CONTA_USUARIO DO INSTEAD
    SELECT 1; -- No-op for now, as this is handled by user creation

-- Success message
SELECT '✅ Insertable legacy compatibility views created!' as status;