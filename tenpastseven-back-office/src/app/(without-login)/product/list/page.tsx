import { getAllProducts } from "@/actions/products";
import styles from "./page.module.css";

import ProductListUI from "@/components/product/list/ui";
import ServerErrorMessage from "@/components/_atoms/server-error-message";

export default async function ProductListPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <ProductListUI />
      </div>
    </div>
  );
}
