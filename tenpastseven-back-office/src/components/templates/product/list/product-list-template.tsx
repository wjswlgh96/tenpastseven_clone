"use client";

import styles from "./product-list-template.module.css";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { getOptionalProducts } from "@/actions/products";
import { filterProductsBySaleStatus } from "@/utils/functions/product";
import { ProductSaleStatus, SortOrderType } from "@shared/types";

import ProductContainer from "@/components/atoms/containers/product-container";
import LoadingScreen from "@/components/molecules/feedback/loading-screen";
import ProductQuantity from "@/components/organisms/product/list/product-quantity";
import ProductSearch from "@/components/organisms/product/list/product-search";
import ProductList from "@/components/organisms/product/list/product-list";
import Spinner from "@/components/atoms/feedback/spinner";

export default function ProductListTemplate() {
  const searchParams = useSearchParams();
  const getQ = searchParams.get("q") as ProductSaleStatus;

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const [search, setSearch] = useState("");
  const [saleStatus, setSaleStatus] = useState<ProductSaleStatus>(
    getQ ?? "all"
  );
  const [sortOrder, setSortOrder] = useState<SortOrderType>("created_at_a");

  const {
    data: products,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", { sortOrder, saleStatus }],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const isAscending = sortOrder.slice(-1) === "a";
      const sortKey = sortOrder.slice(0, -2);

      const { data, success, nextPage, hasMore } = await getOptionalProducts({
        search,
        isAscending,
        sortOrder: sortKey,
        pageParam,
      });

      if (!success) {
        throw new Error("데이터를 가져오는 중 오류가 발생했습니다.");
      }

      return {
        data: filterProductsBySaleStatus(data, saleStatus),
        nextPage,
        hasMore,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.nextPage ? lastPage.nextPage : undefined,
    initialPageParam: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage]);

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
            products={products?.pages.flatMap((page) => page.data ?? []) ?? []}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            saleStatus={saleStatus}
            setSaleStatus={setSaleStatus}
          />
          {isFetchingNextPage ? <Spinner size="50px" /> : <div ref={ref} />}
        </div>
      )}
    </ProductContainer>
  );
}
