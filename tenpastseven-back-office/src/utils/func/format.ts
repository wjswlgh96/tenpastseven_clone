import { ProductTypes } from "@shared/types";

export function formatPrice(price: number) {
  return new Intl.NumberFormat("ko-KR").format(price);
}

export function formatNewProductData(
  data: Partial<ProductTypes>
): Omit<ProductTypes, "id"> {
  return {
    name: data.name ?? "",
    price: data.price ?? 0,
    description: data.description ?? null,
    detail_images: data.detail_images ?? null,
    is_sale: data.is_sale ?? null,
    main_images: data.main_images ?? null,
    options: data.options ?? null,
    sale_price: data.sale_price ?? null,
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: data.updated_at ?? null,
  };
}

export function formatExistingProductData(
  data: Partial<ProductTypes>
): ProductTypes {
  if (!data.id) {
    throw new Error("업데이트하려면 ID가 필요합니다.");
  }

  return {
    id: data.id,
    name: data.name ?? "",
    price: data.price ?? 0,
    description: data.description ?? null,
    detail_images: data.detail_images ?? null,
    is_sale: data.is_sale ?? null,
    main_images: data.main_images ?? null,
    options: data.options ?? null,
    sale_price: data.sale_price ?? null,
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
