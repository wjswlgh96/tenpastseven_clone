"use client";

import styles from "./product-list-section.module.css";

import { ProductTypes } from "@shared/types";

import Card from "@/components/atoms/card";
import MenuTitle from "@/components/atoms/menu-title";
import { Dispatch, SetStateAction } from "react";
import Select from "@/components/atoms/select";
import Button from "@/components/atoms/button";
import ProductListItem from "./product-list-item";

interface Props {
  products: ProductTypes[];
  sortOrder: string;
  setSortOrder: Dispatch<SetStateAction<string>>;
}

export default function ProductListSection({
  products,
  sortOrder,
  setSortOrder,
}: Props) {
  return (
    <section>
      <MenuTitle>상품 목록</MenuTitle>
      <Card>
        <div className={styles.top_wrap}>
          <p>
            총 <span>{products.length}</span>개
          </p>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="created_at">등록일 순</option>
            <option value="name">상품명 순</option>
            <option value="price">판매가 순</option>
          </Select>
        </div>
        <div className={styles.button_list_wrap}>
          <div className={styles.button_left_wrap}>
            <Button buttonType="option">판매함</Button>
            <Button buttonType="option">판매안함</Button>
            <Button buttonType="delete">삭제</Button>
          </div>
          <div>
            <Button>상품등록</Button>
          </div>
        </div>
        <div className={styles.table_header_wrap}>
          <div>
            <input type="checkbox" />
          </div>
          <div>No</div>
          <div>상품정보</div>
          <div>판매가</div>
          <div>할인가</div>
        </div>
        {products.map((product) => (
          <ProductListItem key={product.id} product={product} />
        ))}
      </Card>
    </section>
  );
}
