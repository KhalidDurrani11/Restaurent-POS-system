# Supabase Integration Setup Guide

This guide will help you integrate your Supabase database with the Khan POS application.

## Prerequisites

1. A Supabase account and project
2. Node.js and npm installed
3. Your Supabase project URL and API keys

## Setup Steps

### 1. Install Dependencies

The Supabase client library has already been installed. If you need to reinstall:

```bash
npm install @supabase/supabase-js
```

### 2. Configure Supabase Credentials

You have two options for configuring your Supabase credentials:

#### Option A: Environment Variables (Recommended)

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Option B: Configuration File

1. Copy `config/supabase.config.ts` to `config/supabase.config.ts`
2. Update the values with your actual Supabase credentials
3. Uncomment the import lines in `services/supabase.ts`

### 3. Set Up Your Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL script to create all necessary tables and data

### 4. Configure Authentication (Optional)

If you want to use Supabase authentication:

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your authentication providers
3. Update the authentication policies in the SQL schema if needed

### 5. Test the Integration

The application now uses Supabase for all database operations. The following services are available:

- `userService`: User management and authentication
- `categoryService`: Category CRUD operations
- `productService`: Product CRUD operations
- `transactionService`: Transaction management

## Database Schema

The database includes the following tables:

- **users**: User accounts and roles
- **categories**: Product categories
- **products**: Product inventory
- **transactions**: Sales transactions
- **transaction_items**: Individual items in transactions

## Key Features

- **Real-time updates**: Supabase provides real-time subscriptions
- **Row Level Security**: Built-in security policies
- **Automatic timestamps**: Created/updated timestamps are handled automatically
- **Foreign key relationships**: Proper database relationships with cascading deletes
- **Performance indexes**: Optimized for common queries

## Usage Examples

### Fetching Products
```typescript
import { productService } from './services/databaseService';

const products = await productService.getAll();
```

### Creating a Transaction
```typescript
import { transactionService } from './services/databaseService';

const transaction = await transactionService.create({
  total_amount: 15.50,
  cashier_id: 'user-id',
  payment_method: 'CASH',
  items: [
    { product_id: 'product-id', quantity: 2, unit_price: 5.00 },
    { product_id: 'product-id-2', quantity: 1, unit_price: 5.50 }
  ]
});
```

## Troubleshooting

### Common Issues

1. **Connection errors**: Verify your Supabase URL and API key
2. **Permission errors**: Check your RLS policies in Supabase
3. **Type errors**: Ensure your database schema matches the TypeScript types

### Getting Help

- Check the Supabase documentation: https://supabase.com/docs
- Review the generated types in `services/supabase.ts`
- Check the browser console for detailed error messages

## Security Notes

- Never commit your `.env` file or `supabase.config.ts` to version control
- Use environment variables for production deployments
- Regularly rotate your API keys
- Review and update RLS policies as needed
