# TipWall MVP

A pay-to-reply Q&A platform for Solana creators. Built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **Landing Page**: Hero section with leaderboard of top creators
- **Creator Pages**: Public profile pages with tip forms
- **Dashboard**: Creator management interface with inbox, answered questions, and settings
- **Payment Flow**: Mock Solana payment integration (ready for Blinks/Actions)
- **Success Page**: Post-payment confirmation with Telegram instructions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Forms**: react-hook-form + zod validation
- **Icons**: Lucide React
- **Date**: dayjs
- **State**: React Server Components + client components

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API route handlers
│   ├── c/[handle]/        # Creator public pages
│   ├── dashboard/         # Creator dashboard
│   └── success/           # Payment success page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities and types
│   ├── mock-data.ts      # Mock data store
│   ├── types.ts          # TypeScript types
│   ├── utils.ts          # Utility functions
│   └── validations.ts    # Zod schemas
└── styles/               # Global styles
```

## API Routes

- `GET /api/creator-card?handle=@username` - Get creator info
- `POST /api/tip/init` - Initialize tip payment
- `GET /api/creator/tips` - Get creator's tips (pending/answered)
- `POST /api/answer` - Submit answer to tip
- `GET /api/leaderboard` - Get top creators

## Key Components

- **TipForm**: Validated form for asking questions with payment
- **DashboardTabs**: Creator management interface
- **InboxTable**: Pending questions management
- **AnsweredTable**: Answered questions history
- **SettingsForm**: Creator profile settings
- **LeaderboardList**: Top creators display

## Mock Data

The app includes mock data for 6 creators and sample questions. All data is stored in memory and will reset on server restart.

## Integration Points

The following areas are ready for real backend integration:

- **Authentication**: Mock Twitter OAuth (see Navbar component)
- **Payments**: Mock Solana Actions/Blinks (see TipForm component)
- **Telegram**: Mock bot API calls (see answer submission)
- **Database**: Replace mock-data.ts with Supabase/database calls

## Design System

- **Theme**: Solana-adjacent dark theme with green primary color
- **Typography**: Inter font family
- **Layout**: Card-based with rounded-2xl borders
- **Spacing**: Consistent 4/6/8/12 scale
- **Mobile-first**: Responsive design with breakpoints

## Validation

All forms include comprehensive validation:

- Telegram handles: `^@?[a-zA-Z0-9_]{5,}$`
- Questions: 1-280 characters
- Wallet addresses: Solana format validation
- Pricing: 0.001-10 SOL range

## Deployment

Ready to deploy to Vercel, Netlify, or any Node.js hosting platform. No additional configuration needed.

## License

MIT
# Deployment Status: Tue Aug 26 23:33:24 EDT 2025
