"use server";
import {
  CUSTOMER_CONTACT_TABLE,
  CUSTOMER_TABLE,
  OPERATOR_TABLE,
} from "@/constants/tables";
import { createClient } from "@/lib/supabase/server";

import * as z from "zod";
import { formSchema } from "./form";
import { ContactPelanggan } from "../types";

export async function GetPelangganByID(pelanggan_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CUSTOMER_TABLE)
    .select(
      `
        nama, bidang_usaha, is_active, logo, alamat, 
        provinces(id,name),
        cities(id, name),
        operators(id, name)
        `
    )
    .eq("id", pelanggan_id)
    .single();

  return {
    data,
    error,
  };
}

export async function GetKontakPelanggan(pelanggan_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CUSTOMER_CONTACT_TABLE)
    .select("id, name, email, phone, email, is_active")
    .eq("customer_id", pelanggan_id);

  if (error) {
    return [];
  }

  return data;
}

export async function EditPelanggan(
  payload: z.infer<typeof formSchema>,
  pelanggan_id: string,
  kontak?: ContactPelanggan[]
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: operator } = await supabase
    .from(OPERATOR_TABLE)
    .select("name, id")
    .eq("user_id", user?.id)
    .single();

  const payloadEdit = {
    province_id: payload.province,
    city_id: payload.city,
    nama: payload.name,
    bidang_usaha: payload.business,
    is_active: payload.is_active,
    alamat: payload.address,
    updated_by: operator?.name,
  };

  const { error } = await supabase
    .from(CUSTOMER_TABLE)
    .update(payloadEdit)
    .eq("id", pelanggan_id);

  if (error) {
    return {
      message: error.message,
      error: true,
    };
  }

  if ((kontak?.length ?? 0) > 0) {
    await supabase
      .from(CUSTOMER_CONTACT_TABLE)
      .delete()
      .eq("customer_id", pelanggan_id);

    const payloadInsert = kontak?.map((e) => ({
      customer_id: pelanggan_id,
      name: e.name,
      phone: e.phone,
      email: e.email,
      is_active: e.is_active,
      created_by: operator?.name,
      updated_by: operator?.name,
    }));

    await supabase.from(CUSTOMER_CONTACT_TABLE).insert(payloadInsert);
  }

  return {
    message: "success",
  };
}
