import axios from 'axios';

const baseURL = process.env.NODE_ENV === "production"
    ? "https://myexpenses.xyz"
    : "https://myexpenses.xyz";

const api = axios.create({
    baseURL,
});

export default api;