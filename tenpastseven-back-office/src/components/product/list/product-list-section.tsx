"use client";

import styles from "./product-list-section.module.css";

import { ProductTypes } from "@shared/types";

import Card from "@/components/_atoms/card";
import MenuTitle from "@/components/_atoms/menu-title";
import { Dispatch, SetStateAction, useState } from "react";
import Select from "@/components/_atoms/select";
import Button from "@/components/_atoms/button";
import ProductListItem from "./product-list-item";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteSelectedProduts,
  updateSelectedProductsIsSaleState,
} from "@/actions/products";
import { toast } from "react-toastify";
import { saleSelectType } from "./ui";
import Link from "next/link";

interface Props {
  products: ProductTypes[];
  sortOrder: string;
  setSortOrder: Dispatch<SetStateAction<string>>;
  isSaleSelect: saleSelectType;
  setIsSaleSelect: Dispatch<SetStateAction<saleSelectType>>;
}

export default function ProductListSection({
  products,
  sortOrder,
  setSortOrder,
  isSaleSelect,
  setIsSaleSelect,
}: Props) {
  const queryClient = useQueryClient();

  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const updatedIsSaleTrueMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await updateSelectedProductsIsSaleState(
        checkedItems.map(Number),
        { is_sale: true }
      );

      if (error) {
        toast.error(error);
        return;
      }

      return data;
    },
    onSuccess: (data) => {
      setCheckedItems([]);

      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["searchProduct"] });
    },
  });

  const updatedIsSaleFalseMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await updateSelectedProductsIsSaleState(
        checkedItems.map(Number),
        { is_sale: false }
      );

      if (error) {
        toast.error(error);
        return;
      }

      return data;
    },
    onSuccess: (data) => {
      setCheckedItems([]);

      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["searchProduct"] });
    },
  });

  const deleteCheckedProductMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await deleteSelectedProduts(
        checkedItems.map(Number)
      );

      if (error) {
        toast.error(error);
        return;
      }

      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setCheckedItems([]);
        toast.success(data);
        queryClient.invalidateQueries({ queryKey: ["searchProduct"] });
      }
    },
  });

  const handleClickButton = (
    type: "is_sale_true" | "is_sale_false" | "" = ""
  ) => {
    if (checkedItems.length === 0) return;

    if (type === "is_sale_true") {
      updatedIsSaleTrueMutation.mutate();
    } else if (type === "is_sale_false") {
      updatedIsSaleFalseMutation.mutate();
    } else {
      const isConfirm = window.confirm("정말 삭제하시겠습니까?");
      if (isConfirm) {
        deleteCheckedProductMutation.mutate();
      }
    }
  };

  const handleAllChecked = (isChecked: boolean) => {
    if (isChecked) {
      setCheckedItems(products.map((product) => String(product.id)));
    } else {
      setCheckedItems([]);
    }
  };

  const handleCheckboxChange = (item: string) => {
    if (checkedItems.includes(item)) {
      setCheckedItems(checkedItems.filter((target) => target !== item));
    } else {
      setCheckedItems([...checkedItems, item]);
    }
  };

  const isAllChecked = products && checkedItems.length === products.length;

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
              value={isSaleSelect}
              onChange={(e) =>
                setIsSaleSelect(e.target.value as saleSelectType)
              }
            >
              <option value="all">전체</option>
              <option value="empty" disabled>
                ----------------
              </option>
              <option value="is_sale">판매중</option>
              <option value="none_sale">판매안함</option>
            </Select>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="created_at_a">등록일 순</option>
              <option value="created_at_d">등록일 역순</option>
              <option value="empty" disabled>
                ----------------
              </option>
              <option value="name_a">상품명 순</option>
              <option value="name_d">상품명 역순</option>
              <option value="empty" disabled>
                ----------------
              </option>
              <option value="price_a">판매가 순</option>
              <option value="price_d">판매가 역순</option>
            </Select>
          </div>
        </div>
        <div className={styles.button_list_wrap}>
          <div className={styles.button_left_wrap}>
            <Button
              buttonType="option"
              loading={updatedIsSaleTrueMutation.isPending}
              onClick={() => handleClickButton("is_sale_true")}
            >
              판매함
            </Button>
            <Button
              buttonType="option"
              loading={updatedIsSaleFalseMutation.isPending}
              onClick={() => handleClickButton("is_sale_false")}
            >
              판매안함
            </Button>
            <Button
              buttonType="delete"
              loading={deleteCheckedProductMutation.isPending}
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
          <div>
            <input
              type="checkbox"
              checked={isAllChecked}
              onChange={(e) => handleAllChecked(e.target.checked)}
            />
          </div>
          <div>No</div>
          <div>상품정보</div>
          <div>판매가</div>
          <div>할인가</div>
          <div>판매상태</div>
        </div>
        {products && products.length > 0 ? (
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
          <div>상품을 추가해보세요!</div>
        )}
      </Card>
    </section>
  );
}
