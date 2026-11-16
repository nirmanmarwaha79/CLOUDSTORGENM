import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export function getUserClient(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase server configuration is missing. Check Cloudflare Pages environment variables.");
  }

  return createClient(
    supabaseUrl,
    supabaseKey,
    { global: { headers: { Authorization: auth } }, auth: { persistSession: false } }
  );
}

export async function requireUser(req: NextRequest) {
  const client = getUserClient(req);
  if (!client) return { client: null, user: null, error: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return { client: null, user: null, error: NextResponse.json({ error: "Invalid or expired session." }, { status: 401 }) };
  return { client, user: data.user, error: null };
}
