"use client";

import styles from "./quantity-section.module.css";

import Button from "@/components/_atoms/button";
import Card from "@/components/_atoms/card";
import MainTitle from "@/components/_atoms/main-title";
import { Dispatch, SetStateAction } from "react";
import { saleSelectType } from "./ui";
import Link from "next/link";

interface Props {
  allLength: number;
  saleLength: number;
  noneSaleLength: number;
  setIsSaleSelect: Dispatch<SetStateAction<saleSelectType>>;
}

export default function QuantitySection({
  allLength,
  saleLength,
  noneSaleLength,
  setIsSaleSelect,
}: Props) {
  return (
    <section>
      <MainTitle>상품 목록</MainTitle>
      <Card className={styles.card}>
        <ul>
          <li>
            전체 <span onClick={() => setIsSaleSelect("all")}>{allLength}</span>
            건
          </li>
          <li>
            판매함{" "}
            <span onClick={() => setIsSaleSelect("is_sale")}>{saleLength}</span>
            건
          </li>
          <li>
            판매안함{" "}
            <span
              className={styles.red_text}
              onClick={() => setIsSaleSelect("none_sale")}
            >
              {noneSaleLength}
            </span>
            건
          </li>
        </ul>
        <Button>
          <Link href={"/product/editor"}>상품등록</Link>
        </Button>
      </Card>
    </section>
  );
}
