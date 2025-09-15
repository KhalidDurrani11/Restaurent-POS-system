
export enum UserRole {
  Admin = 'ADMIN',
  Cashier = 'CASHIER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  category_id?: string;
  price: number;
  stock: number;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SaleTransaction {
  id: string;
  timestamp: string;
  totalAmount: number;
  cashierId: string;
  cashierName?: string;
  paymentMethod?: 'CASH' | 'CARD' | 'DIGITAL';
  items: { 
    productId: string; 
    productName?: string;
    quantity: number; 
    unitPrice: number;
  }[];
  created_at?: string;
  updated_at?: string;
}
