xxxx
# 📘 README – Backend do Projeto MessAway

Este repositório contém o backend do projeto **MessAway**, uma aplicação de gestão colaborativa de casas e tarefas. Ele foi desenvolvido com **Spring Boot** e utiliza **PostgreSQL** como sistema de banco de dados relacional.

---

## 🧱 Estrutura do Projeto

```
BACKEND/
├── src/
│   └── main/
│       ├── java/com/messaway/
│       │   ├── controller/       → Controladores REST (ex: CasaController.java)
│       │   ├── model/            → Entidades JPA (ex: Casa.java, Usuario.java)
│       │   └── repository/       → Interfaces de acesso ao banco (ex: CasaRepository.java)
│       └── resources/
│           ├── application.properties → Configurações do banco e da aplicação
│           └── static/                → (opcional) arquivos estáticos
├── pom.xml → Gerenciador de dependências Maven
└── database/
    ├── schema.sql → Script de criação das tabelas
    └── insert.sql → Script de inserção de dados fictícios
```

---

## 🚀 Como rodar o backend

### 1. Pré-requisitos

- Java 17+
- Maven
- PostgreSQL instalado e rodando localmente

### 2. Criar o banco de dados

Abra o terminal ou o pgAdmin e execute:

```sql
CREATE DATABASE gestao_casas;
```

---

### 3. Configurar o acesso ao banco

No arquivo `application.properties`, configure:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gestao_casas
spring.datasource.username=postgres
spring.datasource.password=senha_aqui
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
```

> ⚠️ Altere `senha_aqui` para sua senha real do PostgreSQL.

---

### 4. Criar as tabelas

Execute o script `schema.sql` localizado em `/database`:

```bash
psql -U postgres -d gestao_casas -f database/schema.sql
```

---

### 5. Inserir dados de teste (opcional)

```bash
psql -U postgres -d gestao_casas -f database/insert.sql
```

---

### 6. Rodar o backend

Na raiz do projeto:

```bash
./mvnw spring-boot:run
```

Ou, se estiver usando Maven instalado:

```bash
mvn spring-boot:run
```

---

## 🔗 Endpoints principais

### 🏠 Casas

- `GET /MessAway/casas` → Lista todas as casas
- `POST /MessAway/casas` → Cria uma nova casa
- `DELETE /MessAway/casas/{id}` → Remove uma casa

### 👤 Usuários

- `GET /MessAway/usuarios` → Lista todos os usuários
- `POST /MessAway/usuarios` → Cria um novo usuário

### 🧹 Tarefas

- `GET /MessAway/tarefas` → Lista todas as tarefas
- `POST /MessAway/tarefas` → Cria uma nova tarefa
- `DELETE /MessAway/tarefas/{id}` → Remove uma tarefa

> Os endpoints podem variar conforme os controladores implementados. Verifique os arquivos em `controller/` para detalhes.

---

## 🧠 Organização das entidades

### `USUARIO`
- `id_usuario`, `nome`, `email`, `senha`, `ativo`

### `CASA`
- `id_casa`, `nome`, `descricao`, `endereco`, `ativo`

### `USUARIO_CASA`
- Relaciona usuários com casas e define permissões

### `COMODO`
- Cômodos dentro de uma casa (ex: cozinha, sala)

### `CATEGORIA`
- Classificação de tarefas (ex: limpeza, manutenção)

### `TAREFA`
- Tarefa atribuída a um usuário em um cômodo específico

---

## 🛡️ Segurança e boas práticas

- Senhas devem ser armazenadas com hash (ex: BCrypt)
- Use DTOs para proteger dados sensíveis
- Valide entradas com `@Valid` e `@NotNull`
- Configure CORS para permitir acesso do frontend

---