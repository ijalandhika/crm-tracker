"use server";

const pelangganMenu = {
  title: "Pelanggan",
  url: "#",
  items: [
    {
      title: "Kelola Pelanggan",
      url: "/dashboard/pelanggan",
    },
  ],
};

import { ROLE_ADMIN, ROLE_TEAM_LEADER } from "@/constants/role";
import { OPERATOR_TABLE } from "@/constants/tables";
import { createClient } from "@/lib/supabase/server";

export async function GenerateMenu() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from(OPERATOR_TABLE)
    .select("roles")
    .eq("user_id", user?.id)
    .single();

  if (error) {
    return {
      navMain: [pelangganMenu],
    };
  }

  if ([ROLE_TEAM_LEADER, ROLE_ADMIN].indexOf(data?.roles) > -1) {
    pelangganMenu.items.push({
      title: "Assign Pelanggan",
      url: "/dashboard/assign",
    });

    return {
      navMain: [pelangganMenu],
    };
  }

  // menu untuk sales

  return {
    navMain: [pelangganMenu],
  };
}
