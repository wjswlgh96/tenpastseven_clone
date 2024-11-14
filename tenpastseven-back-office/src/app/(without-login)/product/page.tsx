import styles from "./page.module.css";
import MainTitle from "@/components/atoms/main-title";
import { getProducts } from "@/actions/products";
import ServerErrorMessage from "@/components/atoms/ServerErrorMessage";
import ProductStatusCard from "@/components/product/product-status-card";

export default async function Product() {
  const { products, error } = await getProducts();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <MainTitle>상품 대시보드</MainTitle>
        {products && <ProductStatusCard productLength={products.length} />}
      </div>
      {error && <ServerErrorMessage error={error} />}
    </div>
  );
}
