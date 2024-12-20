"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";

import { MessageResponse } from "./type";
import { ProductMainImages, ProductType } from "@shared/types";
import { formatProductData } from "@/utils/functions/format";
import mapSupabaseError from "@/utils/supabase/errorMessage";
import { DetailImagesData, MainImagesFormData } from "@/utils/recoil/atoms";

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

interface GetOptionalProductsResponse {
  success: boolean;
  data: ProductType[];
  nextPage: number | undefined;
  hasMore: boolean;
}

export async function getOptionalProducts({
  search,
  isAscending,
  sortOrder,
  pageParam,
}: {
  search: string;
  isAscending: boolean;
  sortOrder: string;
  pageParam: number;
}): Promise<GetOptionalProductsResponse> {
  const supabase = await createServerSupabaseClient();
  const limit = 10;
  const offset = pageParam * limit;

  const { data, error, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .ilike("name", `%${search}%`)
    .order(sortOrder, { ascending: isAscending })
    .range(offset, offset + limit - 1);

  if (error || count === null) {
    const message = mapSupabaseError(error);
    throw new Error(message);
  }

  return {
    success: true,
    data,
    nextPage: offset + limit < count ? pageParam + 1 : undefined,
    hasMore: offset + limit < count,
  };
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

  console.log(data.updated_at);

  return {
    success: true,
    message: data.updated_at
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
  detailImagesData,
}: {
  id: string;
  detailImagesData: DetailImagesData[];
}) {
  const supabase = await createServerSupabaseClient();
  const reform = detailImagesData.map((data, index) => {
    if (data.image_form_data) {
      return {
        index,
        file: data.image_form_data!.get("file"),
      };
    }
  });

  const files = reform.filter((data) => data !== undefined);

  const urls: string[] = detailImagesData.map((data) => data.image_url);

  if (!files) {
    throw new Error("이미지를 찾을 수 없습니다");
  }

  const filesPromises = files.map(async (fileData) => {
    if (!fileData) {
      return;
    }

    const fileName = v4();
    const { error } = await supabase.storage
      .from("tenpastseven")
      .upload(`products/${id}/detail_images/${fileName}`, fileData.file!);

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
    urls[fileData.index] = imageUrl;
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

export const deleteAllProductDetailImages = async ({ id }: { id: string }) => {
  const supabase = await createServerSupabaseClient();
  const path = `products/${id}/detail_images/`;

  const { data: files, error: listError } = await supabase.storage
    .from("tenpastseven")
    .list(path);

  if (listError) {
    const message = mapSupabaseError(listError);
    throw new Error(message);
  }

  if (files && files.length > 0) {
    const filesToDelete = files.map((file) => `${path}${file.name}`);

    const { error: deleteError } = await supabase.storage
      .from("tenpastseven")
      .remove(filesToDelete);

    if (deleteError) {
      const message = mapSupabaseError(deleteError);
      throw new Error(message);
    }
  }

  return {
    success: true,
    message: "이미지가 성공적으로 삭제되었습니다",
  };
};
