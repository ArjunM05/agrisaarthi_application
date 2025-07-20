import { createClient } from "@supabase/supabase-js";

// Check for runtime environment variables first, then build-time
const supabaseUrl = (window as any).ENV?.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = (window as any).ENV?.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Check if environment variables are available
if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase environment variables are not set. Some features may not work.");
}

// Create Supabase client with fallback to a dummy client
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : createClient("https://dummy.supabase.co", "dummy-key"); // Dummy client for build

export default supabase;
