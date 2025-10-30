
-- ============================================
-- MessAway - Setup Completo do Banco de Dados
-- ============================================
-- Este script cria o banco, usuário, tabelas e permissões
-- Execute como usuário postgres

-- 1. Criar usuário messaway (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'messaway') THEN
        CREATE USER messaway WITH PASSWORD 'messaway123' SUPERUSER;
    END IF;
END
$$;

-- 2. Criar banco gestao_casas (se não existir)
SELECT 'CREATE DATABASE gestao_casas OWNER messaway'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gestao_casas')\gexec

-- 3. Conectar ao banco
\c gestao_casas

-- 4. Criar tabelas (schema.sql)
\i schema.sql

-- 5. Executar migrations
\i migrations/2025-10-23_multi_casas_admin.sql
\i migrations/2025-10-23_add_points_and_achievements.sql
\i migrations/2025-10-23_create_casa_achievements.sql
\i migrations/2025-10-23_add_task_user_to_points_log.sql
\i migrations/2025-10-23_gastos_por_usuario.sql

-- 6. Adicionar colunas faltantes (correções comuns)
ALTER TABLE conta ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
ALTER TABLE casa ADD COLUMN IF NOT EXISTS id_conta INTEGER REFERENCES conta(id_conta);
ALTER TABLE tarefa ADD COLUMN IF NOT EXISTS id_usuario_responsavel INTEGER REFERENCES usuario(id_usuario);

-- 7. Criar tabela casa_achievement se não existir
CREATE TABLE IF NOT EXISTS casa_achievement (
    id_casa_achievement SERIAL PRIMARY KEY,
    id_casa INTEGER REFERENCES casa(id_casa),
    id_achievement INTEGER REFERENCES achievement(id_achievement),
    data_conquista TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_casa, id_achievement)
);

-- 8. Dar todas as permissões ao usuário messaway
GRANT ALL PRIVILEGES ON DATABASE gestao_casas TO messaway;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO messaway;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO messaway;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO messaway;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO messaway;

-- 9. Inserir dados de exemplo (opcional)
\i insert.sql

-- 10. Criar conta de teste
INSERT INTO conta (nome, email, senha, id_casa, ativo, is_admin) 
SELECT 'Teste Local', 'teste@email.com', '123456', id_casa, true, false
FROM casa LIMIT 1
ON CONFLICT (email) DO UPDATE SET senha = '123456';

-- 11. Associar casas à conta de teste
UPDATE casa SET id_conta = (SELECT id_conta FROM conta WHERE email = 'teste@email.com' LIMIT 1)
WHERE id_conta IS NULL;

-- 12. Verificar instalação
SELECT 'Setup completo! Tabelas criadas:' as status;
\dt

SELECT 'Usuário de teste criado:' as status;
SELECT id_conta, nome, email FROM conta WHERE email = 'teste@email.com';

SELECT 'Casas disponíveis:' as status;
SELECT id_casa, nome, id_conta FROM casa LIMIT 5;