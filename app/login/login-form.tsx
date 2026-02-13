"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") ?? "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createSupabaseBrowserClient();
      const redirectPath = redirectedFrom || "/dashboard";

      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/api/auth/callback?redirectTo=${encodeURIComponent(
            redirectPath
          )}`
        }
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
      }
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error during sign-in.");
      setLoading(false);
    }
  }, [redirectedFrom]);

  return (
    <div className="w-full max-w-md rounded-2xl bg-slate-900/70 p-8 shadow-xl ring-1 ring-slate-800">
      <h1 className="mb-2 text-center text-2xl font-semibold">
        Smart Bookmark App
      </h1>
      <p className="mb-8 text-center text-sm text-slate-400">
        Sign in with Google to manage your private bookmarks in real time.
      </p>

      {error && (
        <div className="mb-4 rounded-md bg-red-900/40 px-4 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Redirecting to Google..." : "Continue with Google"}
      </button>

      <p className="mt-6 text-center text-xs text-slate-500">
        OAuth only. No passwords are stored. Your bookmarks are private and
        scoped to your account.
      </p>
    </div>
  );
}
