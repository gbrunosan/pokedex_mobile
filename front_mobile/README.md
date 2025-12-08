# Pokédex Mobile (Frontend) 📱

Este é o módulo **Front-end** (Mobile) da aplicação Pokédex. Ele foi construído com React Native e Expo para consumir uma API REST externa.

## 🛠️ Tecnologias

- React Native (Expo)
- Axios
- Async Storage
- Expo Linear Gradient

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
Leia o README do backend para mais informações.


### Terminal 2: O Mobile (Este Projeto)

1.  Instale as dependências (cd front_mobile):
    ```bash
    npm install
    ```

2.  Inicie o Expo:
    ```bash
    npx expo start -c
    ```

3.  No seu celular (Expo Go) ou Emulador, o app deverá conectar na API (verifique se o IP em `services/api.js` está correto para sua rede).

