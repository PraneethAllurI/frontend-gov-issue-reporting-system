import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/', 
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
  }
});

export default api;