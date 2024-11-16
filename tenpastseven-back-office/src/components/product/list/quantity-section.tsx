"use client";

import styles from "./quantity-section.module.css";

import Button from "@/components/_atoms/button";
import Card from "@/components/_atoms/card";
import MainTitle from "@/components/_atoms/main-title";
import { Dispatch, SetStateAction } from "react";
import { saleSelectType } from "./ui";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/actions/products";
import { toast } from "react-toastify";

interface Props {
  setIsSaleSelect: Dispatch<SetStateAction<saleSelectType>>;
}

export default function QuantitySection({ setIsSaleSelect }: Props) {
  const { data } = useQuery({
    queryKey: ["products", "length"],
    queryFn: async () => {
      const { products, error } = await getAllProducts();
      if (error) {
        toast.error(error);
        return;
      }

      return products;
    },
  });

  return (
    <section>
      <MainTitle>상품 목록</MainTitle>
      <Card className={styles.card}>
        <ul>
          {data && (
            <>
              <li>
                전체{" "}
                <span onClick={() => setIsSaleSelect("all")}>
                  {data.length}
                </span>
                건
              </li>
              <li>
                판매함{" "}
                <span onClick={() => setIsSaleSelect("is_sale")}>
                  {data.filter((product) => product.is_sale).length}
                </span>
                건
              </li>
              <li>
                판매안함{" "}
                <span
                  className={styles.red_text}
                  onClick={() => setIsSaleSelect("none_sale")}
                >
                  {data.filter((product) => !product.is_sale).length}
                </span>
                건
              </li>
            </>
          )}
        </ul>
        <Button>
          <Link href={"/product/editor"}>상품등록</Link>
        </Button>
      </Card>
    </section>
  );
}
