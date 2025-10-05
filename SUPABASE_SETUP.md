# Supabase Setup Guide

This guide will help you set up Supabase for persistent distribution history storage.

## 🚀 Quick Setup

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### 2. Get Your Credentials
1. Go to your project dashboard
2. Navigate to **Settings** → **API**
3. Copy your:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **Anon/Public Key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 3. Set Up Database
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL script to create the `distributions` table

### 4. Environment Variables
Add these to your `.env` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Migrate Existing Data (Optional)
If you have existing distribution history in `distribution-history.json`:

```bash
node scripts/migrate-to-supabase.js
```

Then run the generated SQL script in your Supabase SQL Editor.

## 🔧 Database Schema

The `distributions` table stores:
- **id**: Auto-incrementing primary key
- **timestamp**: When the distribution occurred
- **total_distributed**: Total SOL distributed
- **recipients_count**: Number of recipients
- **transactions_count**: Number of transactions
- **failed_transactions**: Number of failed transactions
- **transactions**: JSON array of transaction details
- **treasury_balance**: Treasury balance at time of distribution
- **status**: Distribution status (success, failed, partial, threshold_not_met)

## 🛡️ Security

The table uses Row Level Security (RLS) with a permissive policy. For production, consider:
- Restricting access to specific users
- Using service role key for server-side operations
- Implementing proper authentication

## 📊 Benefits

✅ **Persistent Storage**: Data survives deployments and restarts
✅ **Scalable**: Handles large amounts of distribution history
✅ **Queryable**: Easy to query and analyze data
✅ **Backup**: Automatic backups with Supabase
✅ **Real-time**: Can add real-time subscriptions if needed

## 🧪 Testing

After setup, test the integration:
1. Run a distribution
2. Check the `distributions` table in Supabase
3. Verify data appears in the Distribution History UI

## 🆘 Troubleshooting

**Error: Missing Supabase environment variables**
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set

**Error: Table doesn't exist**
- Run the SQL schema in Supabase SQL Editor

**Error: Permission denied**
- Check RLS policies in Supabase dashboard
- Ensure your API key has proper permissions

## 📈 Monitoring

Monitor your Supabase usage in the dashboard:
- Database size
- API requests
- Storage usage
- Performance metrics
