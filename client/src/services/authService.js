import axios from "axios"


const API_URL = "http://localhost:5000/api/v1";


export async function registerUser(userData) {
    const response = await axios.post(`${API_URL}/auth/register`, userData, { withCredentials: true })
    return response.data.data
}

export async function loginUser(credentials) {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, { withCredentials: true })
    return response.data.data;
}

export async function logoutUser() {
    const response = await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true })
    return response.data.data
}

export async function refreshAccessToken() {
    const response = await axios.post(`${API_URL}/auth/refresh`, { withCredentials: true })
    return response.data.data
}