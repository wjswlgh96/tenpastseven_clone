"use client";

import { ProductType } from "@shared/types";
import styles from "./product-list-item.module.css";
import { formatPrice } from "@/utils/functions/format";
import Image from "next/image";
import { NONE_IMAGE_URL } from "@/constant/image";
import { useQueryClient } from "@tanstack/react-query";

interface ProductListItemProps {
  isChecked: boolean;
  handleCheckboxChange: (id: string) => void;
  product: ProductType;
  index: number;
}

export default function ProductListItem({
  isChecked,
  handleCheckboxChange,
  product,
  index,
}: ProductListItemProps) {
  const queryClient = useQueryClient();

  const handleClickName = () => {
    const popup = window.open(
      `/product/editor/${product.id}?popup`,
      "popup",
      "width=1500,height=800,scrollbars=yes,resizable=yes"
    );

    if (popup) {
      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          queryClient.invalidateQueries({ queryKey: ["products"] });
        }
      }, 100);
    }
  };

  const totalStock = Object.values(product.options).reduce((a, c) => a + c, 0);

  return (
    <div className={styles.item_wrap}>
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
          <div className={styles.info_options}>
            - 사이즈 :{" "}
            {Object.keys(product.options)
              .sort((a, b) => {
                const order = ["S", "M", "L"];
                return order.indexOf(a) - order.indexOf(b);
              })
              .join(", ")}
          </div>
        </div>
      </div>
      <div>{formatPrice(product.price)}</div>
      <div>
        {product.sale_price ? formatPrice(product.sale_price) : "할인 미적용"}
      </div>
      <div>{product.is_sale ? "판매중" : "판매안함"}</div>
      <div>{product.is_sold_out ? "품절됨" : `${totalStock} 개`}</div>
    </div>
  );
}
