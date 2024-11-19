"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

import { MessageResponse } from "./type";
import { ProductType } from "@shared/types";
import {
  formatExistingProductData,
  formatNewProductData,
} from "@/utils/functions/format";
import mapSupabaseError from "@/utils/supabase/errorMessage";

interface GetAllProductsResponse {
  success: boolean;
  data: ProductType[];
}
export async function getAllProducts(): Promise<GetAllProductsResponse> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    const message = mapSupabaseError(error);
    throw new Error(message);
  }

  return {
    success: true,
    data,
  };
}

interface GetProductResponse {
  success: boolean;
  data: ProductType;
}
export async function getProduct(id: string): Promise<GetProductResponse> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    const message = mapSupabaseError(error);
    throw new Error(message);
  }

  return { success: true, data };
}

export async function getOptionalProducts({
  search,
  isAscending,
  sortOrder,
}: {
  search: string;
  isAscending: boolean;
  sortOrder: string;
}): Promise<GetAllProductsResponse> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .ilike("name", `%${search}%`)
    .order(sortOrder, { ascending: isAscending });

  if (error) {
    const message = mapSupabaseError(error);
    throw new Error(message);
  }

  return { success: true, data };
}

export async function upsertProducts({
  data,
}: {
  data: Partial<ProductType>;
}): Promise<MessageResponse> {
  const payload = data.id
    ? formatExistingProductData(data)
    : formatNewProductData(data);

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("products").upsert(payload);

  if (error) {
    const message = mapSupabaseError(error);
    throw new Error(message);
  }

  return {
    success: true,
    message: data.id
      ? "상품이 성공적으로 업데이트 되었습니다"
      : "상품이 성공적으로 생성 되었습니다.",
  };
}

export async function updateSelectedProductsIsSaleState(
  idList: number[],
  updateData: Partial<ProductType>
): Promise<MessageResponse> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("products")
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .in("id", idList);

  if (error) {
    const message = mapSupabaseError(error);
    throw new Error(message);
  }

  return {
    success: true,
    message: "판매상태가 성공적으로 업데이트 되었습니다",
  };
}

export async function deleteSelectedProducts(
  idList: number[]
): Promise<MessageResponse> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("products").delete().in("id", idList);

  if (error) {
    const message = mapSupabaseError(error);
    throw new Error(message);
  }

  return {
    success: true,
    message: "선택한 상품이 성공적으로 삭제되었습니다",
  };
}
