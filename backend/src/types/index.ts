export interface Product {
  id: number;
  name: string;
  category: string;
  company: string;
  description?: string;
  user_id?: number;
  created_at: Date;
}

export interface Question {
  id: number;
  text: string;
  type: 'text' | 'select' | 'checkbox' | 'number' | 'textarea' | 'date';
  condition?: any;
  options?: string[];
  created_at: Date;
}

export interface Answer {
  id: number;
  product_id: number;
  question_id: number;
  value: string;
  created_at: Date;
}

export interface Report {
  id: number;
  product_id: number;
  pdf_url?: string;
  created_at: Date;
}

export interface User {
  id: number;
  email: string;
  password: string;
  company?: string;
  created_at: Date;
}

export interface ProductSubmission {
  name: string;
  category: string;
  company: string;
  description?: string;
  answers: {
    question_id: number;
    value: string;
  }[];
}