import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration - from environment (set in Netlify → Site settings → Environment variables)
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string) ||
  '';

const hasValidConfig = supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 20;

// Create client only when config is present (avoids crash on Netlify when env vars are missing)
export const supabase: SupabaseClient = createClient(
  hasValidConfig ? supabaseUrl : 'https://placeholder.supabase.co',
  hasValidConfig ? supabaseAnonKey : 'placeholder-key-so-app-loads'
);

export const isSupabaseConfigured = (): boolean => hasValidConfig;

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
