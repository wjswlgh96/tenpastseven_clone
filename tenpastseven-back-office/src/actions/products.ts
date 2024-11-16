"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { ProductTypes } from "@shared/types";
import { defaultResponseType } from "./type";
import {
  formatExistingProductData,
  formatNewProductData,
} from "@/utils/func/format";

type getProductsResponse = {
  products: ProductTypes[] | null;
  error: string | null;
};

export async function getAllProducts(): Promise<getProductsResponse> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    return { products: null, error: error.message };
  }

  return { products: data, error: null };
}

export async function getProduct(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function getOptionalProducts({
  search,
  isAscending,
  sortOrder,
}: {
  search: string;
  isAscending: boolean;
  sortOrder: string;
}): Promise<getProductsResponse> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .like("name", `%${search}%`)
    .order(sortOrder, { ascending: isAscending });

  if (error) {
    return { products: null, error: error.message };
  }

  return { products: data, error: null };
}

export async function upsertProducts({
  data,
}: {
  data: Partial<ProductTypes>;
}) {
  const payload = data.id
    ? formatExistingProductData(data)
    : formatNewProductData(data);

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("products").upsert(payload);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: "업데이트 성공", error: null };
}

export async function updateSelectedProductsIsSaleState(
  id_list: number[],
  updateData: Partial<ProductTypes>
): Promise<defaultResponseType> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("products")
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .in("id", id_list);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: "판매상태가 성공적으로 업데이트 되었습니다", error: null };
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
