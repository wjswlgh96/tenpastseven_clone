import ProductEditorTemplate from "@/components/templates/product/editor/product-editor-template";

export default function ProductEditor({ params }: { params: { id: string } }) {
  return <ProductEditorTemplate id={params.id} />;
}
