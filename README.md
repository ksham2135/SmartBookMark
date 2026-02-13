# Smart Bookmark

A modern, real-time bookmark manager built with Next.js 14 and Supabase. Store your favorite links privately, sync instantly across devices, and manage everything with a clean, dark-themed interface.

![Login Page](docs/screenshots/login.png)

---

## ✨ Features

- 🔐 **Secure Authentication** — Google OAuth via Supabase Auth. No passwords stored.
- 📚 **Bookmark Management** — Add, view, and delete your links with a simple interface.
- ⚡ **Real-time Sync** — Changes reflect instantly across all devices using Supabase Realtime.
- 🎨 **Modern Dark UI** — Clean, responsive design built with Tailwind CSS.
- 🚀 **Vercel-Ready** — Deployed and optimized for production on Vercel.

---

## 🖼️ Screenshots

### Login Page
Sign in with Google to access your private bookmarks. OAuth only — your data stays secure.

![Login](docs/screenshots/login.png)

### Dashboard — Empty State
Ready to add your first bookmark. The interface guides you every step of the way.

![Dashboard Empty](docs/screenshots/dashboard-empty.png)

### Dashboard — With Bookmarks
Your bookmarks with real-time status. Add, view, and manage links with live updates.

![Dashboard with Bookmarks](docs/screenshots/dashboard-with-bookmarks.png)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Backend** | [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime) |
| **Deployment** | [Vercel](https://vercel.com) |

---

## 📁 Project Structure

```
SmartBookmark/
├── app/
│   ├── api/auth/callback/     # OAuth callback handler
│   ├── dashboard/             # Protected bookmark dashboard
│   ├── login/                 # Login page + form component
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home (redirects to login/dashboard)
├── components/
│   ├── BookmarkForm.tsx       # Add new bookmarks
│   ├── BookmarkList.tsx       # Display + realtime list
│   └── LogoutButton.tsx       # Sign out
├── lib/
│   ├── supabaseClient.ts      # Browser client (@supabase/ssr)
│   └── supabaseServer.ts      # Server client (cookies, SSR)
├── middleware.ts              # Auth guard, session refresh
├── docs/screenshots/          # README screenshots
└── public/
```

**How it’s built**

1. **App Router** — Routes: `/` (redirect), `/login`, `/dashboard`
2. **Middleware** — Protects `/dashboard`, redirects unauthenticated users to `/login` with `redirectedFrom`
3. **Supabase SSR** — Server client for pages; browser client for client components and realtime
4. **Realtime** — `BookmarkList` subscribes to `postgres_changes` for live updates

---

## 🐛 Problems Faced & Solutions

### 1. Vercel Build: `useSearchParams()` Suspense Boundary
**Error:** `useSearchParams() should be wrapped in a suspense boundary at page "/login"`

**Cause:** Next.js 14 requires `useSearchParams()` to be inside a `<Suspense>` boundary so the page can prerender a static shell.

**Fix:** Moved search params logic into a client component (`LoginForm`) that uses `useSearchParams()`, and wrapped it in `<Suspense>` on the page.

---

### 2. Vercel Build: Dynamic Server Usage (Cookies)
**Error:** `Page couldn't be rendered statically because it used cookies`

**Cause:** The old `@supabase/auth-helpers-nextjs` package accessed cookies during prerender, which conflicts with static generation.

**Fix:** Migrated to `@supabase/ssr`, which uses `createBrowserClient` for the client (no cookies at build time) and `createServerClient` with async `cookies()` for the server.

---

### 3. Deprecated Auth Helpers
**Warning:** `@supabase/auth-helpers-nextjs` is deprecated

**Fix:** Switched to `@supabase/ssr`, which is the supported Supabase client for Next.js SSR and works with cookies correctly.

---

### Summary of Changes
- Replaced `@supabase/auth-helpers-nextjs` with `@supabase/ssr`
- Implemented `createBrowserClient` and `createServerClient` with cookie handling
- Wrapped `LoginForm` (using `useSearchParams`) in `<Suspense>`
- Updated middleware and auth callback for the new Supabase SSR setup

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+
- npm or yarn
- Supabase project
- Google OAuth credentials (for Supabase Auth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ksham2135/SmartBookMark.git
   cd SmartBookMark
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `.env.local` in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   Get these from your [Supabase project settings](https://supabase.com/dashboard/project/_/settings/api) → API.

4. **Set up Supabase**
   - Enable Google OAuth in Supabase Auth
   - Create a `bookmarks` table (or run your migrations)
   - Enable Realtime for `bookmarks`

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

---

## 📦 Deployment (Vercel)

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel environment variables
3. Deploy — the build is configured for Vercel

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

