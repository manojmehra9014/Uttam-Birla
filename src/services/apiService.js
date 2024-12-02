import axios from 'axios';


// Create an Axios instance
const apiClient = axios.create({
    baseURL: 'http://3.95.211.195:3000',
    timeout: 5000, // Set a timeout of 5 seconds (optional)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Example of a GET request
export const fetchData = async (endpoint) => {
    try {
        const response = await apiClient.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
    }
};

// Example of a POST request
export const postData = async (endpoint, payload) => {
    try {
        console.log('Request URL:', apiClient.defaults.baseURL + endpoint);
        console.log('Payload:', JSON.stringify(payload));

        const response = await apiClient.post(endpoint, payload);

        console.log('Response:', response);
        return response.data;
    } catch (error) {
        if (error) {
            console.error('Error Response:', error);
        }
        throw error;
    }
};
