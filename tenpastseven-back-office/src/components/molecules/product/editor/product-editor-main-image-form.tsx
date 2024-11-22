"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";

import SubTitle from "@/components/atoms/typography/subtitle";
import Spinner from "@/components/atoms/feedback/spinner";

import styles from "./product-editor-main-image-form.module.css";
import ProductEditorImageItem from "./product-editor-image-item";

import { MAIN_IMAGE_LIST, MainImageList } from "@/constant/product";
import { deleteProductMainImage } from "@/actions/products";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import Button from "@/components/atoms/buttons/button";
import { useSetRecoilState } from "recoil";
import { mainImagesFormDataState } from "@/utils/recoil/atoms";
import { ProductEditorState, ProductMainImages } from "@shared/types";

interface ProductEditorImageFormProps {
  id: string;
  mainImages: ProductMainImages;
  setFormData: Dispatch<SetStateAction<ProductEditorState>>;
}

export default function ProductEditorMainImageForm({
  id,
  mainImages,
  setFormData,
}: ProductEditorImageFormProps) {
  const setMainImagesFormData = useSetRecoilState(mainImagesFormDataState);
  const [imagesUrl, setImagesUrl] = useState<ProductMainImages>({
    main_url: "",
    list_url_01: "",
    list_url_02: "",
  });
  const [loadingStates, setLoadingStates] = useState<
    Record<keyof MainImageList, boolean>
  >({
    main_url: false,
    list_url_01: false,
    list_url_02: false,
  });

  const deleteProductMainImageMutation = useMutation({
    mutationFn: deleteProductMainImage,
    onSuccess: ({ message }, { key }) => {
      toast.success(message, {
        position: "bottom-right",
      });

      setLoadingStates((prev) => ({
        ...prev,
        [key]: false,
      }));

      setImagesUrl((prev) => ({
        ...prev,
        [key]: "",
      }));

      setFormData((prev) => ({
        ...prev,
        main_images: {
          ...prev.main_images,
          [key]: "",
        },
      }));
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

      const url = URL.createObjectURL(file);

      setMainImagesFormData((prev) => ({
        ...prev,
        [imageKey]: formData,
      }));

      setImagesUrl((prev) => ({
        ...prev,
        [imageKey]: url,
      }));

      setLoadingStates((prev) => ({
        ...prev,
        [imageKey]: false,
      }));
    },
    [setMainImagesFormData]
  );

  useEffect(() => {
    setImagesUrl(mainImages);
  }, [mainImages]);

  useEffect(() => {
    return () => {
      Object.values(imagesUrl).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [imagesUrl]);

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

              {loadingStates[imageKey] ? (
                <div className={styles.spinner_wrap} key={imageKey}>
                  <Spinner size={100} borderWidth={5} />
                </div>
              ) : imagesUrl && imagesUrl[imageKey] !== "" ? (
                <div>
                  <div className={styles.image_item_wrap}>
                    <ProductEditorImageItem
                      src={imagesUrl[imageKey]}
                      alt={`상품 메인 이미지-${imagesUrl[imageKey]}`}
                      width={200}
                      height={200}
                    />
                  </div>
                  <div className={styles.button_wrap}>
                    <div
                      {...getRootProps()}
                      className={`${styles.button} ${styles.option_button}`}
                    >
                      <input {...getInputProps()} />
                      <Button
                        type="button"
                        buttonType="option"
                        aria-label="변경"
                      >
                        변경
                      </Button>
                    </div>
                    <Button
                      type="button"
                      buttonType="delete"
                      aria-label="삭제"
                      className={styles.button}
                      onClick={() => {
                        setLoadingStates((prev) => ({
                          ...prev,
                          [imageKey]: true,
                        }));

                        deleteProductMainImageMutation.mutate({
                          id,
                          key: imageKey,
                        });
                      }}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={styles.none_image_input_wrap}
                >
                  <input {...getInputProps()} />
                  <p className={styles.image_input_wrap_p}>
                    파일을 끌어다놓거나
                    <br />
                    클릭하여 업로드 하세요.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
