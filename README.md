
## Daily Diet API - Node.JS

Este projeto Node.js oferece funcionalidades para gerenciar refeições de usuários, incluindo a criação de tabelas para usuários e refeições.

Os usuários podem criar, editar e apagar refeições, especificando nome, descrição, data, hora e se estão dentro da dieta.

Métricas como total de refeições, quantidade dentro e fora da dieta, melhor sequência de refeições dentro da dieta e restrições para visualização, edição e exclusão são implementadas.

### Dependências
-   **@fastify/cookie**: ^8.3.0
-   **dotenv**: ^16.3.1
-   **fastify**: ^4.20.0
-   **knex**: ^2.5.1
-   **sqlite3**: ^5.1.6
-   **zod**: ^3.22.2

### Dependências de Desenvolvimento
-   **@rocketseat/eslint-config**: ^2.1.0
-   **@types/node**: ^20.6.1
-   **eslint**: ^8.49.0
-   **tsx**: ^3.12.10
-   **typescript**: ^5.2.2

Este projeto utiliza o Fastify como framework, Knex para manipulação do banco de dados, e Zod para validação de dados. O ambiente de desenvolvimento é configurado com TypeScript e ESLint seguindo as diretrizes do @rocketseat/eslint-config.

### Instalação
`npm install`

### Para rodar o projeto
`npm run dev`
