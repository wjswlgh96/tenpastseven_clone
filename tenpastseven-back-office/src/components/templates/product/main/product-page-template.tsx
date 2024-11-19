import MainTitle from "@/components/atoms/typography/main-title";
import ProductContainer from "@/components/atoms/containers/product-container";
import ProductStatusCard from "@/components/organisms/product/main/product-status-card";

export default async function ProductPageTemplate() {
  return (
    <ProductContainer>
      <MainTitle>상품 대시보드</MainTitle>
      <ProductStatusCard />
    </ProductContainer>
  );
}
