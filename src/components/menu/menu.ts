"use server";

import { menuSales, menuTeamLeader, menuAdmin } from "./consts";

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
      navMain: [menuSales],
    };
  }

  if (data?.roles === ROLE_TEAM_LEADER) {
    return {
      navMain: [menuTeamLeader],
    };
  }

  if (data?.roles === ROLE_ADMIN) {
    return {
      navMain: [menuAdmin],
    };
  }

  // menu untuk sales
  return {
    navMain: [menuSales],
  };
}
