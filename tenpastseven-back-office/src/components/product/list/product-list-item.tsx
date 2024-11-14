import { ProductTypes } from "@shared/types";
import styles from "./product-list-item.module.css";
import formatPrice from "@/utils/func/format";

interface Props {
  product: ProductTypes;
}

export default function ProductListItem({ product }: Props) {
  return (
    <div className={styles.container}>
      <div>
        <input type="checkbox" />
      </div>
      <div>{product.id}</div>
      <div>{product.name}</div>
      <div>{formatPrice(product.price)}</div>
      <div>{product.sale_price ? product.sale_price : "할인 미적용"}</div>
    </div>
  );
}
