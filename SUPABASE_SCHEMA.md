# Supabase Database Schema

This document outlines the required database schema for the TipWall application.

## Required Tables

### 1. `users` table
```sql
-- Basic user authentication table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  twitter_id TEXT,
  twitter_handle TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own record" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own record" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### 2. `creator_public` table
```sql
-- Public creator profile information
CREATE TABLE creator_public (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  categories TEXT[],
  min_tip_sol NUMERIC,
  quick_amounts NUMERIC[],
  avg_reply_hours SMALLINT,
  telegram_handle TEXT,
  email_new_tips BOOLEAN DEFAULT true,
  email_answer_conf BOOLEAN DEFAULT false,
  email_weekly BOOLEAN DEFAULT true,
  autoblock_min_tip_sol NUMERIC DEFAULT 0.01,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE creator_public ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Creator profiles are publicly readable" ON creator_public
  FOR SELECT USING (true);

CREATE POLICY "Users can update own creator profile" ON creator_public
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own creator profile" ON creator_public
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## Environment Variables Required

The following environment variables must be set in your Vercel deployment:

### Public (Next.js)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon public key

### Server-side
- `SUPABASE_URL` - Your Supabase project URL (same as public)
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for bypassing RLS)

## Authentication Setup

1. Enable Twitter OAuth in your Supabase dashboard:
   - Go to Authentication > Providers
   - Enable Twitter
   - Add your Twitter API credentials
   - Set redirect URL to: `https://yourdomain.com/auth/callback`

2. Configure Twitter App:
   - Create a Twitter app at https://developer.twitter.com/
   - Add callback URL: `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
   - Note the API Key and Secret for Supabase

## Features Implemented

### Authentication
- ✅ Twitter/X OAuth login
- ✅ Automatic user upsert on login
- ✅ Session management with Supabase
- ✅ Secure sign out
- ✅ Route protection with middleware

### Creator Onboarding
- ✅ Comprehensive profile setup form
- ✅ Display name and bio (required)
- ✅ Category selection (up to 5)
- ✅ Min tip amount slider (0.01-0.5 SOL)
- ✅ Quick amount buttons (customizable)
- ✅ Average reply time selection
- ✅ Telegram handle (optional)
- ✅ Email notification preferences
- ✅ Auto-block low tips setting

### Dashboard
- ✅ Server-side authentication check
- ✅ Automatic onboarding flow for new users
- ✅ Settings tab with full profile editing
- ✅ Integration with existing dashboard components

### API Routes
- ✅ `/api/auth/upsert` - User creation/update after OAuth
- ✅ `/api/profile/save` - RLS-safe profile updates via service role

### Security
- ✅ Row Level Security (RLS) policies
- ✅ Server-side validation and sanitization
- ✅ Middleware route protection
- ✅ Service role for secure database operations

## Next Steps

1. Run the SQL commands above in your Supabase SQL editor
2. Configure Twitter OAuth in Supabase dashboard
3. Set environment variables in Vercel
4. Test the authentication flow
5. Deploy and verify functionality

## Database Column Details

### `creator_public` columns:
- `display_name`: Text up to 80 chars, required for onboarding completion
- `bio`: Text up to 140 chars, required for onboarding completion  
- `categories`: Array of strings, max 5 categories
- `min_tip_sol`: Numeric, range 0.01-0.5, required for onboarding completion
- `quick_amounts`: Array of numbers, max 6 amounts
- `avg_reply_hours`: Small integer, 1-168 (1 hour to 1 week)
- `telegram_handle`: Optional text up to 64 chars
- `email_new_tips`: Boolean for new tip notifications
- `email_answer_conf`: Boolean for answer confirmation emails
- `email_weekly`: Boolean for weekly summary emails
- `autoblock_min_tip_sol`: Numeric, auto-decline tips below this amount
