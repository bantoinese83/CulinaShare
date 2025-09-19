# CulinaShare 🍳

A modern, robust, and scalable recipe sharing platform built with Next.js 14, TypeScript, and Supabase. Share your culinary creations, discover new recipes, and plan your meals with our community of food lovers.

## ✨ Features

- **Recipe Management**: Create, edit, and share recipes with detailed ingredients and step-by-step instructions
- **Recipe Discovery**: Search and filter recipes by cuisine, dietary preferences, difficulty, and more
- **User Authentication**: Secure authentication with Supabase Auth
- **User Profiles**: Customizable user profiles with recipe collections
- **Rating & Reviews**: Rate and review recipes to help others discover great dishes
- **Social Features**: Like, save, and follow other users
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Beautiful, accessible interface built with Tailwind CSS and Radix UI

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Zustand** - State management
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **Row Level Security** - Data security
- **Edge Functions** - Serverless functions

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **React Testing Library** - Component testing

## 🏗️ Architecture

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components
│   ├── features/          # Feature-specific components
│   └── layout/            # Layout components
├── lib/                   # Core utilities and configurations
│   ├── auth/              # Authentication logic
│   ├── database/          # Database abstraction layer
│   ├── supabase/          # Supabase client configuration
│   └── validations/       # Zod schemas
├── services/              # Business logic services
├── stores/                # Zustand stores
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── config/                # Configuration files
```

### Design Principles

- **Clean Code**: Following SOLID principles and clean code practices
- **Modularity**: Each component has a single responsibility
- **Type Safety**: Full TypeScript coverage with strict mode
- **Accessibility**: WCAG 2.1 AA compliant components
- **Performance**: Optimized for Core Web Vitals
- **Scalability**: Built to handle growth and feature additions

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd culina-share
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations (see Database Setup section)
   - Configure authentication settings

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

The database schema is automatically created through Supabase migrations. The schema includes:

- **Users**: User profiles and authentication data
- **Recipes**: Recipe information and metadata
- **Ingredients**: Recipe ingredients with quantities
- **Instructions**: Step-by-step cooking instructions
- **Reviews**: User ratings and comments
- **Likes & Saves**: User interactions with recipes
- **Follows**: User following relationships

### Key Features
- **Row Level Security (RLS)**: Ensures users can only access their own data
- **Automatic Timestamps**: Created/updated timestamps for all records
- **Triggers**: Automatic calculation of recipe ratings and like counts
- **Indexes**: Optimized for fast queries and searches

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📱 Features Overview

### Recipe Management
- Create recipes with detailed information
- Upload recipe images
- Add ingredients with quantities and units
- Write step-by-step instructions
- Set cooking times and difficulty levels
- Add dietary tags and cuisine types

### Discovery & Search
- Search recipes by name, ingredients, or cuisine
- Filter by dietary preferences, difficulty, and cooking time
- Sort by popularity, rating, or date
- Browse featured and trending recipes

### User Experience
- Responsive design for all devices
- Dark mode support
- Accessible components
- Fast loading with optimized images
- Offline support for saved recipes

## 🔒 Security

- **Authentication**: Secure user authentication with Supabase Auth
- **Authorization**: Row-level security policies
- **Data Validation**: Client and server-side validation with Zod
- **CSRF Protection**: Built-in Next.js CSRF protection
- **XSS Prevention**: Sanitized user inputs

## 🎨 Design System

### Colors
- **Primary**: Orange (#F97316) - Warm, appetizing
- **Secondary**: Yellow (#F59E0B) - Bright, energetic
- **Accent**: Pumpkin Orange (#D35400) - Rich, inviting

### Typography
- **Headings**: Poppins - Modern, friendly
- **Body**: Inter - Clean, readable

### Components
- Consistent spacing and sizing
- Accessible color contrasts
- Smooth animations and transitions
- Mobile-first responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - The backend platform
- [Tailwind CSS](https://tailwindcss.com/) - The CSS framework
- [Radix UI](https://www.radix-ui.com/) - The component primitives
- [Lucide](https://lucide.dev/) - The icon library

## 📞 Support

If you have any questions or need help, please:

1. Check the [documentation](docs/)
2. Search [existing issues](issues/)
3. Create a [new issue](issues/new)
4. Contact us at support@culinashare.com

---

Made with ❤️ for food lovers everywhere