import React from "react";
import {
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import ProductEditorImageItem from "./product-editor-image-item";

import styles from "./sortable-detail-image-item.module.css";

interface SortableDetailImageItemProps {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  onDelete: () => void;
  className?: string;
}

function animateLayoutChanges(args: Parameters<AnimateLayoutChanges>[0]) {
  const { wasDragging, isSorting } = args;

  if (isSorting || wasDragging) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
}

export default React.memo(function SortableDetailImageItem({
  id,
  src,
  alt,
  width,
  height,
  onDelete,
  className,
}: SortableDetailImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id,
    animateLayoutChanges,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.sortable_detail_image_item_wrap}
    >
      <div {...attributes} {...listeners}>
        <ProductEditorImageItem
          src={src}
          alt={alt}
          width={width}
          height={height}
          onDelete={onDelete}
          className={className}
        />
      </div>
    </div>
  );
});
