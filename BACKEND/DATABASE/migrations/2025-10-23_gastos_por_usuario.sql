-- Create user-scoped expenses and goals tables
-- GASTO_USUARIO: expenses per USUARIO (logged-in user)
CREATE TABLE IF NOT EXISTS GASTO_USUARIO (
    id_gasto_usuario SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gasto_usuario_user ON GASTO_USUARIO(id_usuario);
CREATE INDEX IF NOT EXISTS idx_gasto_usuario_created ON GASTO_USUARIO(data_criacao DESC);

-- META_GASTO_USUARIO: monthly goal per user (only one active at a time)
CREATE TABLE IF NOT EXISTS META_GASTO_USUARIO (
    id_meta_gasto_usuario SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    valor DECIMAL(10,2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_meta_gasto_usuario_user ON META_GASTO_USUARIO(id_usuario);
CREATE INDEX IF NOT EXISTS idx_meta_gasto_usuario_active ON META_GASTO_USUARIO(id_usuario, ativo);
