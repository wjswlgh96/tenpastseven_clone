import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";

import { ProductEditorState } from "@shared/types";

import SubTitle from "@/components/atoms/typography/subtitle";
import ProductEditorImageItem from "@/components/molecules/product/editor/product-editor-image-item";

import styles from "./product-editor-detail-image-form.module.css";
import Spinner from "@/components/atoms/feedback/spinner";

import { useSetRecoilState } from "recoil";
import { detailImagesFormDataState } from "@/utils/recoil/atoms";
import { deleteProductDetailImage } from "@/actions/products";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface ProductEditorDetailImageFormProps {
  id: string;
  detailImages: string[];
  setFormData: Dispatch<SetStateAction<ProductEditorState>>;
}

export default function ProductEditorDetailImageForm({
  id,
  detailImages,
  setFormData,
}: ProductEditorDetailImageFormProps) {
  const setDetailImagesFormData = useSetRecoilState(detailImagesFormDataState);
  const [imagesUrls, setImagesUrls] = useState<string[]>([]);

  const deleteMainImageMutation = useMutation({
    mutationFn: deleteProductDetailImage,
    onSuccess: ({ message, index }) => {
      toast.success(message, {
        position: "bottom-right",
      });

      const newImagesUrls = imagesUrls.filter((_, i) => i !== index);
      setImagesUrls(newImagesUrls);

      setFormData((prev) => ({
        ...prev,
        detail_images: newImagesUrls,
      }));
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const files = acceptedFiles;
      const formData = new FormData();
      const urls: string[] = [];

      files.forEach((file) => {
        formData.append("file", file);
        const newUrl = URL.createObjectURL(file);
        urls.push(newUrl);
      });

      setDetailImagesFormData((prev) => {
        const newFormData = new FormData();
        if (prev) {
          Array.from(prev.entries()).forEach(([key, value]) => {
            newFormData.append(key, value);
          });
        }
        Array.from(formData.entries()).forEach(([key, value]) => {
          newFormData.append(key, value);
        });
        return newFormData;
      });

      setImagesUrls((prev) => [...prev, ...urls]);
    },
    [id, setFormData]
  );

  useEffect(() => {
    setImagesUrls(detailImages);
  }, [detailImages]);

  useEffect(() => {
    return () => {
      Object.values(imagesUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [imagesUrls]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div className={styles.image_wrap}>
      <SubTitle className={styles.image_wrap_subtitle}>
        상품 디테일 페이지 이미지 등록
      </SubTitle>
      {imagesUrls && imagesUrls.length > 0 ? (
        <div className={styles.image_list_wrap}>
          <div className={styles.image_list_images_wrap}>
            {imagesUrls.map((imageUrl, index) => (
              <ProductEditorImageItem
                key={imageUrl}
                src={imageUrl}
                alt={`상품 디테일 이미지-${imageUrl}`}
                width={100}
                height={100}
                onDelete={() =>
                  deleteMainImageMutation.mutate({ id, url: imageUrl, index })
                }
                className={styles.image_list_images_item}
              />
            ))}
          </div>

          <div {...getRootProps()} className={styles.image_list_input_wrap}>
            <div>
              <input {...getInputProps()} />
              <p className={styles.input_p}>
                {isDragActive ? (
                  "이미지를 놓으시면 등록됩니다"
                ) : (
                  <>
                    이미지를 드래그
                    <br />
                    하거나 클릭하시면
                    <br />
                    이미지가 추가됩니다
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div {...getRootProps()} className={styles.none_image_input_wrap}>
          <input {...getInputProps()} />
          <p className={styles.input_p}>
            {isDragActive
              ? "이미지를 놓으시면 등록됩니다"
              : "이미지를 드래그 하거나 클릭하여 등록하세요"}
          </p>
        </div>
      )}
    </div>
  );
}
