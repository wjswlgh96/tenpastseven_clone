import { Database } from "./supabase-extensions";

export type UserType = Database["public"]["Tables"]["userinfo"]["Row"];
