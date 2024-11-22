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
import SortableDetailImageItem from "./sortable-detail-image-item";

import { v4 } from "uuid";

import styles from "./product-editor-detail-image-form.module.css";

import { useRecoilState } from "recoil";
import { detailImagesDataState } from "@/utils/recoil/atoms";
import {
  deleteAllProductDetailImages,
  deleteProductDetailImage,
} from "@/actions/products";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import Spinner from "@/components/atoms/feedback/spinner";
import Button from "@/components/atoms/buttons/button";
import LoadingScreen from "../../feedback/loading-screen";

interface ProductEditorDetailImageFormProps {
  id: string;
  setFormData: Dispatch<SetStateAction<ProductEditorState>>;
}

const measuringStrategy = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

export default function ProductEditorDetailImageForm({
  id,
  setFormData,
}: ProductEditorDetailImageFormProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const [detailImagesData, setDetailImagesData] = useRecoilState(
    detailImagesDataState
  );

  const [loadingStates, setLoadingStates] = useState<boolean[]>([]);

  useEffect(() => {
    setLoadingStates(
      Array.from({ length: detailImagesData.length }, () => false)
    );
  }, [detailImagesData]);

  const deleteDetailImageMutation = useMutation({
    mutationFn: deleteProductDetailImage,
    onSuccess: ({ message, index }) => {
      toast.success(message, {
        position: "bottom-right",
      });

      setLoadingStates((prev) => {
        const newLoadingStates = [...prev];
        newLoadingStates[index] = false;
        return newLoadingStates;
      });

      const newDetailImagesData = detailImagesData.filter(
        (_, i) => i !== index
      );
      setDetailImagesData(newDetailImagesData);

      setFormData((prev) => ({
        ...prev,
        detail_images: newDetailImagesData.map((data) => data.image_url),
      }));
    },
  });

  const deleteAllDetailImageMutation = useMutation({
    mutationFn: deleteAllProductDetailImages,
    onSuccess: ({ message }) => {
      toast.success(message, {
        position: "bottom-right",
      });

      setDetailImagesData([]);

      setFormData((prev) => ({
        ...prev,
        detail_images: [],
      }));
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const files = acceptedFiles;
      const formDatas: FormData[] = [];
      const urls: string[] = [];

      files.forEach((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formDatas.push(formData);
        const newUrl = URL.createObjectURL(file);
        urls.push(newUrl);
      });

      const newData = Array.from({ length: files.length }, (_, i) => ({
        image_id: v4(),
        image_url: urls[i],
        image_form_data: formDatas[i],
        isExisting: false,
      }));

      setDetailImagesData((prev) => [...prev, ...newData]);
    },

    [setDetailImagesData]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = detailImagesData.findIndex(
        (data) => data.image_id === active.id
      );
      const newIndex = detailImagesData.findIndex(
        (data) => data.image_id === over.id
      );

      setDetailImagesData(arrayMove(detailImagesData, oldIndex, newIndex));
    }
  };

  const handleDelete = (index: number) => {
    const url = detailImagesData[index].image_url;

    if (url.startsWith("blob:")) {
      const newDetailImagesData = detailImagesData.filter(
        (_, i) => i !== index
      );
      setDetailImagesData(newDetailImagesData);
      setFormData((prev) => ({
        ...prev,
        detail_images: newDetailImagesData.map((data) => data.image_url),
      }));

      toast.success("이미지가 성공적으로 삭제되었습니다");
      return;
    }

    deleteDetailImageMutation.mutate({
      id,
      url,
      index,
    });
  };

  const handleAllDelete = () => {
    if (detailImagesData.length === 0) {
      toast.error("디테일 이미지가 없습니다");
      return;
    }

    if (window.confirm("정말 디테일 이미지를 전체 삭제하시겠습니까?")) {
      if (
        detailImagesData.every((data) => data.image_url.startsWith("blob:"))
      ) {
        setDetailImagesData([]);
        setFormData((prev) => ({
          ...prev,
          detail_images: [],
        }));
      } else {
        deleteAllDetailImageMutation.mutate({ id });
      }
    }
  };

  useEffect(() => {
    if (detailImagesData) {
      detailImagesData.forEach((data) => {
        URL.revokeObjectURL(data.image_url);
      });
    }
  }, [detailImagesData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div className={styles.image_wrap}>
      {deleteAllDetailImageMutation.isPending && <LoadingScreen />}
      <div className={styles.image_wrap_header}>
        <SubTitle className={styles.image_wrap_subtitle}>
          상품 디테일 페이지 이미지 등록
        </SubTitle>
        <Button type="button" onClick={handleAllDelete} buttonType="delete">
          디테일 이미지 전체삭제
        </Button>
      </div>
      {detailImagesData.length > 0 ? (
        <div className={styles.image_list_wrap}>
          <div className={styles.image_list_images_wrap}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              measuring={measuringStrategy}
            >
              <SortableContext
                items={detailImagesData.map((data) => data.image_id)}
                strategy={rectSortingStrategy}
              >
                {detailImagesData.map((data, index) =>
                  loadingStates[index] ? (
                    <div className={styles.spinner_wrap} key={data.image_id}>
                      <Spinner size={"50px"} />
                    </div>
                  ) : (
                    <SortableDetailImageItem
                      key={data.image_id}
                      id={data.image_id}
                      src={data.image_url}
                      alt={`상품 디테일 이미지-${data.image_url}`}
                      width={100}
                      height={100}
                      onDelete={() => {
                        setLoadingStates((prev) => {
                          const newLoadingStates = [...prev];
                          newLoadingStates[index] = true;
                          return newLoadingStates;
                        });
                        handleDelete(index);
                      }}
                      className={styles.image_list_images_item}
                    />
                  )
                )}
              </SortableContext>
            </DndContext>
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
