"use server";

import { PROVINCE_TABLE, CITY_TABLE, CUSTOMER_TABLE } from "@/constants/tables";
import { createClient } from "@/lib/supabase/server";

import type { List } from "./types";
import type { PostgrestError } from "@supabase/supabase-js";
import * as z from "zod";
import { formSchema } from "./form";

interface ListArea extends List {
  error?: PostgrestError;
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
    const filePath = `/logos/${payload.name
      ?.toLowerCase()
      ?.replace(/\s/g, "")}/${fileName}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, buffer, {
        contentType: "image/png",
      });

    console.log("error", error);
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

  const payloadInsert = {
    user_id: user?.id,
    nama: payload.name,
    bidang_usaha: payload.business,
    logo: fileLink,
    province_id: payload.province,
    city_id: payload.city,
    alamat: payload.address,
    is_active: true,
  };

  const { error } = await supabase.from(CUSTOMER_TABLE).insert(payloadInsert);

  console.log("error insert", error);
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
