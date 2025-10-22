-- Esse arquivo tem todos os inserts para você conseguir testar se seu banco de dados está registrando as informações direitinho! ^^
-- 🧑‍💻 Inserindo usuários
INSERT INTO USUARIO (nome, email, senha)
VALUES 
('Leo', 'leo@email.com', 'senha123'),
('Minion', 'banana@email.com', 'banana');

--🏠 Inserindo casas
INSERT INTO CASA (nome, descricao, endereco)
VALUES 
('Casa da Daniela', 'Casa com jardim e garagem', 'Rua das Flores, 123'),
('Apartamento do Minion', 'Apartamento no centro', 'Av. Central, 456');

--👥 Associando usuários às casas
INSERT INTO USUARIO_CASA (id_usuario, id_casa, permissao)
VALUES 
(1, 1, 'admin'),
(2, 2, 'morador');

--🚪 Inserindo cômodos
INSERT INTO COMODO (id_casa, nome, descricao)
VALUES 
(1, 'Sala', 'Sala de estar com sofá e TV'),
(1, 'Cozinha', 'Cozinha com armários planejados'),
(2, 'Quarto', 'Quarto com cama de casal');

-- 🗂️ Inserindo categorias
INSERT INTO CATEGORIA (nome, descricao)
VALUES 
('Limpeza', 'Tarefas de limpeza'),
('Organização', 'Arrumar e organizar espaços');

--✅ Inserindo tarefas
INSERT INTO TAREFA (id_comodo, id_usuario, id_categoria, nome, descricao, data_estimada, frequencia)
VALUES 
(1, 1, 1, 'Limpar sala', 'Passar pano e tirar pó', '2025-09-26 10:00:00', 7),
(2, 1, 2, 'Organizar cozinha', 'Arrumar armários e limpar bancadas', '2025-09-27 15:00:00', 14),
(3, 2, 1, 'Limpar quarto', 'Trocar lençóis e varrer', '2025-09-28 09:00:00', 7);

--Esses comandos vão preencher suas tabelas com dados de teste. Se quiser ver os resultados, basta rodar:
SELECT * FROM USUARIO;
SELECT * FROM CASA;
SELECT * FROM TAREFA;
