"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { ProductType } from "@shared/types";
import { DefaultResponse } from "./type";
import {
  formatExistingProductData,
  formatNewProductData,
} from "@/utils/functions/format";

interface ProductsResponse {
  products: ProductType[] | null;
  error: string | null;
}

export async function getAllProducts(): Promise<ProductsResponse> {
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
}): Promise<ProductsResponse> {
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

export async function upsertProducts({ data }: { data: Partial<ProductType> }) {
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
  idList: number[],
  updateData: Partial<ProductType>
): Promise<DefaultResponse> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("products")
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .in("id", idList);

  if (error) {
    return { data: null, error: error.message };
  }

  return {
    data: "판매상태가 성공적으로 업데이트 되었습니다",
    error: null,
  };
}

export async function deleteSelectedProducts(
  idList: number[]
): Promise<DefaultResponse> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("products").delete().in("id", idList);

  if (error) {
    return { data: null, error: error.message };
  }

  return {
    data: "선택한 상품이 성공적으로 삭제되었습니다",
    error: null,
  };
}
