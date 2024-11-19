"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

import { MessageResponse } from "./type";
import { ProductImage, ProductType } from "@shared/types";
import { formatProductData } from "@/utils/functions/format";
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
  const payload = formatProductData(data);

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
  idList: string[],
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
  idList: string[]
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

interface UploadProductMainImageResponse extends MessageResponse {
  data: {
    url: string;
  };
}
export async function uploadProductMainImage({
  id,
  key,
  formData,
}: {
  id: string;
  key: keyof ProductImage;
  formData: FormData;
}): Promise<UploadProductMainImageResponse> {
  const supabase = await createServerSupabaseClient();
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("이미지를 찾을 수 없습니다");
  }

  const { error } = await supabase.storage
    .from("tenpastseven")
    .upload(`products/${id}/main_images/${key}`, file, {
      upsert: true,
      cacheControl: "no-cache",
    });

  if (error) {
    const message = mapSupabaseError(error);
    throw new Error(message);
  }

  const {
    data: { publicUrl },
  } = await supabase.storage
    .from("tenpastseven")
    .getPublicUrl(`products/${id}/main_images/${key}`);

  const imageUrl = `${publicUrl}?t=${Date.now()}`;

  return {
    success: true,
    message: "이미지가 성공적으로 업로드 되었습니다",
    data: {
      url: imageUrl,
    },
  };
}
