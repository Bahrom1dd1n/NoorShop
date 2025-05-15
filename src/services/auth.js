import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Removed /v1 prefix

export const authService = {
    async login(login, password) {
        try {
            const response = await axios.post(`${API_URL}/auth/customer/login`, { // Updated to match backend
                login,
                password
            });
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async register(userData) {
        try {
            // Ensure the data structure matches the database schema
            const registerData = {
                branch_id: userData.branch_id,
                login: userData.login,
                name: userData.name,
                password: userData.password,
                phone: userData.phone
            };
            
            const response = await axios.post(`${API_URL}/user`, registerData); // Updated to match backend
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    logout() {
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    },

    isAuthenticated() {
        const user = this.getCurrentUser();
        return !!user && !!user.token;
    }
}; 