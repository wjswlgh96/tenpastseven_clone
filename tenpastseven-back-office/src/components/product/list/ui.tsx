"use client";

import { getProducts } from "@/actions/products";

import styles from "./ui.module.css";

import QuantitySection from "./quantity-section";
import SearchSection from "./search-section";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import ProductListSection from "./product-list-section";

interface Props {
  allLength: number;
  saleLength: number;
  noneSaleLength: number;
}

export default function ProductListUI({
  allLength,
  saleLength,
  noneSaleLength,
}: Props) {
  const [search, setSearch] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("created_at");

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["searchProduct", sortOrder],
    queryFn: async () => {
      const { products, error } = await getProducts(search, sortOrder);

      if (error) {
        toast.error(error);
      }

      return products;
    },
  });

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onEraseSearch = () => {
    setSearch("");
  };

  const onSubmitSearch = (e: FormEvent) => {
    e.preventDefault();
    refetch();
  };

  return (
    <>
      {products && (
        <div className={styles.section_wrap}>
          <QuantitySection
            allLength={allLength}
            saleLength={saleLength}
            noneSaleLength={noneSaleLength}
          />
          <SearchSection
            search={search}
            onChangeSearch={onChangeSearch}
            onEraseSearch={onEraseSearch}
            onSubmitSearch={onSubmitSearch}
            isLoading={isLoading}
          />
          <ProductListSection
            products={products}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>
      )}
    </>
  );
}
