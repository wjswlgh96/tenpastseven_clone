import { ProductType } from "@shared/types";

import { v4 } from "uuid";

export function formatPrice(price: number) {
  return new Intl.NumberFormat("ko-KR").format(price);
}

export function formatProductData(data: Partial<ProductType>): ProductType {
  const is_sold_out = data.options
    ? Object.values(data.options).every((stock) => stock === 0)
    : true;

  return {
    id: data.id ?? v4(),
    name: data.name ?? "",
    price: data.price ?? 0,
    description: data.description ?? null,
    detail_images: data.detail_images ?? [],
    is_sale: data.is_sale ?? false,
    is_sold_out: is_sold_out,
    main_images: data.main_images ?? {
      main_url: "",
      list_url_01: "",
      list_url_02: "",
    },
    options: data.options ?? {},
    sale_price: data.sale_price ?? null,
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: data.updated_at ?? null,
  };
}
