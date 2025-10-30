# 🗄️ Setup do Banco de Dados - MessAway

## Pré-requisitos

- PostgreSQL 12+ instalado
- Usuário `postgres` com permissões de superusuário

---

## 🚀 Instalação Completa (Um Comando)

### Linux/macOS:
```bash
sudo -u postgres psql -f BACKEND/DATABASE/setup_complete.sql
```

### Windows (CMD como Administrador):
```cmd
psql -U postgres -f BACKEND\DATABASE\setup_complete.sql
```

---

## 📝 Instalação Passo a Passo (Opcional)

Se preferir executar manualmente:

### 1. Criar usuário e banco
```bash
sudo -u postgres psql << EOF
CREATE USER messaway WITH PASSWORD 'messaway123' SUPERUSER;
CREATE DATABASE gestao_casas OWNER messaway;
\q
EOF
```

### 2. Executar schema
```bash
sudo -u postgres psql -d gestao_casas -f BACKEND/DATABASE/schema.sql
```

### 3. Executar migrations
```bash
sudo -u postgres psql -d gestao_casas -f BACKEND/DATABASE/migrations/2025-10-23_multi_casas_admin.sql
sudo -u postgres psql -d gestao_casas -f BACKEND/DATABASE/migrations/2025-10-23_add_points_and_achievements.sql
sudo -u postgres psql -d gestao_casas -f BACKEND/DATABASE/migrations/2025-10-23_create_casa_achievements.sql
sudo -u postgres psql -d gestao_casas -f BACKEND/DATABASE/migrations/2025-10-23_add_task_user_to_points_log.sql
sudo -u postgres psql -d gestao_casas -f BACKEND/DATABASE/migrations/2025-10-23_gastos_por_usuario.sql
```

### 4. Inserir dados de teste
```bash
sudo -u postgres psql -d gestao_casas -f BACKEND/DATABASE/insert.sql
```

### 5. Dar permissões
```bash
sudo -u postgres psql -d gestao_casas << EOF
GRANT ALL PRIVILEGES ON DATABASE gestao_casas TO messaway;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO messaway;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO messaway;
EOF
```

---

## ✅ Verificar Instalação
```bash
sudo -u postgres psql -d gestao_casas -c "\dt"
sudo -u postgres psql -d gestao_casas -c "SELECT * FROM conta;"
```

---

## 🔑 Credenciais Padrão

**Banco de Dados:**
- Host: `localhost`
- Porta: `5432`
- Banco: `gestao_casas`
- Usuário: `messaway`
- Senha: `messaway123`

**Login da Aplicação:**
- Email: `teste@email.com`
- Senha: `123456`

---

## 🔧 Troubleshooting

### Erro: "permission denied for table"
```bash
sudo -u postgres psql -d gestao_casas << EOF
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO messaway;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO messaway;
EOF
```

### Erro: "column does not exist"

Execute novamente as migrations ou o `setup_complete.sql`.

### Erro: "peer authentication failed"

Edite `/etc/postgresql/*/main/pg_hba.conf`:
```
# Trocar "peer" por "md5"
local   all   all   md5
host    all   all   127.0.0.1/32   md5
```

Depois reinicie: `sudo systemctl restart postgresql`

---

## 🗑️ Resetar Banco (Cuidado!)

Para começar do zero:
```bash
sudo -u postgres psql << EOF
DROP DATABASE IF EXISTS gestao_casas;
DROP USER IF EXISTS messaway CASCADE;
\q
EOF

# Depois executar setup_complete.sql novamente
sudo -u postgres psql -f BACKEND/DATABASE/setup_complete.sql
```