"use client";

import { getAllProducts, getOptionalProducts } from "@/actions/products";

import styles from "./ui.module.css";

import QuantitySection from "./quantity-section";
import SearchSection from "./search-section";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import ProductListSection from "./product-list-section";
import { useSearchParams } from "next/navigation";
import LoadingScreen from "@/components/_molecules/loading-screen";

export type saleSelectType = "all" | "is_sale" | "none_sale";

export default function ProductListUI() {
  const searchParams = useSearchParams();
  const getQ = searchParams.get("q") as saleSelectType;
  const [search, setSearch] = useState<string>("");

  const [isSaleSelect, setIsSaleSelect] = useState<saleSelectType>(
    getQ ? getQ : "all"
  );
  const [sortOrder, setSortOrder] = useState<string>("created_at_a");

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products", "search", sortOrder, isSaleSelect],
    queryFn: async () => {
      const isAscending = sortOrder.slice(-1) === "a" ? true : false;
      const sortKey = sortOrder.slice(0, -2);

      const { products, error } = await getOptionalProducts({
        search,
        sortOrder: sortKey,
        isAscending,
      });

      if (error) {
        toast.error(error);
      }

      if (isSaleSelect === "all") {
        return products;
      } else {
        const filteredProducts = products?.filter((product) => {
          if (isSaleSelect === "is_sale") {
            return product.is_sale;
          } else {
            return !product.is_sale;
          }
        });

        return filteredProducts;
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
    <>
      {isLoading && <LoadingScreen />}
      {products && (
        <div className={styles.section_wrap}>
          <QuantitySection setIsSaleSelect={setIsSaleSelect} />
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
            isSaleSelect={isSaleSelect}
            setIsSaleSelect={setIsSaleSelect}
          />
        </div>
      )}
    </>
  );
}
