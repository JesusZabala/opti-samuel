import api from "../api/axiosConfig";
// import { LoginCredentials } from "../types/auth";

export const authService = {
    login: async (username: string ,password: string) => {
        // const {username, password} = credentials;
        const response = await api.post('auth/login/', {username, password});

        if(response.data.access){
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('refresh', response.data.refresh_token)
            localStorage.setItem('role', response.data.rol)
            localStorage.setItem('username', response.data.user)

        }

        return response.data
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
    }
}