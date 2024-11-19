"use client";

import styles from "./product-list-template.module.css";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getOptionalProducts } from "@/actions/products";
import { filterProductsBySaleStatus } from "@/utils/functions/product";
import { ProductSaleStatus, SortOrderType } from "@shared/types";

import ProductContainer from "@/components/atoms/containers/product-container";
import LoadingScreen from "@/components/molecules/feedback/loading-screen";
import ProductQuantity from "@/components/organisms/product/list/product-quantity";
import ProductSearch from "@/components/organisms/product/list/product-search";
import ProductList from "@/components/organisms/product/list/product-list";

export default function ProductListTemplate() {
  const searchParams = useSearchParams();
  const getQ = searchParams.get("q") as ProductSaleStatus;

  const [search, setSearch] = useState("");
  const [saleStatus, setSaleStatus] = useState<ProductSaleStatus>(
    getQ ?? "all"
  );
  const [sortOrder, setSortOrder] = useState<SortOrderType>("created_at_a");

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products", { sortOrder, saleStatus }],
    queryFn: async () => {
      const isAscending = sortOrder.slice(-1) === "a" ? true : false;
      const sortKey = sortOrder.slice(0, -2);

      const { data, success } = await getOptionalProducts({
        search,
        sortOrder: sortKey,
        isAscending,
      });

      if (success) {
        return filterProductsBySaleStatus(data, saleStatus);
      }
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
    <ProductContainer>
      {isLoading && <LoadingScreen />}
      {products && (
        <div className={styles.section_wrap}>
          <ProductQuantity setSaleStatus={setSaleStatus} />
          <ProductSearch
            search={search}
            onChangeSearch={onChangeSearch}
            onEraseSearch={onEraseSearch}
            onSubmitSearch={onSubmitSearch}
            isLoading={isLoading}
          />
          <ProductList
            products={products}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            saleStatus={saleStatus}
            setSaleStatus={setSaleStatus}
          />
        </div>
      )}
    </ProductContainer>
  );
}
