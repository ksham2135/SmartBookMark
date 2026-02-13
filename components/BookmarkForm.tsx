"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

type Props = {
  userId: string;
};

export default function BookmarkForm({ userId }: Props) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !url.trim()) {
      setError("Both title and URL are required.");
      return;
    }

    try {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();

      const { data, error: insertError } = await supabase
        .from("bookmarks")
        .insert({
          title: title.trim(),
          url: url.trim(),
          user_id: userId
        })
        .select("*")
        .single();

      if (insertError) {
        setError(insertError.message);
      } else {
        setTitle("");
        setUrl("");

        // Optimistically notify any listeners (e.g. BookmarkList) about the new bookmark
        if (typeof window !== "undefined" && data) {
          window.dispatchEvent(
            new CustomEvent("bookmark:created", { detail: data })
          );
        }
      }
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error while adding bookmark.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-md bg-red-900/40 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex-1 space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Title
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My favorite docs"
          />
        </div>

        <div className="flex-1 space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            URL
          </label>
          <input
            type="url"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Add Bookmark"}
        </button>
      </div>
    </form>
  );
}

