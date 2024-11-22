"use client";

import { ChangeEventHandler, FormEventHandler } from "react";

import Card from "@/components/atoms/containers/card";
import Input from "@/components/atoms/inputs/input";
import MenuTitle from "@/components/atoms/typography/menu-title";
import Button from "@/components/atoms/buttons/button";

import styles from "./product-search.module.css";

interface ProductSearchProps {
  search: string;
  onChangeSearch: ChangeEventHandler<HTMLInputElement>;
  onEraseSearch: () => void;
  onSubmitSearch: FormEventHandler<HTMLFormElement>;
  isLoading: boolean;
}

export default function ProductSearch({
  search,
  onChangeSearch,
  onEraseSearch,
  onSubmitSearch,
  isLoading,
}: ProductSearchProps) {
  return (
    <section>
      <Card>
        <form onSubmit={onSubmitSearch} className={styles.search_wrap}>
          <MenuTitle className={styles.title}>상품 검색</MenuTitle>
          <Input
            placeholder="상품 이름을 입력해주세요."
            value={search}
            onChange={onChangeSearch}
            containerClassName={styles.input_container}
            className={styles.search_input}
            handleEraseButton={onEraseSearch}
          />
          <Button
            className={styles.search_button}
            loading={isLoading}
            disabled={isLoading}
          >
            검색하기
          </Button>
        </form>
      </Card>
    </section>
  );
}
