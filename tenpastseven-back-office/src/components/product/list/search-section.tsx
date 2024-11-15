"use client";

import styles from "./search-section.module.css";

import Card from "@/components/atoms/card";
import Input from "@/components/atoms/input";
import MenuTitle from "@/components/atoms/menu-title";
import { ChangeEventHandler, FormEventHandler } from "react";
import Button from "@/components/atoms/button";

interface Props {
  search: string;
  onChangeSearch: ChangeEventHandler<HTMLInputElement> | undefined;
  onEraseSearch: () => void;
  onSubmitSearch: FormEventHandler<HTMLFormElement>;
  isLoading: boolean;
}

export default function SearchSection({
  search,
  onChangeSearch,
  onEraseSearch,
  onSubmitSearch,
  isLoading,
}: Props) {
  return (
    <section>
      <Card>
        <form onSubmit={onSubmitSearch} className={styles.search_wrap}>
          <MenuTitle style={{ minWidth: "max-content" }}>상품 검색</MenuTitle>
          <Input
            placeholder="상품 이름을 입력해주세요."
            value={search}
            onChange={onChangeSearch}
            containerClassName={styles.input_container}
            className={styles.search_input}
            eraseButton={onEraseSearch}
          />
          <Button
            style={{ minWidth: "max-content" }}
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
