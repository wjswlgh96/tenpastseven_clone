"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import Input from "@/components/atoms/inputs/input";
import TextArea from "@/components/atoms/inputs/textarea";
import MainTitle from "@/components/atoms/typography/main-title";
import Button from "@/components/atoms/buttons/button";
import LoadingScreen from "@/components/molecules/feedback/loading-screen";

import { getProduct, upsertProducts } from "@/actions/products";
import { ProductOptionCheck, ProductType } from "@shared/types";

import styles from "./product-editor-form-section.module.css";
import { INITIAL_PRODUCT_EDITOR_STATE, SIZES } from "@/constant/product";

// name, description, options, main_images, detail_images, 판매상태, 판매가

export default function ProductEditorFormSection({ id }: { id?: string }) {
  const router = useRouter();

  const [formData, setFormData] = useState(INITIAL_PRODUCT_EDITOR_STATE);
  const [optionCheck, setOptionChecked] = useState<ProductOptionCheck>({
    S: false,
    M: false,
    L: false,
  });

  const handleProductData = (data: ProductType) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...rest } = data;
    setFormData((prev) => ({ ...prev, ...rest }));

    const updateOptionCheck = SIZES.reduce((a, size) => {
      a[size] =
        rest.options?.[size] !== undefined ? rest.options[size] >= 0 : false;
      return a;
    }, {} as ProductOptionCheck);

    setOptionChecked(updateOptionCheck);
  };

  const { isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return;
      const { data, error } = await getProduct(id);

      if (error) {
        toast.error(error);
        return;
      }

      if (data) {
        handleProductData(data);
      }
    },
    enabled: !!id,
  });

  const handleSaleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, is_sale: e.target.checked }));
  };

  const handleOptionChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setOptionChecked((prev) => {
      return {
        ...prev,
        [name]: !prev[name as keyof ProductOptionCheck],
      };
    });
    setFormData((prev) => ({
      ...prev,
      options: { ...prev.options, [name]: 0 },
    }));
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      options: { ...prev.options, [name]: Number(value) },
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newData = id ? { id: Number(id), ...formData } : formData;

    const { data, error } = await upsertProducts({ data: newData });
    if (error) {
      toast.error(error);
      return;
    }

    if (data) {
      if (id) {
        alert("상품 수정 완료");
        window.close();
      } else {
        toast.success("상품 등록 완료");
        router.replace("/product/list");
      }
    }
  };

  const handleCloseOrBack = () => {
    if (id) {
      window.close();
    } else {
      router.back();
    }
  };

  return (
    <section className={styles.container}>
      {isLoading && <LoadingScreen />}
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.title_wrap}>
          <MainTitle>{id ? "상품수정" : "상품등록"}</MainTitle>
          <div className={styles.title_button_wrap}>
            <Button type="submit">
              {id ? "상품 수정완료" : "상품 등록하기"}
            </Button>
            <Button buttonType="delete" onClick={handleCloseOrBack}>
              {id ? "닫기" : "돌아가기"}
            </Button>
          </div>
        </div>

        <div className={styles.required_wrap}>
          <span>*</span> 필수입력사항
        </div>

        <Input
          type="checkbox"
          label="판매하기"
          name="is_sale"
          checked={formData.is_sale}
          onChange={handleSaleChecked}
          containerClassName={styles.input_label_wrap}
        />

        <Input
          label="상품명"
          name="name"
          required
          containerClassName={styles.input_label_wrap}
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          type="number"
          label="판매가"
          name="price"
          required
          containerClassName={styles.input_label_wrap}
          value={formData.price}
          onChange={handleChange}
        />

        <TextArea
          label="상품설명"
          name="description"
          containerClassName={styles.textarea_label_wrap}
          value={formData.description ?? ""}
          onChange={handleChange}
        />

        <div className={styles.options_wrap}>
          <div className={styles.options_wrap_title}>옵션 & 재고</div>
          <div className={styles.select_option_wrap}>
            {SIZES.map((size) => (
              <div key={size}>
                <Input
                  type="checkbox"
                  label={`사이즈 : ${size}`}
                  name={size}
                  checked={optionCheck[size]}
                  onChange={handleOptionChecked}
                  containerClassName={styles.input_label_wrap}
                />
                <Input
                  type="number"
                  name={size}
                  disabled={!optionCheck[size]}
                  value={formData.options[size] ?? 0}
                  className={styles.select_option_input}
                  placeholder="수량을 입력해주세요"
                  onChange={handleOptionChange}
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </section>
  );
}
