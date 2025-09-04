
import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Beverages' },
  { id: 'cat2', name: 'Fast Food' },
  { id: 'cat3', name: 'Snacks' },
  { id: 'cat4', name: 'Grocery' },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'prod1', name: 'Cola', category: 'Beverages', price: 1.50, stock: 150 },
  { id: 'prod2', name: 'Burger', category: 'Fast Food', price: 5.00, stock: 80 },
  { id: 'prod3', name: 'Fries', category: 'Fast Food', price: 2.50, stock: 120 },
  { id: 'prod4', name: 'Potato Chips', category: 'Snacks', price: 1.20, stock: 200 },
  { id: 'prod5', name: 'Milk 1L', category: 'Grocery', price: 2.00, stock: 50 },
  { id: 'prod6', name: 'Bread', category: 'Grocery', price: 2.20, stock: 60 },
  { id: 'prod7', name: 'Orange Juice', category: 'Beverages', price: 3.00, stock: 75 },
  { id: 'prod8', name: 'Chicken Sandwich', category: 'Fast Food', price: 6.50, stock: 40 },
  { id: 'prod9', name: 'Chocolate Bar', category: 'Snacks', price: 1.80, stock: 300 },
  { id: 'prod10', name: 'Water Bottle', category: 'Beverages', price: 1.00, stock: 5 },
];
