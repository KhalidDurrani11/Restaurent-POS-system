
export enum UserRole {
  Admin = 'ADMIN',
  Cashier = 'CASHIER',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SaleTransaction {
  id: string;
  timestamp: string;
  totalAmount: number;
  cashierId: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
}
