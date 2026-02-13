import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: bookmarks, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookmarks:", error.message);
  }

  return (
    <div className="w-full max-w-2xl space-y-6 rounded-2xl bg-slate-900/70 p-6 shadow-xl ring-1 ring-slate-800">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Your Smart Bookmarks</h1>
          <p className="text-xs text-slate-400">
            Real-time, private bookmark manager.
          </p>
        </div>
        <LogoutButton />
      </header>

      <BookmarkForm userId={user.id} />

      <BookmarkList userId={user.id} initialBookmarks={bookmarks ?? []} />
    </div>
  );
}

