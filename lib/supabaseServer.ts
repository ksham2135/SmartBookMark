import { cookies } from "next/headers";
import {
  createServerComponentClient,
  createRouteHandlerClient
} from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

export const createSupabaseServerClient = () =>
  createServerComponentClient({ cookies }) as SupabaseClient;

export const createSupabaseRouteClient = () =>
  createRouteHandlerClient({ cookies }) as SupabaseClient;

