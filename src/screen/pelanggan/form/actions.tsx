"use server";

import { CUSTOMER_TABLE, OPERATOR_TABLE } from "@/constants/tables";
import { createClient } from "@/lib/supabase/server";

import * as z from "zod";
import { formSchema } from "./form";

export async function AddNewPelanggan(
  payload: z.infer<typeof formSchema>
): Promise<{
  error?: boolean;
  message: string;
}> {
  const supabase = await createClient();

  let fileLink = "";
  if (payload.logo) {
    const base64Data = payload?.logo?.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const fileName = `${Math.random()}.png`;
    const filePath = `logos/${payload.name
      ?.toLowerCase()
      ?.replace(/\s/g, "")}/${fileName}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, buffer, {
        contentType: "image/png",
      });

    fileLink = `${process.env.NEXT_PUBLIC_IMAGES_EVENT_URL}/${filePath}`;
    if (error) {
      return {
        message: error?.message,
        error: true,
      };
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: operator } = await supabase
    .from(OPERATOR_TABLE)
    .select("name, id")
    .eq("user_id", user?.id)
    .single();

  const payloadInsert = {
    province_id: payload.province,
    city_id: payload.city,
    user_id: operator?.id,
    nama: payload.name,
    bidang_usaha: payload.business,
    is_active: true,
    logo: fileLink,
    alamat: payload.address,
    created_by: operator?.name,
    updated_by: operator?.name,
  };

  const { error } = await supabase.from(CUSTOMER_TABLE).insert(payloadInsert);

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
