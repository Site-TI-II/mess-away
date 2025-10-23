-- 1. USUARIO

CREATE TABLE USUARIO (

    id_usuario SERIAL PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    senha VARCHAR(100) NOT NULL,

    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    ativo BOOLEAN DEFAULT TRUE

);

-- 2. CASA

CREATE TABLE CASA (

    id_casa SERIAL PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,

    descricao TEXT,

    endereco VARCHAR(200),

    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    ativo BOOLEAN DEFAULT TRUE

);




-- 3. USUARIO_CASA

CREATE TABLE USUARIO_CASA (

    id_usuario_casa SERIAL PRIMARY KEY,

    id_usuario INT NOT NULL,

    id_casa INT NOT NULL,

    permissao VARCHAR(50),

    data_associacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),

    FOREIGN KEY (id_casa) REFERENCES CASA(id_casa)

);




-- 4. COMODO

CREATE TABLE COMODO (

    id_comodo SERIAL PRIMARY KEY,

    id_casa INT NOT NULL,

    nome VARCHAR(100) NOT NULL,

    descricao TEXT,

    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    ativo BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (id_casa) REFERENCES CASA(id_casa)

);




-- 5. CATEGORIA

CREATE TABLE CATEGORIA (

    id_categoria SERIAL PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,

    descricao TEXT

);




-- 6. TAREFA

CREATE TABLE TAREFA (

    id_tarefa SERIAL PRIMARY KEY,

    id_comodo INT NOT NULL,

    id_usuario INT NOT NULL,

    id_categoria INT NOT NULL,

    nome VARCHAR(100) NOT NULL,

    descricao TEXT,

    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    data_estimada TIMESTAMP,

    frequencia INT,

    ativo BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (id_comodo) REFERENCES COMODO(id_comodo),

    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),

    FOREIGN KEY (id_categoria) REFERENCES CATEGORIA(id_categoria)

);

-- 7. ACHIEVEMENT (Conquistas)

CREATE TABLE ACHIEVEMENT (
    id_achievement SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    description TEXT NOT NULL,
    requirement_type VARCHAR(50) NOT NULL,
    requirement_value INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. USUARIO_ACHIEVEMENT (Conquistas do usuário)

CREATE TABLE USUARIO_ACHIEVEMENT (
    id_usuario_achievement SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_achievement INT NOT NULL,
    data_obtencao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    FOREIGN KEY (id_achievement) REFERENCES ACHIEVEMENT(id_achievement)
);

-- 9. INSIGHT (Insights inteligentes)

CREATE TABLE INSIGHT (
    id_insight SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    color VARCHAR(20) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. GASTO (Expenses)
CREATE TABLE GASTO (
    id_gasto SERIAL PRIMARY KEY,
    id_casa INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_casa) REFERENCES CASA(id_casa)
);

-- 11. META_GASTO (Expense Goals)
CREATE TABLE META_GASTO (
    id_meta_gasto SERIAL PRIMARY KEY,
    id_casa INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_casa) REFERENCES CASA(id_casa)
);
-- 12. CONTA (Account) and CONTA_USUARIO (Account -> Usuario mapping)
--
-- The previous "copilot" layout used many repeated columns (mor1..mor7, cor1..cor7).
-- Normalize into a single `CONTA` table and a join table `CONTA_USUARIO` that
-- links one account to many usuarios and stores per-user metadata such as color.

-- If an old `public.conta` table exists, drop it first (commented for safety).
-- DROP TABLE IF EXISTS public.conta;

CREATE TABLE CONTA (
    id_conta SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(200) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_casa INT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_casa) REFERENCES CASA(id_casa)
);

-- Mapping table: one account can have many users (moradores).
-- Stores per-user display name (apelido), color and role/permissao.
CREATE TABLE CONTA_USUARIO (
    id_conta_usuario SERIAL PRIMARY KEY,
    id_conta INT NOT NULL REFERENCES CONTA(id_conta) ON DELETE CASCADE,
    id_usuario INT NOT NULL REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    apelido VARCHAR(100),
    cor VARCHAR(50),
    permissao VARCHAR(50),
    data_associacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_conta, id_usuario)
);

-- Optional: if you need to migrate existing data from an old `public.conta` table,
-- you can use SQL similar to the snippet below (adjust types and column names):
-- BEGIN;
-- INSERT INTO CONTA (nome, email, senha, data_cadastro, id_casa)
-- SELECT nome, email, senha, datacadastro::timestamp, NULL::int
-- FROM public.conta;
-- -- Then insert associated usuarios into CONTA_USUARIO mapping using mor1..mor7
-- COMMIT;
