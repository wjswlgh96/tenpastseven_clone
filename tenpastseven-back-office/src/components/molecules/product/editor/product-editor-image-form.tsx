"use client";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import Image from "next/image";
import SubTitle from "@/components/atoms/typography/subtitle";
import Spinner from "@/components/atoms/feedback/spinner";

import styles from "./product-editor-image-form.module.css";

import { MAIN_IMAGE_LIST, MainImageList } from "@/constant/product";
import { ProductEditorState, ProductImage } from "@shared/types";
import { uploadProductMainImage } from "@/actions/products";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

interface ProductEditorImageFormProps {
  id: string;
  mainImages: ProductImage | null;
  setFormData: Dispatch<SetStateAction<ProductEditorState>>;
}

export default function ProductEditorImageForm({
  id,
  mainImages,
  setFormData,
}: ProductEditorImageFormProps) {
  const [loadingStates, setLoadingStates] = useState<
    Record<keyof MainImageList, boolean>
  >({
    main_url: false,
    list_url_01: false,
    list_url_02: false,
  });

  const uploadMainImageMutation = useMutation({
    mutationFn: uploadProductMainImage,
    onSuccess: ({ message }) => {
      toast.success(message, {
        position: "bottom-right",
      });
    },
  });

  const handleDrop = useCallback(
    async (acceptedFiles: File[], imageKey: keyof MainImageList) => {
      setLoadingStates((prev) => ({
        ...prev,
        [imageKey]: true,
      }));

      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadMainImageMutation.mutateAsync({
        id,
        key: imageKey,
        formData,
      });

      setFormData((prev) => ({
        ...prev,
        main_images: {
          ...prev.main_images,
          [imageKey]: result.data.url,
        },
      }));

      setLoadingStates((prev) => ({
        ...prev,
        [imageKey]: false,
      }));
    },
    [id, uploadMainImageMutation, setFormData]
  );

  const mainDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles, "main_url"),
  });

  const listDropzone1 = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles, "list_url_01"),
  });

  const listDropzone2 = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles, "list_url_02"),
  });

  const dropzones = {
    main_url: mainDropzone,
    list_url_01: listDropzone1,
    list_url_02: listDropzone2,
  };

  return (
    <div className={styles.image_wrap}>
      <SubTitle className={styles.image_wrap_subtitle}>
        상품 이미지 등록
      </SubTitle>
      <div className={styles.image_input_wrap_list}>
        {Object.keys(MAIN_IMAGE_LIST).map((key) => {
          const imageKey = key as keyof MainImageList;
          const { getRootProps, getInputProps } = dropzones[imageKey];

          return (
            <div key={imageKey}>
              <SubTitle className={styles.image_input_wrap_subtitle}>
                {MAIN_IMAGE_LIST[imageKey].label}
              </SubTitle>
              <div {...getRootProps()} className={styles.image_input_wrap}>
                <input {...getInputProps()} />
                {loadingStates[imageKey] ? (
                  <Spinner size={50} borderWidth={5} />
                ) : mainImages && mainImages[imageKey] ? (
                  <Image
                    src={mainImages[imageKey]}
                    alt={imageKey}
                    width={150}
                    height={150}
                    className={styles.main_images}
                    priority
                  />
                ) : (
                  <p className={styles.image_input_wrap_p}>
                    파일을 끌어다놓거나
                    <br />
                    클릭하여 업로드 하세요.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
