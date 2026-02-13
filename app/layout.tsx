import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Smart Bookmark App",
  description: "Real-time private bookmarks with Supabase and Next.js"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <main className="flex min-h-screen items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}

