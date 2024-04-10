import axios from "axios";

// import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
