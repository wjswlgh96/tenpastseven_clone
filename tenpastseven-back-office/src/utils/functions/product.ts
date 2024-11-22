import { ProductType, ProductSaleStatus } from "@shared/types";

export const filterProductsBySaleStatus = (
  products: ProductType[] | null,
  status: ProductSaleStatus
) => {
  if (!products || status === "all") return products;

  return products.filter((product) => {
    switch (status) {
      case "is_sale":
        return product.is_sale;
      case "none_sale":
        return !product.is_sale;
      case "sold_out":
        return product.is_sold_out;
      default:
        return true;
    }
  });
};
