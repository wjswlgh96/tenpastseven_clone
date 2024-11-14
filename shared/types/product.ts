import { Database } from "./supabase-extensions";

export type ProductImage = {
  small_url: string;
  medium_url: string;
  large_url: string;
};

export type SizeType = "S" | "M" | "L";
export type ProductionOption = {
  size: SizeType;
  stock: number;
};

export type ProductTypes = Database["public"]["Tables"]["products"]["Row"];
