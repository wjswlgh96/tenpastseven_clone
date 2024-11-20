"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

import { MessageResponse } from "./type";
import { ProductMainImages, ProductType } from "@shared/types";
import { formatProductData } from "@/utils/functions/format";
import mapSupabaseError from "@/utils/supabase/errorMessage";
import { MainImagesFormData } from "@/utils/recoil/atoms";

import { v4 } from "uuid";

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

  const deleteAllImages = idList.map(async (id) => {
    const directories = [
      `products/${id}/main_images/`,
      `products/${id}/detail_images/`,
    ];

    const fileDeletePromises = directories.map(async (dir) => {
      const { data: files, error: listError } = await supabase.storage
        .from("tenpastseven")
        .list(dir);

      if (listError) {
        const message = mapSupabaseError(listError);
        throw new Error(message);
      }

      if (files && files.length > 0) {
        const filesToDelete = files.map((file) => `${dir}${file.name}`);

        const { error: deleteError } = await supabase.storage
          .from("tenpastseven")
          .remove(filesToDelete);

        if (deleteError) {
          const message = mapSupabaseError(deleteError);
          throw new Error(message);
        }
      }
    });

    await Promise.all(fileDeletePromises);
  });

  await Promise.all(deleteAllImages);

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
    urls: ProductMainImages;
  };
}
export async function uploadProductMainImage({
  id,
  mainImagesUrl,
  mainImagesFormData,
}: {
  id: string;
  mainImagesUrl: ProductMainImages;
  mainImagesFormData: MainImagesFormData;
}): Promise<UploadProductMainImageResponse> {
  const supabase = await createServerSupabaseClient();
  const urls: ProductMainImages = mainImagesUrl;

  const uploadMainImages = Object.entries(mainImagesFormData).map(
    async ([key, value]) => {
      const formData = value;

      if (!formData) {
        return;
      }

      const file = formData?.get("file");

      if (!file) {
        throw new Error("파일을 찾을 수 없습니다");
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

      urls[key as keyof ProductMainImages] = `${publicUrl}?t=${Date.now()}`;
    }
  );

  await Promise.all(uploadMainImages);

  return {
    success: true,
    message: "이미지가 성공적으로 업로드 되었습니다",
    data: {
      urls,
    },
  };
}

export const deleteProductMainImage = async ({
  id,
  key,
}: {
  id: string;
  key: keyof ProductMainImages;
}) => {
  const supabase = await createServerSupabaseClient();
  const { error: deleteError } = await supabase.storage
    .from("tenpastseven")
    .remove([`products/${id}/main_images/${key}`]);

  if (deleteError) {
    const message = mapSupabaseError(deleteError);
    throw new Error(message);
  }

  return {
    success: true,
    message: "이미지가 성공적으로 삭제되었습니다",
    key,
  };
};

export async function uploadProductDetailImage({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) {
  const supabase = await createServerSupabaseClient();
  const files = formData.getAll("file") as File[];
  const urls: string[] = [];

  if (!files) {
    throw new Error("이미지를 찾을 수 없습니다");
  }

  const filesPromises = files.map(async (file) => {
    const fileName = v4();
    const { error } = await supabase.storage
      .from("tenpastseven")
      .upload(`products/${id}/detail_images/${fileName}`, file, {
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
      .getPublicUrl(`products/${id}/detail_images/${fileName}`);

    const imageUrl = `${publicUrl}?t=${Date.now()}&name=${fileName}`;
    urls.push(imageUrl);
  });

  await Promise.all(filesPromises);

  return {
    success: true,
    message: "이미지가 성공적으로 업로드 되었습니다",
    data: {
      urls,
    },
  };
}

export const deleteProductDetailImage = async ({
  id,
  url,
  index,
}: {
  id: string;
  url: string;
  index: number;
}) => {
  const supabase = await createServerSupabaseClient();

  const targetUrl = url.split("&name=")[1];

  const { error } = await supabase.storage
    .from("tenpastseven")
    .remove([`products/${id}/detail_images/${targetUrl}`]);

  if (error) {
    const message = mapSupabaseError(error);
    throw new Error(message);
  }

  return {
    success: true,
    message: "이미지가 성공적으로 삭제되었습니다",
    index,
  };
};
