import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-govt-issue-reporting-system.vercel.app/', 
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
  }
});

export default api;