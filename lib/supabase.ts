import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Do not create this client at module scope. Next.js imports client-component
// modules during server prerendering, and Cloudflare Pages build workers may
// not have browser-public variables available while importing the page.
let browserClient: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("supabaseBrowser() must only be called in the browser.");
  }

  if (browserClient) return browserClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase configuration is missing. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in Cloudflare Pages Production build variables, then redeploy."
    );
  }

  browserClient = createClient(supabaseUrl, supabaseKey);
  return browserClient;
}
