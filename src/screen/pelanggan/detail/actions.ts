"use server";
import { CUSTOMER_TABLE, OPERATOR_TABLE } from "@/constants/tables";
import { createClient } from "@/lib/supabase/server";

import * as z from "zod";
import { formSchema } from "./form";

export async function EditPelanggan(
  payload: z.infer<typeof formSchema>,
  pelanggan_id: string
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

  return {
    message: "success",
  };
}
