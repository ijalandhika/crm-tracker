"use server";

import { createClient } from "@/lib/supabase/server";

export async function Login(email: string, password: string) {
  const supabase = await createClient();

  const payload = {
    email,
    password,
  };

  return supabase.auth.signInWithPassword(payload);
}
