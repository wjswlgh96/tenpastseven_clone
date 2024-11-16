import styles from "./page.module.css";
import MainTitle from "@/components/_atoms/main-title";
import { getAllProducts } from "@/actions/products";
import ServerErrorMessage from "@/components/_atoms/server-error-message";
import ProductStatusCard from "@/components/product/product-status-card";

export default async function Product() {
  const { products, error } = await getAllProducts();

  const isSale = products?.filter((product) => product.is_sale);
  const soldOut = products?.filter((product) =>
    product.options?.every((option) => option.stock === 0)
  );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <MainTitle>상품 대시보드</MainTitle>
        {products && (
          <ProductStatusCard
            productLength={products.length}
            isSaleLength={isSale ? isSale.length : 0}
            soldOutLength={soldOut ? soldOut.length : 0}
          />
        )}
      </div>
      {error && <ServerErrorMessage error={error} />}
    </div>
  );
}
