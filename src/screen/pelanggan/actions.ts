"use server";

import {
  PROVINCE_TABLE,
  CITY_TABLE,
  CUSTOMER_TABLE,
  OPERATOR_TABLE,
} from "@/constants/tables";
import { createClient } from "@/lib/supabase/server";
import { Pelanggan, List } from "./types";
import { getUserGroup, getUserRoles } from "@/lib/supabase/roles";
import type { PostgrestError } from "@supabase/supabase-js";
import { ROLE_ADMIN, ROLE_SALES, ROLE_TEAM_LEADER } from "@/constants/role";

interface ListArea extends List {
  error?: PostgrestError;
}

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

export async function GetSales() {
  const { role, user_id } = await getUserRoles();

  const supabase = await createClient();

  if (!role || role === ROLE_SALES) {
    return [];
  }

  const query = supabase
    .from(OPERATOR_TABLE)
    .select(`id, name, user_id, parent_user_id`);

  if ([ROLE_TEAM_LEADER, ROLE_ADMIN].indexOf(role) > -1) {
    query.eq("roles", "sales");
  }

  if (role === ROLE_TEAM_LEADER) {
    query.eq("parent_user_id", user_id);
  }

  const { data, error } = await query;

  if (error) {
    return [];
  }

  return data;
}

export async function GetProvinces(): Promise<ListArea> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(PROVINCE_TABLE)
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    return {
      rows: [],
      error,
      message: error.message,
    };
  }

  return {
    rows: data,
    message: "success",
  };
}

export async function GetCities(provice_id: string): Promise<ListArea> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(CITY_TABLE)
    .select("id, name")
    .eq("province_id", provice_id)
    .order("name", { ascending: true });

  if (error) {
    return {
      rows: [],
      error,
      message: error.message,
    };
  }

  return {
    rows: data,
    message: "success",
  };
}
