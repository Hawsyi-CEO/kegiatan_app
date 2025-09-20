import axios from 'axios';

const api = axios.create({
  // URL API menggunakan path relatif yang akan ditangani proxy
  baseURL: '/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export default api;