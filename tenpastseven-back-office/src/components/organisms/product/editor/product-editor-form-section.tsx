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
import {
  ProductOptionCheck,
  ProductType,
  ProductOption,
  ProductEditorState,
} from "@shared/types";

import styles from "./product-editor-form-section.module.css";
import { INITIAL_PRODUCT_EDITOR_STATE, SIZES } from "@/constant/product";
import ProductEditorImageForm from "@/components/molecules/product/editor/product-editor-image-form";
import SubTitle from "@/components/atoms/typography/subtitle";

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
    setFormData((prev: ProductEditorState) => {
      return {
        ...prev,
        ...data,
      };
    });

    const updateOptionCheck = SIZES.reduce((a, size) => {
      a[size] =
        data.options?.[size] !== undefined ? data.options[size] >= 0 : false;
      return a;
    }, {} as ProductOptionCheck);

    setOptionChecked(updateOptionCheck);
  };

  const { isLoading } = useQuery({
    queryKey: ["product", { id }],
    queryFn: async () => {
      if (!id) return;
      const { data, success } = await getProduct(id);
      if (success) {
        handleProductData(data);
        return data;
      }
    },
    enabled: !!id,
  });

  const handleSaleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, is_sale: e.target.checked }));
  };

  const handleOptionChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setOptionChecked((prev) => {
      return {
        ...prev,
        [name]: checked,
      };
    });

    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          options: { ...prev.options, [name]: 0 },
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [name as keyof ProductOption]: _, ...newOptions } = prev.options;
      return {
        ...prev,
        options: newOptions,
      };
    });
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
    const newData = id
      ? { updated_at: new Date().toISOString(), ...formData }
      : { ...formData };

    const { message, success } = await upsertProducts({ data: newData });

    if (success) {
      if (id) {
        alert(message);
        window.close();
      } else {
        toast.success(message);
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
          <SubTitle className={styles.options_wrap_title}>옵션 & 재고</SubTitle>
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

        <ProductEditorImageForm
          id={id ?? formData.id}
          mainImages={formData.main_images}
          setFormData={setFormData}
        />
      </form>
    </section>
  );
}
