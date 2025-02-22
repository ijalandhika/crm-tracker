"use server";

import { CUSTOMER_TABLE } from "@/constants/tables";
import { createClient } from "@/lib/supabase/server";
import { Pelanggan } from "./types";

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

  const query = supabase
    .from(CUSTOMER_TABLE)
    .select(
      `id, nama, bidang_usaha, is_active, logo, alamat, 
       created_by, updated_by, created_at, updated_at`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range((currentPage - 1) * postsPerPage, currentPage * postsPerPage - 1);

  if (q) {
    query.or(`nama.ilike.%${q}%, bidang_usaha.ilike.%${q}%`);
  }

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
