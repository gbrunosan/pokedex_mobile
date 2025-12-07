# Pokedex API

API Node.js desenvolvida para servir o aplicativo Pokedex Mobile.
Utiliza **Express**, **Drizzle ORM**, **SQLite** e **JWT** para autenticação.

## 🚀 Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [SQLite](https://www.sqlite.org/index.html)
- [JWT (JSON Web Token)](https://jwt.io/)

## 🛠️ Instalação e Execução

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
npm run dev
```
O servidor rodará em `http://localhost:3000`.

---

## 📡 Endpoints da API

### Autenticação

#### `POST /auth/register`
Cria um novo usuário.
- **Body:** `{ "email": "teste@email.com", "password": "123" }`

#### `POST /auth/login`
Faz login e retorna o Token de acesso.
- **Body:** `{ "email": "teste@email.com", "password": "123" }`
- **Response:** `{ "user": {...}, "token": "seu_token_jwt" }`

### Pokémons
⚠️ **Atenção:** Todas as rotas abaixo precisam do Header `Authorization: Bearer SEU_TOKEN`.

#### `GET /pokemon`
Lista todos os 151 Pokémons.
- **Response:** Lista de objetos contendo `id`, `nome`, `sprite`, `numPokedex` e `isFavorite`.

#### `GET /pokemon/:id`
Busca um Pokémon pelo ID (ex: 1).
- **Response:** Objeto do Pokémon.

#### `GET /pokemon/name/:nome`
Busca um Pokémon pelo nome (ex: "Bulbasaur" ou "pikachu"). A busca é case-insensitive.

### Favoritos

#### `GET /pokemon/favorites`
Lista todos os pokémons favoritados pelo usuário logado.

#### `POST /pokemon/favorite`
Adiciona ou Remove um favorito (Toggle).
- **Body:** `{ "pokemonId": 1 }`

---

## 🗄️ Visualizar o Banco de Dados
Para ver as tabelas e dados visualmente:
```bash
npx drizzle-kit studio
```
Acesse `https://local.drizzle.studio`.
