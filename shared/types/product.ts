import { Database } from "./supabase-extensions";
import { SORT_OPTIONS } from "../../tenpastseven-back-office/src/constant/product";

export type ProductSaleStatus = "all" | "is_sale" | "none_sale" | "sold_out";

export type SortOrderType = keyof typeof SORT_OPTIONS;
export type ButtonActionType = "is_sale_true" | "is_sale_false" | "";

export type ProductMainImages = {
  main_url: string;
  list_url_01: string;
  list_url_02: string;
};

export type SizeType = "S" | "M" | "L";
export type ProductOption = Partial<Record<SizeType, number>>;

export type ProductType = Database["public"]["Tables"]["products"]["Row"];

export interface ProductEditorState {
  id: string;
  name: string;
  description: string | null;
  price: number;
  options: ProductOption;
  main_images: ProductMainImages;
  detail_images: string[];
  is_sale: boolean;
  sale_price: number | null;
  created_at: string;
}

export interface ProductOptionCheck {
  S: boolean;
  M: boolean;
  L: boolean;
}
