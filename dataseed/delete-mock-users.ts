
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error(
      "Missing Supabase URL or API key. Please check your .env file.",
    );
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

supabase.auth.admin.deleteUser(
    'eb603cab-684a-4562-bc25-d4b9da99d93f'
  )