"use client";

import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
// 2. 외부 라이브러리
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { QUANTITY_ITEMS } from "@/constant/product";
import { ProductType, ProductSaleStatus } from "@shared/types";

import { getAllProducts } from "@/actions/products";

import Button from "@/components/atoms/buttons/button";
import Card from "@/components/atoms/containers/card";
import MainTitle from "@/components/atoms/typography/main-title";

import styles from "./product-quantity.module.css";

interface Props {
  setSaleStatus: Dispatch<SetStateAction<ProductSaleStatus>>;
}

export default function ProductQuantity({ setSaleStatus }: Props) {
  const { data: products } = useQuery({
    queryKey: ["products", "length"],
    queryFn: async () => {
      const { products, error } = await getAllProducts();
      if (error) {
        toast.error(error);
        return null;
      }

      return products;
    },
  });

  const getQuantity = (
    products: ProductType[] | null,
    value: ProductSaleStatus
  ) => {
    if (!products) return 0;

    switch (value) {
      case "all":
        return products.length;
      case "is_sale":
        return products.filter((product) => product.is_sale).length;
      case "none_sale":
        return products.filter((product) => !product.is_sale).length;
      case "sold_out":
        return products.filter((product) => product.is_sold_out).length;
    }
  };

  return (
    <section>
      <MainTitle>상품 목록</MainTitle>
      <Card className={styles.card}>
        <ul>
          {products &&
            QUANTITY_ITEMS.map(({ label, value, isRed }) => (
              <li key={value}>
                {label}{" "}
                <span
                  className={isRed ? "red_text" : "blue_text"}
                  style={{ textDecorationThickness: 2 }}
                  onClick={() => setSaleStatus(value)}
                >
                  {getQuantity(products, value)}
                </span>
                건
              </li>
            ))}
        </ul>
        <Button>
          <Link href={"/product/editor"}>상품등록</Link>
        </Button>
      </Card>
    </section>
  );
}
