import axios from 'axios';

export const BASE_URL = 'http://localhost:8000';
// export const BASE_URL = 'http://192.168.100.22:8000';
export default axios.create({
    baseURL: BASE_URL,

    withCredentials: true,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
