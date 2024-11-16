"use client";

import { ProductTypes } from "@shared/types";
import styles from "./product-list-item.module.css";
import { formatPrice } from "@/utils/func/format";
import Image from "next/image";
import { NONE_IMAGE_URL } from "@/constant/image";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  isChecked: boolean;
  handleCheckboxChange: (string) => void;
  product: ProductTypes;
  index: number;
}

export default function ProductListItem({
  isChecked,
  handleCheckboxChange,
  product,
  index,
}: Props) {
  const queryClient = useQueryClient();

  const handleClickName = () => {
    const popup = window.open(
      `/product/editor/${product.id}?popup`,
      "popup",
      "width=1500,height=800,scrollbars=yes,resizeable=ues"
    );

    if (popup) {
      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          queryClient.invalidateQueries({ queryKey: ["searchProduct"] });
        }
      }, 100);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => handleCheckboxChange(String(product.id))}
        />
      </div>
      <div>{index}</div>
      <div className={styles.product_info}>
        <div>
          <Image
            src={
              product.main_images
                ? product.main_images.small_url
                : NONE_IMAGE_URL
            }
            width={80}
            height={80}
            className={styles.info_image}
            alt={product.name}
          />
        </div>
        <div>
          <div onClick={() => handleClickName()} className={styles.info_name}>
            {product.name}
          </div>
          {product.options && (
            <div className={styles.info_options}>
              - 사이즈 :{" "}
              {product.options.map((option) => option.size).join(", ")}
            </div>
          )}
        </div>
      </div>
      <div>{formatPrice(product.price)}</div>
      <div>{product.sale_price ? product.sale_price : "할인 미적용"}</div>
      <div>{product.is_sale ? "판매중" : "판매안함"}</div>
    </div>
  );
}
