"use client";

import styles from "./product-editor-form-section.module.css";

import { useState } from "react";
import Input from "@/components/_atoms/input";
import TextArea from "@/components/_atoms/textarea";
import MainTitle from "@/components/_atoms/main-title";
import Button from "@/components/_atoms/button";
import { useQuery } from "@tanstack/react-query";
import { getProduct, upsertProducts } from "@/actions/products";
import { toast } from "react-toastify";
import LoadingScreen from "@/components/_molecules/loading-screen";
import { useRouter } from "next/navigation";
import { ProductImage, ProductionOption } from "@shared/types";

// name, description, options, main_images, detail_images, 판매상태, 판매가

type ProductState = {
  name: string;
  description: string;
  price: number;
  options: ProductionOption[] | null;
  main_images: ProductImage | null;
  detail_images: string[] | null;
  is_sale: boolean;
  sale_price: number | null;
  created_at: string;
};

const initialState: ProductState = {
  name: "",
  description: "",
  price: 0,
  options: null,
  main_images: null,
  detail_images: null,
  is_sale: false,
  sale_price: null,
  created_at: new Date().toISOString(),
};

export default function ProductEditorFormSection({ id }: { id?: string }) {
  const router = useRouter();

  const [formData, setFormData] = useState(initialState);

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
        setFormData((prev) => ({
          ...prev,
          name: data.name,
          description: data.description!,
          price: data.price,
          options: data.options,
          main_images: data.main_images,
          detail_images: data.detail_images,
          is_sale: data.is_sale,
          sale_price: data.sale_price,
          created_at: data.created_at,
        }));
      }
    },
    enabled: !!id,
  });

  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, is_sale: e.target.checked }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        router.back();
      }
    }
  };

  return (
    <section>
      <form onSubmit={onSumbit} className={styles.form}>
        <div className={styles.title_wrap}>
          <MainTitle>{id ? "상품수정" : "상품등록"}</MainTitle>
          <div className={styles.title_button_wrap}>
            <Button type="submit">
              {id ? "상품 수정완료" : "상품 등록하기"}
            </Button>
            <Button
              buttonType="delete"
              onClick={() => {
                if (id) {
                  window.close();
                } else {
                  router.back();
                }
              }}
            >
              {id ? "닫기" : "돌아가기"}
            </Button>
          </div>
        </div>

        <Input
          type="checkbox"
          label="판매하기"
          checked={formData.is_sale}
          onChange={handleChecked}
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
          value={formData.description}
          onChange={handleChange}
        />
      </form>
      {isLoading && <LoadingScreen />}
    </section>
  );
}
