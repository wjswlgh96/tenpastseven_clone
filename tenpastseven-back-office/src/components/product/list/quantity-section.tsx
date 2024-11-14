"use client";

import styles from "./quantity-section.module.css";

import Button from "@/components/atoms/button";
import Card from "@/components/atoms/card";
import MainTitle from "@/components/atoms/main-title";

interface Props {
  allLength: number;
  saleLength: number;
  noneSaleLength: number;
}

export default function QuantitySection({
  allLength,
  saleLength,
  noneSaleLength,
}: Props) {
  return (
    <section>
      <MainTitle>상품 목록</MainTitle>
      <Card className={styles.card}>
        <ul>
          <li>
            전체 <span>{allLength}</span>건
          </li>
          <li>
            판매함 <span>{saleLength}</span>건
          </li>
          <li>
            판매안함 <span>{noneSaleLength}</span>건
          </li>
        </ul>
        <Button onClick={() => {}}>상품등록</Button>
      </Card>
    </section>
  );
}
