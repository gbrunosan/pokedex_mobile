import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Endereço IP local - tem que ser o mesmo da sua máquina
const API_URL = 'http://10.152.43.46:3000';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para adicionar o token aos headers
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
