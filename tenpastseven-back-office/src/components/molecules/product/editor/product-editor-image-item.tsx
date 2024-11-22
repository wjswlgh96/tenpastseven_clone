"use client";

import NextImage, { ImageProps } from "next/image";

import styles from "./product-editor-image-item.module.css";
import SvgButton from "@/components/molecules/icons/svg-button";
import { useState } from "react";

interface ProductEditorImageItemProps extends ImageProps {
  onDelete?: () => void;
  alt: string;
}

export default function ProductEditorImageItem(
  props: ProductEditorImageItemProps
) {
  const [isHover, setIsHover] = useState(false);
  const { onDelete, alt, className, src, ...filterProps } = props;

  const handleSearch = () => {
    const img = new Image();
    img.src = src as string;

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      setTimeout(() => {
        window.open(
          img.src as string,
          `popup_${Date.now()}`,
          `width=${width},height=${height},resizable=yes,scrollbars=yes`
        );
      }, 100);
    };
  };

  return (
    <div
      className={styles.image_item_wrap}
      style={{ width: filterProps.width, height: filterProps.height }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <NextImage
        {...filterProps}
        className={`${styles.image_item} ${className}`}
        src={src}
        alt={alt}
        sizes={"100vw"}
        priority
      />
      {onDelete && isHover && (
        <SvgButton
          name="x-mark"
          onClick={onDelete}
          className={styles.image_item_delete_btn}
        />
      )}
      {isHover && (
        <SvgButton
          name="search"
          onClick={handleSearch}
          className={styles.image_item_search_btn}
        />
      )}
    </div>
  );
}
