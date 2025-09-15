import { supabase } from './supabase';
import { Product, Category, SaleTransaction, User, UserRole } from '../types';

// User operations
export const userService = {
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async createUser(userData: { name: string; email: string; role: UserRole }) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// Category operations
export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(category: { name: string }) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: { name: string }) {
    const { data, error } = await supabase
      .from('categories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Product operations
export const productService = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .order('name');
    if (error) throw error;
    return data.map(item => ({
      id: item.id,
      name: item.name,
      category: item.categories.name,
      category_id: item.category_id,
      price: item.price,
      stock: item.stock,
      description: item.description,
      image_url: item.image_url
    }));
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      category: data.categories.name,
      category_id: data.category_id,
      price: data.price,
      stock: data.stock,
      description: data.description,
      image_url: data.image_url
    };
  },

  async create(product: {
    name: string;
    category_id: string;
    price: number;
    stock: number;
    description?: string;
    image_url?: string;
  }) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .single();
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      category: data.categories.name,
      category_id: data.category_id,
      price: data.price,
      stock: data.stock,
      description: data.description,
      image_url: data.image_url
    };
  },

  async update(id: string, updates: {
    name?: string;
    category_id?: string;
    price?: number;
    stock?: number;
    description?: string;
    image_url?: string;
  }) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .single();
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      category: data.categories.name,
      category_id: data.category_id,
      price: data.price,
      stock: data.stock,
      description: data.description,
      image_url: data.image_url
    };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async updateStock(id: string, newStock: number) {
    const { error } = await supabase
      .from('products')
      .update({ 
        stock: newStock, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);
    if (error) throw error;
  }
};

// Transaction operations
export const transactionService = {
  async getAll() {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        users (
          id,
          name
        ),
        transaction_items (
          id,
          quantity,
          unit_price,
          products (
            id,
            name
          )
        )
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(transaction => ({
      id: transaction.id,
      timestamp: transaction.timestamp,
      totalAmount: transaction.total_amount,
      cashierId: transaction.cashier_id,
      cashierName: transaction.users.name,
      paymentMethod: transaction.payment_method,
      items: transaction.transaction_items.map(item => ({
        productId: item.products.id,
        productName: item.products.name,
        quantity: item.quantity,
        unitPrice: item.unit_price
      }))
    }));
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        users (
          id,
          name
        ),
        transaction_items (
          id,
          quantity,
          unit_price,
          products (
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return {
      id: data.id,
      timestamp: data.timestamp,
      totalAmount: data.total_amount,
      cashierId: data.cashier_id,
      cashierName: data.users.name,
      paymentMethod: data.payment_method,
      items: data.transaction_items.map(item => ({
        productId: item.products.id,
        productName: item.products.name,
        quantity: item.quantity,
        unitPrice: item.unit_price
      }))
    };
  },

  async create(transactionData: {
    total_amount: number;
    cashier_id: string;
    payment_method: 'CASH' | 'CARD' | 'DIGITAL';
    items: Array<{
      product_id: string;
      quantity: number;
      unit_price: number;
    }>;
  }) {
    // Start a transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([{
        total_amount: transactionData.total_amount,
        cashier_id: transactionData.cashier_id,
        payment_method: transactionData.payment_method,
        timestamp: new Date().toISOString()
      }])
      .select()
      .single();

    if (transactionError) throw transactionError;

    // Insert transaction items
    const transactionItems = transactionData.items.map(item => ({
      transaction_id: transaction.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price
    }));

    const { error: itemsError } = await supabase
      .from('transaction_items')
      .insert(transactionItems);

    if (itemsError) throw itemsError;

    // Update product stock
    for (const item of transactionData.items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();

      if (product) {
        await supabase
          .from('products')
          .update({ 
            stock: product.stock - item.quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.product_id);
      }
    }

    return transaction;
  },

  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        users (
          id,
          name
        ),
        transaction_items (
          id,
          quantity,
          unit_price,
          products (
            id,
            name
          )
        )
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(transaction => ({
      id: transaction.id,
      timestamp: transaction.timestamp,
      totalAmount: transaction.total_amount,
      cashierId: transaction.cashier_id,
      cashierName: transaction.users.name,
      paymentMethod: transaction.payment_method,
      items: transaction.transaction_items.map(item => ({
        productId: item.products.id,
        productName: item.products.name,
        quantity: item.quantity,
        unitPrice: item.unit_price
      }))
    }));
  }
};
