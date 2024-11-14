import { getProducts } from "@/actions/products";
import styles from "./page.module.css";

import ProductListUI from "@/components/product/list/ui";
import ServerErrorMessage from "@/components/atoms/ServerErrorMessage";

export default async function ProductListPage() {
  const { products, error } = await getProducts();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {products && (
          <ProductListUI
            allLength={products.length}
            saleLength={products.filter((product) => product.is_sale).length}
            noneSaleLength={
              products.filter((product) => !product.is_sale).length
            }
          />
        )}
      </div>
      {error && <ServerErrorMessage error={error} />}
    </div>
  );
}
