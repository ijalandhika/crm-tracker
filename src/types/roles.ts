import { ROLE_ADMIN, ROLE_SALES, ROLE_TEAM_LEADER } from "@/constants/role";

export type ROLES =
  | typeof ROLE_ADMIN
  | typeof ROLE_TEAM_LEADER
  | typeof ROLE_SALES;
