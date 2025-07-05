import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
let cachedClient = null;
let lastToken = null;

const supabaseClient = async (supabaseAccessToken) => {
  // Only add the Authorization header if a token is provided
  const options = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  };

  if (supabaseAccessToken) {
    options.global = {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    };
  }

  // Only cache if token is the same
  if (cachedClient && lastToken === supabaseAccessToken) {
    return cachedClient;
  }

  lastToken = supabaseAccessToken;
  cachedClient = createClient(supabaseUrl, supabaseKey, options);
  return cachedClient;
};

export default supabaseClient;