# Pokédex Mobile (Frontend) 📱

Este é o módulo **Front-end** (Mobile) da aplicação Pokédex. Ele foi construído com React Native e Expo para consumir uma API REST externa.

> ⚠️ **Importante**: Este projeto não funciona isoladamente. Você precisa estar rodando o **Back-end** (API) em paralelo para que o Login, Cadastro e Favoritos funcionem.

## ✨ Funcionalidades

- **Autenticação**: Login e Cadastro integrados com a API.
- **Pokédex**: Lista de Pokémon com navegação cíclica (1-151).
- **Busca**: Pesquisa por nome (com fallback visual "Ghost").
- **Favoritos**: Gestão de favoritos persistida no banco de dados.
- **UI/UX**: Design Dark Mode personalizado.

---

## 🚀 Como Rodar o Ecossistema

Para a aplicação funcionar completa, você precisará de dois terminais abertos:

### Terminal 1: O Backend (API)

Navegue até a pasta do seu back-end (separada deste projeto) e inicie o servidor.
Se estiver usando o `json-server-auth` como fizemos no desenvolvimento:

```bash
# Exemplo (ajuste o caminho para onde estiver seu backend)
npx json-server-auth db.json --port 3000 --host 0.0.0.0
```

### Terminal 2: O Mobile (Este Projeto)

1.  Instale as dependências (caso não tenha feito):
    ```bash
    npm install
    ```

2.  Inicie o Expo:
    ```bash
    npx expo start -c
    ```

3.  No seu celular (Expo Go) ou Emulador, o app deverá conectar na API (verifique se o IP em `services/api.js` está correto para sua rede).

---

## 🐙 Enviando para o GitHub

Como você já possui o repositório criado (`pokedex_mobile`), siga os passos abaixo para enviar este código.

### Opção A: Enviando este projeto como a raiz do repositório
*(Use esta opção se o repositório `pokedex_mobile` for exclusivo para o app mobile)*

```bash
# 1. Inicialize o git
git init

# 2. Adicione os arquivos
git add .

# 3. Commit inicial
git commit -m "feat: Project setup and mobile implementation"

# 4. Renomeie a branch para main
git branch -M main

# 5. Adicione a origem (Seu repositório)
git remote add origin https://github.com/gbrunosan/pokedex_mobile.git

# 6. Envie
git push -u origin main
```

### Opção B: Organizando em Pastas (Monorepo)
*(Use esta opção se você quer ter `mobile/` e `backend/` no mesmo repositório)*

1.  Crie uma pasta chamada `mobile` dentro da raiz do seu projeto local.
2.  Mova **todos** os arquivos deste projeto (exceto `.git` se houver) para dentro da pasta `mobile`.
3.  Faça o mesmo com seu backend (coloque em uma pasta `backend`).
4.  Na raiz que contém as duas pastas, inicie o git e faça o push.

---

## 🛠️ Tecnologias

- React Native (Expo)
- Axios
- Async Storage
- Expo Linear Gradient
