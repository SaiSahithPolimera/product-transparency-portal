import axios from 'axios';
import type { ProductFormData, Question, ProductWithAnswers } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  post: api.post.bind(api),
  get: api.get.bind(api),
  defaults: api.defaults,

  submitProduct: async (data: ProductFormData) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  getProduct: async (id: string): Promise<ProductWithAnswers> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getQuestions: async (category?: string): Promise<Question[]> => {
    const response = await api.get('/products/questions', {
      params: category ? { category } : {},
    });
    return response.data;
  },

  generatePDF: async (id: string) => {
    const response = await api.post(`/report/${id}/pdf`, {}, {
      responseType: 'blob',
    });
    return response.data;
  },

  getAllProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    company?: string;
  }) => {
    const response = await api.get('/products/all', { params });
    return response.data;
  },
};

export default api;