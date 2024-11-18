import { Database } from "./supabase-extensions";

import { SORT_OPTIONS } from "@/constant/product";

export type ProductSaleStatus = "all" | "is_sale" | "none_sale" | "sold_out";

export type SortOrderType = keyof typeof SORT_OPTIONS;
export type ButtonActionType = "is_sale_true" | "is_sale_false" | "";

export type ProductImage = {
  small_url: string;
  medium_url: string;
  large_url: string;
};

export type SizeType = "S" | "M" | "L";
export type ProductionOption = Partial<Record<SizeType, number>>;

export type ProductType = Database["public"]["Tables"]["products"]["Row"];

export interface ProductEditorState {
  name: string;
  description: string | null;
  price: number;
  options: ProductionOption;
  main_images: ProductImage | null;
  detail_images: string[] | null;
  is_sale: boolean;
  sale_price: number | null;
  created_at: string;
}

export interface ProductOptionCheck {
  S: boolean;
  M: boolean;
  L: boolean;
}
