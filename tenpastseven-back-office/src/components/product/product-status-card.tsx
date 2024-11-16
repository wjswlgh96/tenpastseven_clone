"use client";

import styles from "./product-status-card.module.css";

import Card from "../_atoms/card";
import MenuTitle from "../_atoms/menu-title";
import SubTitle from "../_atoms/subtitle";
import Link from "next/link";

interface Props {
  productLength: number;
  isSaleLength: number;
  soldOutLength: number;
}

export default function ProductStatusCard({
  productLength,
  isSaleLength,
  soldOutLength,
}: Props) {
  return (
    <Card>
      <div className={styles.title_wrap}>
        <MenuTitle>상품 현황</MenuTitle>
        <Link href="/product/list" className={styles.list_link}>
          상품목록 바로가기
        </Link>
      </div>
      <div className={styles.card_grid}>
        <Card
          className={styles.grid_card_list}
          bgColor="#F5F8FF"
          shadow={false}
        >
          <SubTitle>전체 등록 상품</SubTitle>
          <div className={styles.quantity_wrap}>
            <Link href="/product/list" className={styles.blue_text}>
              {productLength}
            </Link>
            <span>개</span>
          </div>
        </Card>
        <Card
          className={styles.grid_card_list}
          bgColor="#F1f1f1"
          shadow={false}
        >
          <SubTitle>판매 중인 상품</SubTitle>
          <div className={styles.quantity_wrap}>
            <Link href="/product/list?q=is_sale" className={styles.blue_text}>
              {isSaleLength}
            </Link>
            <span>개</span>
          </div>
        </Card>
        <Card
          className={styles.grid_card_list}
          bgColor="#F1f1f1"
          shadow={false}
        >
          <SubTitle>판매 중이지 않은 상품</SubTitle>
          <div className={styles.quantity_wrap}>
            <Link href="/product/list?q=none_sale" className={styles.red_text}>
              {productLength - isSaleLength}
            </Link>
            <span>개</span>
          </div>
        </Card>
        <Card
          className={styles.grid_card_list}
          bgColor="#F1f1f1"
          shadow={false}
        >
          <SubTitle>품절 상품</SubTitle>
          <div className={styles.quantity_wrap}>
            <Link href="/product/soldout" className={styles.red_text}>
              {soldOutLength}
            </Link>
            <span>개</span>
          </div>
        </Card>
      </div>
    </Card>
  );
}
