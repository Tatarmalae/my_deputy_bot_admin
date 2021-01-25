import axios from 'axios';

let token = null;

let config = {
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
};

const httpClient = axios.create(config);

const authInterceptor = (config) => {
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

httpClient.interceptors.request.use(authInterceptor);

const errorInterceptor = (error) => {
    return Promise.reject(error.response.data.message);
};

const responseInterceptor = (response) => {
    if (response.data.token) {
        token = response.data.token;
    }
    return response.data;
};

httpClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export default httpClient;
