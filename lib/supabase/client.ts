import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLICSUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLICSUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables")
    throw new Error("Missing Supabase environment variables. Please check your integration settings.")
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
