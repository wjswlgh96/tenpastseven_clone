import { ProductTypes } from "@shared/types";
import styles from "./product-list-item.module.css";
import formatPrice from "@/utils/func/format";

interface Props {
  isChecked: boolean;
  handleCheckboxChange: (string) => void;
  product: ProductTypes;
}

export default function ProductListItem({
  isChecked,
  handleCheckboxChange,
  product,
}: Props) {
  return (
    <div className={styles.container}>
      <div>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => handleCheckboxChange(String(product.id))}
        />
      </div>
      <div>{product.id}</div>
      <div>{product.name}</div>
      <div>{formatPrice(product.price)}</div>
      <div>{product.sale_price ? product.sale_price : "할인 미적용"}</div>
      <div>{product.is_sale ? "판매중" : "판매안함"}</div>
    </div>
  );
}
