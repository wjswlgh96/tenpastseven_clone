"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { ProductTypes } from "@shared/types";
import { defaultResponseType } from "./type";

type getProductsResponse = {
  products: ProductTypes[] | null;
  error: string | null;
};

export async function getProducts(
  search: string = "",
  sortOrder?: string | undefined
): Promise<getProductsResponse> {
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

export async function updateSelectedProducts(
  id_list: number[],
  updateData: Partial<ProductTypes>
): Promise<defaultResponseType> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("products")
    .update(updateData)
    .in("id", id_list);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: "업데이트가 성공적으로 이루어졌습니다", error: null };
}

export async function deleteSelectedProduts(
  id_list: number[]
): Promise<defaultResponseType> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("products").delete().in("id", id_list);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: "삭제 성공!!", error: null };
}
