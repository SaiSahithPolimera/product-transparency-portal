export interface Product {
  id: number;
  name: string;
  category: string;
  company: string;
  description?: string;
  created_at: string;
}

export interface Question {
  id: number;
  text: string;
  type: 'text' | 'select' | 'checkbox' | 'number' | 'textarea' | 'date';
  condition?: any;
  options?: string[];
}

export interface Answer {
  id: number;
  product_id: number;
  question_id: number;
  value: string;
  question_text: string;
  question_type: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  company: string;
  description?: string;
  answers: {
    question_id: number;
    value: string;
  }[];
}

export interface ProductWithAnswers {
  product: Product;
  answers: Answer[];
}

export interface ProductListItem extends Product {
  user_email?: string;
  user_company?: string;
  answer_count: number;
}

export interface ProductsResponse {
  products: ProductListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}