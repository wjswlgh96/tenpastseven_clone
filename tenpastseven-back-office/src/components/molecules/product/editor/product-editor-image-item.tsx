"use client";

import Image, { ImageProps } from "next/image";

import styles from "./product-editor-image-item.module.css";
import SvgButton from "@/components/molecules/icons/svg-button";

interface ProductEditorImageItemProps extends ImageProps {
  onDelete?: () => void;
  alt: string;
}

export default function ProductEditorImageItem(
  props: ProductEditorImageItemProps
) {
  const { onDelete, alt, className, ...filterProps } = props;

  return (
    <div
      className={styles.image_item_wrap}
      style={{ width: filterProps.width, height: filterProps.height }}
    >
      <Image
        {...filterProps}
        className={`${styles.image_item} ${className}`}
        alt={alt}
        priority
      />
      {onDelete && (
        <SvgButton
          name="x-mark"
          onClick={onDelete}
          className={styles.image_item_delete_btn}
        />
      )}
    </div>
  );
}
