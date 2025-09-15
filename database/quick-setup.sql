-- Quick Setup SQL for Khan POS Supabase Database
-- Run this entire script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('ADMIN', 'CASHIER')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL CHECK (stock >= 0),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    cashier_id UUID REFERENCES users(id) ON DELETE SET NULL,
    payment_method VARCHAR(20) CHECK (payment_method IN ('CASH', 'CARD', 'DIGITAL')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transaction_items table
CREATE TABLE IF NOT EXISTS transaction_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_cashier_id ON transactions(cashier_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction_id ON transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_items_product_id ON transaction_items(product_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial categories
INSERT INTO categories (name) VALUES 
    ('Beverages'),
    ('Fast Food'),
    ('Snacks'),
    ('Grocery')
ON CONFLICT (name) DO NOTHING;

-- Insert initial products
INSERT INTO products (name, category_id, price, stock, description) VALUES 
    ('Cola', (SELECT id FROM categories WHERE name = 'Beverages'), 1.50, 150, 'Refreshing cola drink'),
    ('Burger', (SELECT id FROM categories WHERE name = 'Fast Food'), 5.00, 80, 'Delicious beef burger'),
    ('Fries', (SELECT id FROM categories WHERE name = 'Fast Food'), 2.50, 120, 'Crispy golden fries'),
    ('Potato Chips', (SELECT id FROM categories WHERE name = 'Snacks'), 1.20, 200, 'Crunchy potato chips'),
    ('Milk 1L', (SELECT id FROM categories WHERE name = 'Grocery'), 2.00, 50, 'Fresh milk 1 liter'),
    ('Bread', (SELECT id FROM categories WHERE name = 'Grocery'), 2.20, 60, 'Fresh white bread'),
    ('Orange Juice', (SELECT id FROM categories WHERE name = 'Beverages'), 3.00, 75, 'Fresh orange juice'),
    ('Chicken Sandwich', (SELECT id FROM categories WHERE name = 'Fast Food'), 6.50, 40, 'Grilled chicken sandwich'),
    ('Chocolate Bar', (SELECT id FROM categories WHERE name = 'Snacks'), 1.80, 300, 'Sweet chocolate bar'),
    ('Water Bottle', (SELECT id FROM categories WHERE name = 'Beverages'), 1.00, 5, 'Pure water bottle')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for authenticated users)
CREATE POLICY "Allow all operations for authenticated users" ON users
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON products
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON transactions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON transaction_items
    FOR ALL USING (auth.role() = 'authenticated');

-- IMPORTANT: After running this SQL, you need to create users in Supabase Auth:
-- 1. Go to Authentication > Users in your Supabase dashboard
-- 2. Click "Add user" and create:
--    - Email: admin@khanpos.com, Password: admin, Auto Confirm: Yes
--    - Email: cashier@khanpos.com, Password: cashier, Auto Confirm: Yes
-- 3. After creating auth users, run the following SQL to link them:

-- Get the actual user IDs from auth.users and insert into our users table
INSERT INTO users (id, name, email, role) 
SELECT 
    au.id,
    CASE 
        WHEN au.email = 'admin@khanpos.com' THEN 'Admin User'
        WHEN au.email = 'cashier@khanpos.com' THEN 'Cashier User'
    END as name,
    au.email,
    CASE 
        WHEN au.email = 'admin@khanpos.com' THEN 'ADMIN'
        WHEN au.email = 'cashier@khanpos.com' THEN 'CASHIER'
    END as role
FROM auth.users au
WHERE au.email IN ('admin@khanpos.com', 'cashier@khanpos.com')
ON CONFLICT (email) DO NOTHING;

-- Success message
SELECT 'Database setup completed successfully! You can now login with admin/admin or cashier/cashier.' as message;

