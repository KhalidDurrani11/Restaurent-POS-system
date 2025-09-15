# Environment Variables Setup

## Your Supabase Configuration

Create a `.env` file in your project root with the following content:

```env
VITE_SUPABASE_URL=https://zbdqsuyplfklhqydkovo.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_geKbz_UpSYKTZPpLVkK9nQ_ed3ReW0l
```

## Steps to Set Up:

1. **Create `.env` file** in your project root directory
2. **Copy the environment variables** above into the `.env` file
3. **Restart your development server** after creating the `.env` file

## Alternative Configuration

If you prefer to use the config file instead of environment variables, the `config/supabase.config.ts` file has been updated with your credentials and you can uncomment the config file import in `services/supabase.ts`.

## Security Note

- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file
- The `.env` file should only exist locally on your machine

## Verification

Your Supabase client is now configured with:
- ✅ URL: `https://zbdqsuyplfklhqydkovo.supabase.co`
- ✅ API Key: `sb_publishable_geKbz_UpSYKTZPpLVkK9nQ_ed3ReW0l`

The application will automatically use these credentials when you run it.
