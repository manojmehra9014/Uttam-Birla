import axios from 'axios';
import utils from './utils';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();

const apiClient = axios.create({
    baseURL: 'https://api.uttambirla.com/',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchData = async (endpoint) => {
    try {
        const response = await apiClient.get(endpoint);
        return response.data;
    } catch (error) {
        if (error.response) {
            const { data, status } = error.response;
            console.error('Error Response:', data);
            console.error('Status Code:', status);
            Alert.alert(t("Info"), data.error);
        } else {
            console.error('Error:', error.message);
        }
    }
};

export const postData = async (endpoint, payload) => {
    try {
        console.log('Request URL:', apiClient.defaults.baseURL + endpoint);
        console.log('Payload:', JSON.stringify(payload));

        const response = await apiClient.post(endpoint, payload);

        console.log('Response:', response);
        return response;
    } catch (error) {
        if (error) {
            console.error('Error Response:', error);
        }
        throw error;
    }
};

export const getData = async (endpoint, payload = {}) => {
    try {
        console.log('Request URL:', apiClient.defaults.baseURL + endpoint);
        console.log('Payload:', JSON.stringify(payload));
        const response = await apiClient.get(endpoint, payload);
        return response;
    } catch (error) {
        if (error) {
            console.error('Error Response:', error);
        }
        throw error;
    }
};

apiClient.interceptors.request.use(
    async (config) => {
        const token = utils.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);