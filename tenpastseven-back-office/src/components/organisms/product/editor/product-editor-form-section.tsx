"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import Input from "@/components/atoms/inputs/input";
import TextArea from "@/components/atoms/inputs/textarea";
import MainTitle from "@/components/atoms/typography/main-title";
import Button from "@/components/atoms/buttons/button";
import LoadingScreen from "@/components/molecules/feedback/loading-screen";
import SubTitle from "@/components/atoms/typography/subtitle";
import ProductEditorMainImageForm from "@/components/molecules/product/editor/product-editor-main-image-form";
import ProductEditorDetailImageForm from "@/components/molecules/product/editor/product-editor-detail-image-form";

import {
  getProduct,
  uploadProductDetailImage,
  uploadProductMainImage,
  upsertProducts,
} from "@/actions/products";
import {
  ProductOptionCheck,
  ProductType,
  ProductOption,
  ProductEditorState,
} from "@shared/types";

import { v4 } from "uuid";

import styles from "./product-editor-form-section.module.css";
import { INITIAL_PRODUCT_EDITOR_STATE, SIZES } from "@/constant/product";
import { useRecoilState } from "recoil";
import {
  detailImagesDataState,
  mainImagesFormDataState,
} from "@/utils/recoil/atoms";

export default function ProductEditorFormSection({ id }: { id?: string }) {
  const router = useRouter();

  const [mainImagesFormData, setMainImagesFormData] = useRecoilState(
    mainImagesFormDataState
  );
  const [detailImagesData, setDetailImagesData] = useRecoilState(
    detailImagesDataState
  );

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

    setDetailImagesData(() =>
      data.detail_images.map((url) => ({
        image_url: url,
        image_form_data: null,
        image_id: v4(),
        isExisting: url ? true : false,
      }))
    );

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

  const uploadMainImageMutation = useMutation({
    mutationFn: uploadProductMainImage,
  });

  const uploadDetailImageMutation = useMutation({
    mutationFn: uploadProductDetailImage,
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (detailImagesData.length >= 20) {
      toast.error("상세이미지는 최대 20개까지 등록할 수 있습니다.");
      return;
    }

    const {
      success: uploadMainImageSuccess,
      data: { urls },
    } = await uploadMainImageMutation.mutateAsync({
      id: id ?? formData.id,
      mainImagesUrl: formData.main_images,
      mainImagesFormData,
    });

    const { success: detailSuccess, data } =
      await uploadDetailImageMutation.mutateAsync({
        id: id ?? formData.id,
        detailImagesData,
      });

    const newData = id
      ? {
          ...formData,
          updated_at: new Date().toISOString(),
          main_images: uploadMainImageSuccess ? urls : formData.main_images,
          detail_images: detailSuccess ? data.urls : formData.detail_images,
        }
      : {
          ...formData,
          id: v4(),
          main_images: uploadMainImageSuccess ? urls : formData.main_images,
          detail_images: data.urls,
        };

    const { message, success } = await upsertProducts({ data: newData });

    setMainImagesFormData({
      main_url: null,
      list_url_01: null,
      list_url_02: null,
    });
    setDetailImagesData((prev) =>
      prev.map((data) => ({
        ...data,
        image_form_data: null,
      }))
    );

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
    setMainImagesFormData({
      main_url: null,
      list_url_01: null,
      list_url_02: null,
    });
    setDetailImagesData((prev) =>
      prev.map((data) => ({
        ...data,
        image_form_data: null,
      }))
    );

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
            <Button
              type="submit"
              aria-label={id ? "상품 수정완료" : "상품 등록하기"}
              disabled={
                uploadMainImageMutation.isPending ||
                uploadDetailImageMutation.isPending
              }
              loading={
                uploadMainImageMutation.isPending ||
                uploadDetailImageMutation.isPending
              }
            >
              {id ? "상품 수정완료" : "상품 등록하기"}
            </Button>
            <Button
              buttonType="delete"
              aria-label={id ? "닫기" : "돌아가기"}
              onClick={handleCloseOrBack}
            >
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
        <ProductEditorMainImageForm
          id={id ?? formData.id}
          mainImages={formData.main_images}
          setFormData={setFormData}
        />
        <ProductEditorDetailImageForm
          id={id ?? formData.id}
          setFormData={setFormData}
        />
      </form>
    </section>
  );
}
