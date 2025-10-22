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
