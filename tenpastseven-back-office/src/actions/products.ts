"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { ProductTypes } from "@shared/types";

export type ProductsResponse = {
  products: ProductTypes[] | null;
  error: string | null;
};

export async function getProducts(
  search: string = "",
  sortOrder?: string | undefined
): Promise<ProductsResponse> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .like("name", `%${search}%`)
    .order(sortOrder || "created_at", { ascending: true });

  if (error) {
    return { products: null, error: error.message };
  }

  return { products: data, error: null };
}
