"use server";

import { ROLE_SALES, ROLE_TEAM_LEADER } from "@/constants/role";
import { OPERATOR_TABLE } from "@/constants/tables";
import { createClient } from "@/lib/supabase/server";
import type { ROLES } from "@/types/roles";

export const getUserRoles = async (): Promise<{
  role?: ROLES;
  user_id?: string;
  error?: string;
}> => {
  const supabase = await createClient();

  // get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userRole, error } = await supabase
    .from(OPERATOR_TABLE)
    .select(`roles, parent_user_id, id`)
    .eq("user_id", user?.id)
    .single();

  if (error) {
    return {
      error: error.message,
    };
  }

  const { roles } = userRole as {
    roles: ROLES;
  };

  return {
    role: roles,
    user_id: user?.id,
  };
};

export const getUserGroup = async (): Promise<{
  user_ids: string[];
  error?: string;
}> => {
  const supabase = await createClient();

  // get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userRole, error } = await supabase
    .from(OPERATOR_TABLE)
    .select(`roles, parent_user_id, id`)
    .eq("user_id", user?.id)
    .single();

  if (error) {
    return {
      error: error.message,
      user_ids: [],
    };
  }

  const { roles } = userRole as {
    roles: ROLES;
  };

  if (roles === ROLE_SALES) {
    return {
      user_ids: [userRole?.id ?? ""],
    };
  }

  if (roles === ROLE_TEAM_LEADER) {
    const { data: groupUser } = await supabase
      .from(OPERATOR_TABLE)
      .select("id")
      .eq("parent_user_id", user?.id);

    return {
      user_ids: groupUser?.map((user) => user.id) || [],
    };
  }

  // this is admin role, means select all
  return {
    user_ids: [],
  };
};
