# Luton AI Website

A modern website with a content management system and admin panel.

## Features

- 🚀 Next.js 14 with App Router
- 🎨 Modern UI with Tailwind CSS
- 🔒 Authentication with NextAuth.js
- 📝 Content Management System
- 👥 User Management
- 📊 Admin Dashboard
- 🗃️ PostgreSQL Database with Prisma ORM

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lutonai.git
   cd lutonai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `NEXTAUTH_SECRET`: Generate a secure random string
     - `GITHUB_ID` and `GITHUB_SECRET`: Create these at https://github.com/settings/developers

4. Set up the database:
   ```bash
   # Make the setup script executable
   chmod +x scripts/setup-db.sh
   
   # Run the setup script
   ./scripts/setup-db.sh
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Visit http://localhost:3000 in your browser

## Admin Access

The first user to sign in through GitHub will automatically become an admin. Subsequent users will have regular user privileges.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── admin/          # Admin dashboard pages
│   ├── api/            # API routes
│   └── auth/           # Authentication pages
├── components/         # React components
├── lib/               # Utility functions and configurations
└── styles/            # Global styles
```

## Database Schema

The project uses Prisma as the ORM with the following main models:
- User
- Post
- Comment
- Page
- Event
- Sponsor
- Opportunity

## API Routes

- `/api/posts`: CRUD operations for blog posts
- `/api/pages`: CRUD operations for static pages
- `/api/events`: CRUD operations for events
- `/api/sponsors`: CRUD operations for sponsors
- `/api/opportunities`: CRUD operations for opportunities

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 