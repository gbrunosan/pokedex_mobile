import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Local IP address - must match your machine's IP
const API_URL = 'http://192.168.69.73:3000';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor pare adicionar o token aos headers
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('user_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export const login = async (email, password) => {
    return api.post('/auth/login', { email, password });
};

export const register = async (email, password) => {
    return api.post('/auth/register', { email, password });
};

export const getPokemon = async () => {
    return api.get('/pokemon');
};

export const getPokemonById = async (id) => {
    return api.get(`/pokemon/${id}`);
};

export const getFavorites = async () => {
    return api.get('/pokemon/favorites');
};

export const toggleFavorite = async (pokemonId) => {
    return api.post('/pokemon/favorite', { pokemonId });
};

export const getPokemonByName = async (name) => {
    return api.get(`/pokemon/name/${name}`);
};

export default api;
