#!/bin/bash
# MessAway - Instalação Completa do Banco

echo "🗄️ Instalando banco de dados MessAway..."

# Ir para pasta DATABASE
cd "$(dirname "$0")"

# 1. Criar usuário e banco
echo "1️⃣ Criando usuário e banco..."
sudo -u postgres psql << SQL
DROP DATABASE IF EXISTS gestao_casas;
DROP OWNED BY messaway CASCADE;
DROP USER IF EXISTS messaway;
CREATE USER messaway WITH PASSWORD 'messaway123' SUPERUSER;
CREATE DATABASE gestao_casas OWNER messaway;
SQL

# 2. Executar schema
echo "2️⃣ Criando tabelas..."
sudo -u postgres psql -d gestao_casas -f schema.sql

# 3. Executar migrations
echo "3️⃣ Executando migrations..."
for migration in migrations/*.sql; do
    echo "   - $(basename $migration)"
    sudo -u postgres psql -d gestao_casas -f "$migration"
done

# 4. Correções adicionais
echo "4️⃣ Aplicando correções..."
sudo -u postgres psql -d gestao_casas << SQL
ALTER TABLE conta ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
ALTER TABLE casa ADD COLUMN IF NOT EXISTS id_conta INTEGER REFERENCES conta(id_conta);
ALTER TABLE tarefa ADD COLUMN IF NOT EXISTS id_usuario_responsavel INTEGER REFERENCES usuario(id_usuario);

CREATE TABLE IF NOT EXISTS casa_achievement (
    id_casa_achievement SERIAL PRIMARY KEY,
    id_casa INTEGER REFERENCES casa(id_casa),
    id_achievement INTEGER REFERENCES achievement(id_achievement),
    data_conquista TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_casa, id_achievement)
);
SQL

# 5. Permissões
echo "5️⃣ Configurando permissões..."
sudo -u postgres psql -d gestao_casas << SQL
GRANT ALL PRIVILEGES ON DATABASE gestao_casas TO messaway;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO messaway;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO messaway;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO messaway;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO messaway;
SQL

# 6. Dados de teste
echo "6️⃣ Inserindo dados de teste..."
sudo -u postgres psql -d gestao_casas -f insert.sql

# 7. Conta de teste
echo "7️⃣ Criando conta de teste..."
sudo -u postgres psql -d gestao_casas << SQL
INSERT INTO conta (nome, email, senha, id_casa, ativo, is_admin) 
SELECT 'Teste Local', 'teste@email.com', '123456', id_casa, true, false
FROM casa LIMIT 1
ON CONFLICT (email) DO UPDATE SET senha = '123456';

UPDATE casa SET id_conta = (SELECT id_conta FROM conta WHERE email = 'teste@email.com' LIMIT 1)
WHERE id_conta IS NULL;
SQL

# 8. Verificar
echo ""
echo "✅ Instalação concluída!"
echo ""
echo "📊 Tabelas criadas:"
sudo -u postgres psql -d gestao_casas -c "\dt"
echo ""
echo "👤 Usuário de teste:"
sudo -u postgres psql -d gestao_casas -c "SELECT id_conta, nome, email FROM conta WHERE email = 'teste@email.com';"
echo ""
echo "🔑 Credenciais:"
echo "   Email: teste@email.com"
echo "   Senha: 123456"
