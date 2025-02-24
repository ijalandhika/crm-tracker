"use server";

import { CUSTOMER_TABLE } from "@/constants/tables";
import { createClient } from "@/lib/supabase/server";
import { Pelanggan } from "./types";
import { getUserGroup } from "@/lib/supabase/roles";

export async function GetPelanggan(
  currentPage?: number,
  postsPerPage?: number,
  q?: string
) {
  if (!currentPage) {
    currentPage = 1;
  }
  if (!postsPerPage) {
    postsPerPage = 10;
  }
  const supabase = await createClient();

  const { user_ids, error: groupError } = await getUserGroup();

  console.log("lalalal", user_ids);

  if (groupError) {
    return {
      rows: [],
      totalPages: 0,
      message: groupError,
    };
  }

  const query = supabase
    .from(CUSTOMER_TABLE)
    .select(
      `id, nama, bidang_usaha, is_active, logo, alamat, 
       created_by, updated_by, created_at, updated_at
       `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range((currentPage - 1) * postsPerPage, currentPage * postsPerPage - 1);

  if (q) {
    query.or(`nama.ilike.%${q}%, bidang_usaha.ilike.%${q}%`);
  }

  if (user_ids.length > 0) {
    query.in("user_id", user_ids);
  }

  console.log("lalalala", user_ids);

  const { data, count, error } = await query;

  if (error) {
    return {
      rows: [],
      totalPages: 0,
      message: error.message,
    };
  }

  const totalPages = count ? Math.ceil(count / postsPerPage) : 0;

  return {
    rows: data as Pelanggan[],
    totalPages,
    message: "success",
  };
}
