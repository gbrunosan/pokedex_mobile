# Pokedex API

API Node.js desenvolvida para servir o aplicativo Pokedex Mobile.
Utiliza **Express**, **Drizzle ORM**, **SQLite** e **JWT** para autenticação.

## Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [SQLite](https://www.sqlite.org/index.html)
- [JWT (JSON Web Token)](https://jwt.io/)

## Instalação e Execução

### 1. Clonar ou Baixar
Se baixou o zip, extraia a pasta.

### 2. Instalar Dependências
No terminal, dentro da pasta do projeto, rode:
```bash
npm install
```

### 3. Configurar Banco de Dados
O comando abaixo cria o arquivo `sqlite.db` e aplica a estrutura das tabelas:
```bash
npx drizzle-kit push
```

### 4. Popular o Banco (Seed)
Para adicionar os 151 Pokémons iniciais no banco:
```bash
npx tsx src/db/seed.ts
```

### 5. Rodar o Servidor
```bash
npx tsx src/server.ts
```
O servidor rodará em `http://localhost:3000`.


## 🗄️ Visualizar o Banco de Dados
Para ver as tabelas e dados visualmente:
```bash
npx drizzle-kit studio
```
Acesse `https://local.drizzle.studio`.
