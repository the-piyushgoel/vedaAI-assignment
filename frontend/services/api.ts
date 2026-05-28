import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://vedaai-backend-sd5n.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
