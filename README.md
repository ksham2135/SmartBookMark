# Smart Bookmark

A modern, responsive bookmark manager application built with Next.js 14 and Supabase.

## Features

- 🔐 **Secure Authentication**: User login and management powered by Supabase Auth.
- 📚 **Bookmark Management**: Easily add, view, and organize your favorite links.
- ⚡ **Real-time Updates**: Instant reflection of changes across devices.
- 🎨 **Modern UI**: Clean and responsive interface built with Tailwind CSS.
- 🚀 **High Performance**: Built on the robust Next.js 14 App Router.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend Service**: [Supabase](https://supabase.com/) (Database & Auth)
- **State Management**: React Hooks & Context

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- A Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd smart-bookmark
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**

   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   You can find these keys in your Supabase project settings under API.

4. **Run the Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app`: App Router pages and layouts (Login, Dashboard, API routes)
- `/components`: Reusable UI components (BookmarkForm, BookmarkList, etc.)
- `/lib`: Supabase client configuration and utility functions
- `/public`: Static assets

## License

This project is open source and available under the [MIT License](LICENSE).
