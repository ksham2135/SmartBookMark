"use client";

import { useEffect, useMemo, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

type Bookmark = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  created_at: string | null;
};

type BookmarkListProps = {
  userId: string;
  initialBookmarks: Bookmark[];
};

export default function BookmarkList({ userId, initialBookmarks }: BookmarkListProps) {
  // Standard usage - createClientComponentClient is a singleton helper
  const supabase = createClientComponentClient();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [isConnected, setIsConnected] = useState(false);
  // const [debugStatus, setDebugStatus] = useState<string>("INITIAL");

  // Sync with server props if they change (e.g. on soft nav)
  useEffect(() => {
    setBookmarks(initialBookmarks);
  }, [initialBookmarks]);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) {
      setBookmarks(data as Bookmark[]);
    }
  };

  useEffect(() => {
    // Unique channel suffix to prevent collisions during strict mode re-renders
    const channelId = `bookmarks-${Date.now()}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks"
        },
        (payload) => {
          console.log("Realtime event received:", payload);
          // If we receive an event, we ARE connected, regardless of what the status callback says
          setIsConnected(true);
          // setDebugStatus("ACTIVE_EVENT"); // Removed debug

          if (payload.eventType === "INSERT") {
            const newBookmark = payload.new as Bookmark;
            if (newBookmark.user_id === userId) {
              setBookmarks((prev) => {
                if (prev.some(b => b.id === newBookmark.id)) return prev;
                return [newBookmark, ...prev];
              });
            }
          } else if (payload.eventType === "DELETE") {
            setBookmarks((prev) =>
              prev.filter((bookmark) => bookmark.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            const updatedBookmark = payload.new as Bookmark;
            setBookmarks((prev) =>
              prev.map(b => b.id === updatedBookmark.id ? updatedBookmark : b)
            );
          }
        }
      )
      .subscribe((status, err) => {
        console.log(`[${channelId}] Subscription status:`, status, err);
        // setDebugStatus(status); // Removed debug
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setIsConnected(false);
        }
      });

    return () => {
      console.log(`[${channelId}] Cleaning up...`);
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  // 2. Failsafe: Re-fetch on window focus to ensure consistency even if socket drops
  useEffect(() => {
    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        fetchBookmarks();
      }
    };
    window.addEventListener("visibilitychange", handleFocus);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener("focus", handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // Intentionally minimal dependency array

  // 3. Local Event Listener for Optimistic, Instant Local Updates
  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<Bookmark>;
      const newBookmark = custom.detail;
      if (!newBookmark || newBookmark.user_id !== userId) return;

      setBookmarks((current) => {
        if (current.some((b) => b.id === newBookmark.id)) return current;
        return [newBookmark, ...current];
      });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("bookmark:created", handler as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("bookmark:created", handler as EventListener);
      }
    };
  }, [userId]);

  const handleDelete = async (id: string) => {
    // Optimistic update
    setBookmarks((current) => current.filter((b) => b.id !== id));

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting:", error);
      // Ideally revert optimistic update here, but for now we rely on re-fetch
      fetchBookmarks();
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {`Bookmarks (${bookmarks.length})`}
        </span>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 transition-colors ${isConnected ? "text-emerald-400" : "text-amber-400"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            {isConnected ? "Live" : "Connecting..."}
          </span>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <p className="text-sm text-slate-400">
          No bookmarks yet. Add your first one above.
        </p>
      ) : (
        <ul className="divide-y divide-slate-800 rounded-lg border border-slate-800 bg-slate-950/40">
          {bookmarks.map((bookmark) => (
            <li
              key={bookmark.id}
              className="flex items-center justify-between gap-4 px-4 py-3 group hover:bg-slate-900/50 transition-colors"
            >
              <div className="min-w-0">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline"
                >
                  {bookmark.title}
                </a>
                <p className="truncate text-xs text-slate-500 group-hover:text-slate-400">
                  {bookmark.url}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(bookmark.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity rounded-md border border-red-900/40 bg-red-950/40 px-2 py-1 text-xs text-red-300 hover:bg-red-900/80 hover:text-red-100 hover:border-red-800"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

