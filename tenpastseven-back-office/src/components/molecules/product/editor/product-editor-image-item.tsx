"use client";

import Image, { ImageProps } from "next/image";

import styles from "./product-editor-image-item.module.css";
import SvgButton from "@/components/molecules/icons/svg-button";
import Spinner from "@/components/atoms/feedback/spinner";

interface ProductEditorImageItemProps extends ImageProps {
  onDelete?: () => void;
  alt: string;
  isLoading?: boolean;
}

export default function ProductEditorImageItem(
  props: ProductEditorImageItemProps
) {
  const { onDelete, alt, className, isLoading, ...filterProps } = props;

  return (
    <div className={styles.image_item_wrap}>
      {isLoading ? (
        <Spinner size={"50%"} />
      ) : (
        <>
          <Image
            {...filterProps}
            className={`${styles.image_item} ${className}`}
            alt={alt}
          />
          {onDelete && (
            <SvgButton
              name="x-mark"
              onClick={onDelete}
              className={styles.image_item_delete_btn}
            />
          )}
        </>
      )}
    </div>
  );
}
