"use client";

import styles from "./product-status-card.module.css";

import Link from "next/link";
import Card from "@/components/atoms/containers/card";
import MenuTitle from "@/components/atoms/typography/menu-title";
import SubTitle from "@/components/atoms/typography/subtitle";
import LoadingScreen from "@/components/molecules/feedback/loading-screen";

import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/actions/products";
import { toast } from "react-toastify";
import { PRODUCT_STATUS_CARDS } from "@/constant/product";

export default function ProductStatusCard() {
  const { data, isLoading } = useQuery({
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
    <>
      {isLoading && <LoadingScreen />}
      <Card>
        <div className={styles.title_wrap}>
          <MenuTitle>상품 현황</MenuTitle>
          <Link href="/product/list" className={styles.list_link}>
            상품목록 바로가기
          </Link>
        </div>
        <div className={styles.card_grid}>
          {PRODUCT_STATUS_CARDS.map((card) => (
            <Card
              key={card.title}
              className={styles.grid_card_list}
              bgColor={card.bgColor}
              shadow={false}
            >
              <SubTitle>{card.title}</SubTitle>
              <div className={styles.quantity_wrap}>
                <Link
                  href={card.href}
                  className={`${card.textColorClass} ${styles.link_text}`}
                >
                  {card.getValue(data)}
                </Link>
                <span>개</span>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </>
  );
}
