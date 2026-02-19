# PyFluent - Learn Python Through English

A production-ready learning platform that teaches Python programming through English using a Daily Mission System.

## Features

- 📚 30-day structured Python curriculum
- 🎯 Daily mission system (10/20/30 min modes)
- 💪 Streak tracking & gamification
- 📝 English writing tasks for developers
- 🧠 Interactive coding tasks & quizzes
- 📊 Progress analytics
- 🔐 Secure authentication with Supabase
- 👨‍💼 Admin panel for content management

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL)
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account
- Git

### 2. Clone and Install

```bash
cd d:/projects/pyfluent
npm install
```

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your project URL and anon key
4. Run the SQL schema (see `database/schema.sql`)
5. Run the RLS policies (see `database/rls-policies.sql`)
6. Run the seed data (see `database/seed.sql`)

### 4. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_EMAILS=your-email@example.com
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel

```bash
vercel
```

Add environment variables in Vercel dashboard.

## Project Structure

```
pyfluent/
├── app/                    # Next.js app router
│   ├── (auth)/            # Auth pages
│   ├── (public)/          # Public pages
│   ├── dashboard/         # Main app
│   └── admin/             # Admin panel
├── components/            # React components
├── lib/                   # Utilities & configs
├── database/              # SQL schemas & seeds
└── public/                # Static assets
```

## Admin Access

Admin panel is accessible at `/admin` only to whitelisted emails defined in `NEXT_PUBLIC_ADMIN_EMAILS`.

## License

MIT
