"use client";

import styles from "./editor-page.module.css";

import ProductEditorFormSection from "@/components/product/editor.tsx/product-editor-form-section";

export default function EditorPage({ id }: { id?: string }) {
  return (
    <div className={styles.container}>
      <ProductEditorFormSection id={id} />
    </div>
  );
}
