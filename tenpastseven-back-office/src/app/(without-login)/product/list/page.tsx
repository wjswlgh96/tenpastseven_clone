import styles from "./page.module.css";

import ProductListUI from "@/components/product/list/ui";

export default async function ProductListPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <ProductListUI />
      </div>
    </div>
  );
}
