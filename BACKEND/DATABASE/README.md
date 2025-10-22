## 📘 README – Banco de Dados do Projeto

Este projeto utiliza **PostgreSQL** como sistema de gerenciamento de banco de dados. Os scripts de criação das tabelas estão organizados no arquivo `schema.sql`, localizado na pasta `/database`.

---

### 🛠️ Como criar o banco de dados

1. Crie um novo banco de dados exclusivo para este projeto (ex: `gestao_casas`).
2. Abra um editor SQL e carregue o arquivo `schema.sql`.
3. Execute os comandos de criação das tabelas.

---

### ⚠️ Importante: Ordem de criação das tabelas

As tabelas possuem **dependências entre si**, então é essencial seguir a ordem correta de criação para evitar erros:

1. `USUARIO`
2. `CASA`
3. `USUARIO_CASA`
4. `COMODO`
5. `CATEGORIA`
6. `TAREFA`

> 💡 Crie **uma tabela por vez**, como se fosse um "tópico" individual. Isso facilita a identificação de erros e garante que tudo seja criado corretamente.

---

### 🔄 Após criar cada tabela

- Sempre atualize a visualização do banco de dados após criar uma tabela.
- Isso garante que a estrutura esteja visível e pronta para os próximos passos.

---

### ✅ Testando o banco

Você pode usar o arquivo `insert.sql` para inserir dados fictícios e testar se as relações estão funcionando corretamente.
---

Se quiser, posso te ajudar a complementar esse README com instruções para conexão via back-end ou terminal. É só me chamar!
