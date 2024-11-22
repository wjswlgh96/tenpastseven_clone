"use client";

import styles from "./product-list.module.css";
import { Dispatch, SetStateAction, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Link from "next/link";

import {
  ProductType,
  ProductSaleStatus,
  SortOrderType,
  ButtonActionType,
} from "@shared/types";
import {
  SORT_OPTIONS,
  SALE_STATUS_OPTIONS,
  TABLE_HEADERS,
} from "@/constant/product";
import {
  deleteSelectedProducts,
  updateSelectedProductsIsSaleState,
} from "@/actions/products";

import Card from "@/components/atoms/containers/card";
import MenuTitle from "@/components/atoms/typography/menu-title";
import Select from "@/components/atoms/inputs/select";
import Button from "@/components/atoms/buttons/button";
import ProductListItem from "../../../molecules/product/list/product-list-item";

interface ProductListProps {
  products: ProductType[];
  sortOrder: SortOrderType;
  setSortOrder: Dispatch<SetStateAction<SortOrderType>>;
  saleStatus: ProductSaleStatus;
  setSaleStatus: Dispatch<SetStateAction<ProductSaleStatus>>;
}

export default function ProductList({
  products,
  sortOrder,
  setSortOrder,
  saleStatus,
  setSaleStatus,
}: ProductListProps) {
  const queryClient = useQueryClient();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const updateMutation = useMutation({
    mutationFn: async ({
      ids,
      data,
    }: {
      ids: string[];
      data: { is_sale: boolean };
    }) => {
      const { message, success } = await updateSelectedProductsIsSaleState(
        ids,
        data
      );
      if (success) return message;
    },
    onSuccess: (data) => {
      if (data) {
        setCheckedItems([]);
        toast.success(data);
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { message, success } = await deleteSelectedProducts(ids);
      if (success) return message;
    },
    onSuccess: (data) => {
      if (data) {
        setCheckedItems([]);
        toast.success(data);
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }
    },
  });

  const handleClickButton = (type: ButtonActionType = "") => {
    if (checkedItems.length === 0) {
      toast.error("선택된 상품이 없습니다");
      return;
    }

    const ids = checkedItems;

    switch (type) {
      case "is_sale_true":
        updateMutation.mutate({ ids, data: { is_sale: true } });
        break;
      case "is_sale_false":
        updateMutation.mutate({ ids, data: { is_sale: false } });
        break;
      default:
        if (window.confirm("정말 삭제하시겠습니까?")) {
          deleteMutation.mutate(ids);
        }
    }
  };

  const handleAllChecked = (isChecked: boolean) => {
    setCheckedItems(isChecked ? products.map((p) => p.id) : []);
  };

  const handleCheckboxChange = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((id) => id !== item) : [...prev, item]
    );
  };

  return (
    <section>
      <MenuTitle>상품 목록</MenuTitle>
      <Card>
        <div className={styles.top_wrap}>
          <p>
            총 <span>{products.length}</span>개
          </p>

          <div className={styles.select_wrap}>
            <Select
              value={saleStatus}
              onChange={(e) =>
                setSaleStatus(e.target.value as ProductSaleStatus)
              }
            >
              {Object.entries(SALE_STATUS_OPTIONS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrderType)}
            >
              {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className={styles.button_list_wrap}>
          <div className={styles.button_left_wrap}>
            <Button
              buttonType="option"
              loading={updateMutation.isPending}
              onClick={() => handleClickButton("is_sale_true")}
            >
              판매함
            </Button>
            <Button
              buttonType="option"
              loading={updateMutation.isPending}
              onClick={() => handleClickButton("is_sale_false")}
            >
              판매안함
            </Button>
            <Button
              buttonType="delete"
              loading={deleteMutation.isPending}
              onClick={() => handleClickButton()}
            >
              삭제
            </Button>
          </div>
          <div>
            <Button>
              <Link href="/product/editor">상품등록</Link>
            </Button>
          </div>
        </div>
        <div className={styles.table_header_wrap}>
          {TABLE_HEADERS.map(({ key, label }) => (
            <div key={key}>
              {key === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={
                    products.length > 0 &&
                    checkedItems.length === products.length
                  }
                  onChange={(e) => handleAllChecked(e.target.checked)}
                />
              ) : (
                label
              )}
            </div>
          ))}
        </div>

        {products.length > 0 ? (
          products.map((product, idx) => (
            <ProductListItem
              key={product.id}
              isChecked={checkedItems.includes(String(product.id))}
              handleCheckboxChange={handleCheckboxChange}
              product={product}
              index={idx + 1}
            />
          ))
        ) : (
          <div className={styles.empty_wrap}>상품 내용이 없습니다.</div>
        )}
      </Card>
    </section>
  );
}
