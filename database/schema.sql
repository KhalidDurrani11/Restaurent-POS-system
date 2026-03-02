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
    ('OTC Medicines'),
    ('Prescription Medicines'),
    ('Vitamins & Supplements'),
    ('First Aid'),
    ('Medical Devices'),
    ('Personal Care')
ON CONFLICT (name) DO NOTHING;

-- Insert initial products (medical shop items)
INSERT INTO products (name, category_id, price, stock, description) VALUES 
    ('Paracetamol 500mg (10 tablets)', (SELECT id FROM categories WHERE name = 'OTC Medicines'), 150.00, 120, 'Pain relief and fever reducer'),
    ('Ibuprofen 400mg (10 tablets)', (SELECT id FROM categories WHERE name = 'OTC Medicines'), 220.00, 80, 'Anti-inflammatory pain relief'),
    ('Cetirizine 10mg (10 tablets)', (SELECT id FROM categories WHERE name = 'OTC Medicines'), 180.00, 100, 'Allergy relief antihistamine'),
    ('Omeprazole 20mg (14 capsules)', (SELECT id FROM categories WHERE name = 'Prescription Medicines'), 350.00, 60, 'Acid reflux support'),
    ('ORS Sachet', (SELECT id FROM categories WHERE name = 'OTC Medicines'), 60.00, 200, 'Oral rehydration salts'),
    ('Vitamin C 1000mg (30 tablets)', (SELECT id FROM categories WHERE name = 'Vitamins & Supplements'), 500.00, 50, 'Vitamin C supplement'),
    ('Antiseptic Solution 100ml', (SELECT id FROM categories WHERE name = 'First Aid'), 180.00, 75, 'Topical antiseptic'),
    ('Bandage Roll 4 inch', (SELECT id FROM categories WHERE name = 'First Aid'), 90.00, 150, 'Elastic bandage roll'),
    ('Digital Thermometer', (SELECT id FROM categories WHERE name = 'Medical Devices'), 650.00, 25, 'Digital body thermometer'),
    ('Blood Pressure Monitor', (SELECT id FROM categories WHERE name = 'Medical Devices'), 4500.00, 10, 'Automatic BP monitor'),
    ('Aspirin 75mg (30 tablets)', (SELECT id FROM categories WHERE name = 'OTC Medicines'), 120.00, 90, 'Low dose aspirin'),
    ('Amoxicillin 500mg (10 capsules)', (SELECT id FROM categories WHERE name = 'Prescription Medicines'), 280.00, 45, 'Antibiotic capsules'),
    ('Multivitamin (60 tablets)', (SELECT id FROM categories WHERE name = 'Vitamins & Supplements'), 650.00, 70, 'Daily multivitamin'),
    ('Calcium + D3 (30 tablets)', (SELECT id FROM categories WHERE name = 'Vitamins & Supplements'), 420.00, 55, 'Bone health supplement'),
    ('Cotton Wool 100g', (SELECT id FROM categories WHERE name = 'First Aid'), 85.00, 120, 'Sterile cotton wool'),
    ('Adhesive Plasters (20 pcs)', (SELECT id FROM categories WHERE name = 'First Aid'), 95.00, 100, 'Assorted plasters'),
    ('Face Mask (50 pcs)', (SELECT id FROM categories WHERE name = 'First Aid'), 350.00, 80, 'Disposable face masks'),
    ('Glucose Meter', (SELECT id FROM categories WHERE name = 'Medical Devices'), 1200.00, 15, 'Blood glucose meter'),
    ('Pulse Oximeter', (SELECT id FROM categories WHERE name = 'Medical Devices'), 850.00, 20, 'Fingertip pulse oximeter'),
    ('Hand Sanitizer 500ml', (SELECT id FROM categories WHERE name = 'Personal Care'), 220.00, 60, 'Alcohol-based sanitizer'),
    ('Soap Bar (pack of 3)', (SELECT id FROM categories WHERE name = 'Personal Care'), 150.00, 90, 'Antibacterial soap'),
    ('Cough Syrup 100ml', (SELECT id FROM categories WHERE name = 'OTC Medicines'), 180.00, 65, 'Cough relief syrup'),
    ('Diclofenac Gel 30g', (SELECT id FROM categories WHERE name = 'OTC Medicines'), 240.00, 40, 'Topical pain relief gel'),
    ('Eye Drops 10ml', (SELECT id FROM categories WHERE name = 'OTC Medicines'), 160.00, 75, 'Lubricating eye drops'),
    ('Vitamin B Complex (30 tablets)', (SELECT id FROM categories WHERE name = 'Vitamins & Supplements'), 380.00, 50, 'B vitamin supplement')
ON CONFLICT DO NOTHING;

-- Create login users in Supabase Auth first:
-- Authentication > Users > Add user (tick Auto Confirm)
--   Admin:  admin@gmail.com  / admin
--   Cashier: cashier@gmail.com / cashier
-- On first app login, the app creates their row in public.users with the correct role.

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your authentication needs)
-- For now, allowing all operations for authenticated users
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
