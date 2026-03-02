import { supabase } from './supabase';
import { Product, Category, SaleTransaction, User, UserRole } from '../types';

type SupabaseErrorLike = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
};

function toFriendlySupabaseError(action: string, error: unknown): Error {
  const e = error as SupabaseErrorLike | null | undefined;
  const code = e?.code ? ` (code: ${e.code})` : '';
  const details = e?.details ? `\n${e.details}` : '';
  const hint = e?.hint ? `\nHint: ${e.hint}` : '';

  if (e?.code === '42P01') {
    return new Error(
      `${action} failed because a required table/view is missing in Supabase.${code}\n` +
        `Did you run \`database/schema.sql\` (or \`database/quick-setup.sql\`) in the Supabase SQL editor?${details}${hint}`
    );
  }

  if (e?.code === '42501') {
    return new Error(
      `${action} failed due to permissions / Row Level Security.${code}\n` +
        `Make sure you're logged in (not demo-mode) and your RLS policies allow the operation.${details}${hint}`
    );
  }

  if (typeof e?.message === 'string' && e.message.trim()) {
    return new Error(`${action} failed: ${e.message}${code}${details}${hint}`);
  }

  return new Error(`${action} failed.${code}`);
}

// User operations
export const userService = {
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw toFriendlySupabaseError('Get current user', error);
    return user;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw toFriendlySupabaseError('Sign in', error);
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw toFriendlySupabaseError('Sign out', error);
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw toFriendlySupabaseError('Get user profile', error);
    if (!data) throw new Error('User profile not found in `users` table.');
    return data;
  },

  async createUser(userData: { name: string; email: string; role: UserRole }) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    if (error) throw toFriendlySupabaseError('Create user', error);
    return data;
  },

  async ensureUserProfile(authUser: { id: string; email?: string | null }) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error) throw toFriendlySupabaseError('Fetch user profile', error);
    if (data) return data;

    const email = (authUser.email?.trim() || '').toLowerCase();
    const role: UserRole =
      email === 'admin@gmail.com' ? ('ADMIN' as UserRole) : ('CASHIER' as UserRole);

    const name =
      email === 'admin@gmail.com'
        ? 'Admin'
        : email === 'cashier@gmail.com'
          ? 'Cashier'
          : email && email.includes('@')
            ? email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\s+/g, ' ').trim()
            : 'User';

    const { data: created, error: createError } = await supabase
      .from('users')
      .insert([
        {
          id: authUser.id,
          name,
          email,
          role,
        },
      ])
      .select('*')
      .single();

    if (createError) throw toFriendlySupabaseError('Create user profile', createError);
    return created;
  },
};

// Category operations
export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw toFriendlySupabaseError('Fetch categories', error);
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw toFriendlySupabaseError('Fetch category', error);
    return data;
  },

  async create(category: { name: string }) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    if (error) throw toFriendlySupabaseError('Create category', error);
    return data;
  },

  async update(id: string, updates: { name: string }) {
    const { data, error } = await supabase
      .from('categories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw toFriendlySupabaseError('Update category', error);
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw toFriendlySupabaseError('Delete category', error);
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
    if (error) throw toFriendlySupabaseError('Fetch products', error);
    return data.map(item => ({
      id: item.id,
      name: item.name,
      category: item.categories?.name ?? '',
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
    if (error) throw toFriendlySupabaseError('Fetch product', error);
    return {
      id: data.id,
      name: data.name,
      category: data.categories?.name ?? '',
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
    if (error) throw toFriendlySupabaseError('Create product', error);
    return {
      id: data.id,
      name: data.name,
      category: data.categories?.name ?? '',
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
    if (error) throw toFriendlySupabaseError('Update product', error);
    return {
      id: data.id,
      name: data.name,
      category: data.categories?.name ?? '',
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
    if (error) throw toFriendlySupabaseError('Delete product', error);
  },

  async updateStock(id: string, newStock: number) {
    const { error } = await supabase
      .from('products')
      .update({ 
        stock: newStock, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);
    if (error) throw toFriendlySupabaseError('Update stock', error);
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
    if (error) throw toFriendlySupabaseError('Fetch transactions', error);
    return data.map(transaction => ({
      id: transaction.id,
      timestamp: transaction.timestamp,
      totalAmount: transaction.total_amount,
      cashierId: transaction.cashier_id,
      cashierName: transaction.users?.name ?? 'Unknown',
      paymentMethod: transaction.payment_method,
      items: (transaction.transaction_items ?? []).map(item => ({
        productId: item.products?.id ?? '',
        productName: item.products?.name ?? 'Deleted product',
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
    if (error) throw toFriendlySupabaseError('Fetch transaction', error);
    return {
      id: data.id,
      timestamp: data.timestamp,
      totalAmount: data.total_amount,
      cashierId: data.cashier_id,
      cashierName: data.users?.name ?? 'Unknown',
      paymentMethod: data.payment_method,
      items: (data.transaction_items ?? []).map(item => ({
        productId: item.products?.id ?? '',
        productName: item.products?.name ?? 'Deleted product',
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

    if (transactionError) throw toFriendlySupabaseError('Create transaction', transactionError);

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

    if (itemsError) throw toFriendlySupabaseError('Create transaction items', itemsError);

    // Update product stock
    for (const item of transactionData.items) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();

      if (productError) throw toFriendlySupabaseError('Fetch product stock', productError);

      if (product) {
        const { error: stockError } = await supabase
          .from('products')
          .update({ 
            stock: product.stock - item.quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.product_id);

        if (stockError) throw toFriendlySupabaseError('Update product stock', stockError);
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
    if (error) throw toFriendlySupabaseError('Fetch transactions (date range)', error);
    return data.map(transaction => ({
      id: transaction.id,
      timestamp: transaction.timestamp,
      totalAmount: transaction.total_amount,
      cashierId: transaction.cashier_id,
      cashierName: transaction.users?.name ?? 'Unknown',
      paymentMethod: transaction.payment_method,
      items: (transaction.transaction_items ?? []).map(item => ({
        productId: item.products?.id ?? '',
        productName: item.products?.name ?? 'Deleted product',
        quantity: item.quantity,
        unitPrice: item.unit_price
      }))
    }));
  }
};

