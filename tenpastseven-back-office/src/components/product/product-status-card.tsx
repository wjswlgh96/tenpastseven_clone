"use client";

import styles from "./product-status-card.module.css";

import Card from "../atoms/card";
import MenuTitle from "../atoms/menu-title";
import SubTitle from "../atoms/subtitle";
import Link from "next/link";

interface Props {
  productLength: number;
}

export default function ProductStatusCard({ productLength }: Props) {
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
          <SubTitle>품절 상품</SubTitle>
          <div className={styles.quantity_wrap}>
            <Link href="/product/soldout" className={styles.red_text}>
              {productLength}
            </Link>
            <span>개</span>
          </div>
        </Card>
      </div>
    </Card>
  );
}
