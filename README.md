# Limmo Waitlist Page

A beautiful, modern waitlist page for Limmo - a private journaling and motivation companion built for first-time founders.

## Features

- **Modern Design**: Clean, responsive design with smooth animations
- **Email Collection**: Collect email addresses for the waitlist
- **Challenge Feedback**: Optional form to collect founder challenges
- **Real-time Updates**: Shows current waitlist count
- **Mobile Responsive**: Works perfectly on all devices
- **Supabase Integration**: Secure data storage with Supabase

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Backend**: Supabase (database)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd limmo-waitlist-page
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Database Setup

The project requires a Supabase database with a `waitlist` table. Run the following SQL in your Supabase SQL editor:

```sql
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  biggest_challenge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow inserts for anyone
CREATE POLICY "Allow public inserts" ON waitlist
  FOR INSERT WITH CHECK (true);

-- Allow updates for existing records
CREATE POLICY "Allow updates" ON waitlist
  FOR UPDATE USING (true);
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

- **Vercel**: Connect your GitHub repo and deploy automatically
- **Netlify**: Drag and drop the `dist` folder
- **Supabase Edge Functions**: Deploy as a static site
- **Any static hosting service**: The build output is static files

## Project Structure

```
src/
├── components/
│   └── ui/           # shadcn/ui components (button, input, card, etc.)
├── hooks/
│   └── use-toast.ts  # Toast notification hook
├── integrations/
│   └── supabase/     # Supabase client configuration
├── lib/
│   └── utils.ts      # Utility functions
└── pages/
    └── Waitlist.tsx  # Main waitlist page component
```

## Customization

### Colors and Branding

Update the primary color in `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "#6366f1", // Change this to your brand color
        // ... other shades
      }
    }
  }
}
```

### Content

Edit `src/pages/Waitlist.tsx` to customize:
- Headlines and descriptions
- Features and benefits
- Waitlist count
- Form fields

## License

This project is private and proprietary to Limmo.
# limmo-waitlist
