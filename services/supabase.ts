import { createClient } from '@supabase/supabase-js';

// Supabase configuration - using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zbdqsuyplfklhqydkovo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'sb_publishable_geKbz_UpSYKTZPpLVkK9nQ_ed3ReW0l';

// Alternative: Use config file (uncomment if you prefer config file)
// import { supabaseConfig } from '../config/supabase.config';
// const supabaseUrl = supabaseConfig.url;
// const supabaseAnonKey = supabaseConfig.anonKey;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (will be updated based on your actual schema)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          role: 'ADMIN' | 'CASHIER';
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: 'ADMIN' | 'CASHIER';
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: 'ADMIN' | 'CASHIER';
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          category_id: string;
          price: number;
          stock: number;
          description?: string;
          image_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category_id: string;
          price: number;
          stock: number;
          description?: string;
          image_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category_id?: string;
          price?: number;
          stock?: number;
          description?: string;
          image_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          timestamp: string;
          total_amount: number;
          cashier_id: string;
          payment_method: 'CASH' | 'CARD' | 'DIGITAL';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          timestamp?: string;
          total_amount: number;
          cashier_id: string;
          payment_method: 'CASH' | 'CARD' | 'DIGITAL';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          timestamp?: string;
          total_amount?: number;
          cashier_id?: string;
          payment_method?: 'CASH' | 'CARD' | 'DIGITAL';
          created_at?: string;
          updated_at?: string;
        };
      };
      transaction_items: {
        Row: {
          id: string;
          transaction_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          transaction_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          transaction_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          created_at?: string;
        };
      };
    };
  };
}
