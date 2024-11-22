import {
  ProductEditorState,
  ProductImage,
  ProductType,
  SizeType,
} from "@shared/types";
import { v4 } from "uuid";

interface StatusCard {
  title: string;
  href: string;
  bgColor: string;
  textColorClass: "blue_text" | "red_text";
  getValue: (data: ProductType[] | null | undefined) => number;
}

export const PRODUCT_STATUS_CARDS: StatusCard[] = [
  {
    title: "전체 등록 상품",
    href: "/product/list",
    bgColor: "#F5F8FF",
    textColorClass: "blue_text",
    getValue: (data) => data?.length ?? 0,
  },
  {
    title: "판매 중인 상품",
    href: "/product/list?q=is_sale",
    bgColor: "#F1f1f1",
    textColorClass: "blue_text",
    getValue: (data) => data?.filter((product) => product.is_sale).length ?? 0,
  },
  {
    title: "판매 중이지 않은 상품",
    href: "/product/list?q=none_sale",
    bgColor: "#F1f1f1",
    textColorClass: "red_text",
    getValue: (data) =>
      data ? data.length - data.filter((product) => product.is_sale).length : 0,
  },
  {
    title: "품절 상품",
    href: "/product/list?q=sold_out",
    bgColor: "#F1f1f1",
    textColorClass: "red_text",
    getValue: (data) =>
      data?.filter((product) => product.is_sold_out).length ?? 0,
  },
] as const;

export const QUANTITY_ITEMS = [
  { label: "전체", value: "all", isRed: false },
  { label: "판매함", value: "is_sale", isRed: false },
  { label: "판매안함", value: "none_sale", isRed: true },
  { label: "품절상품", value: "sold_out", isRed: true },
] as const;

export const SALE_STATUS_OPTIONS = {
  all: "전체",
  empty1: "----------------",
  is_sale: "판매중",
  none_sale: "판매안함",
  sold_out: "품절상품",
} as const;

export const SORT_OPTIONS = {
  created_at_a: "등록일 순",
  created_at_d: "등록일 역순",
  empty1: "----------------",
  name_a: "상품명 순",
  name_d: "상품명 역순",
  empty2: "----------------",
  price_a: "판매가 순",
  price_d: "판매가 역순",
} as const;

export const TABLE_HEADERS = [
  { key: "checkbox", label: "", width: "0.15fr" },
  { key: "no", label: "No", width: "0.3fr" },
  { key: "info", label: "상품정보", width: "1fr" },
  { key: "price", label: "판매가", width: "0.5fr" },
  { key: "discount", label: "할인가", width: "0.5fr" },
  { key: "status", label: "판매상태", width: "0.3fr" },
  { key: "stock", label: "재고상태", width: "0.3fr" },
] as const;

export const SIZES: SizeType[] = ["S", "M", "L"] as const;
export const INITIAL_PRODUCT_EDITOR_STATE: ProductEditorState = {
  id: v4(),
  name: "",
  description: "",
  price: 0,
  options: {},
  main_images: {
    main_url: "",
    list_url_01: "",
    list_url_02: "",
  },
  detail_images: null,
  is_sale: false,
  sale_price: null,
  created_at: new Date().toISOString(),
};

interface MainImageListItem {
  name: keyof ProductImage;
  label: string;
}

export interface MainImageList {
  main_url: MainImageListItem;
  list_url_01: MainImageListItem;
  list_url_02: MainImageListItem;
}

export const MAIN_IMAGE_LIST: MainImageList = {
  main_url: {
    name: "main_url",
    label: "메인 이미지",
  },
  list_url_01: {
    name: "list_url_01",
    label: "리스트 이미지 01",
  },
  list_url_02: {
    name: "list_url_02",
    label: "리스트 이미지 02",
  },
} as const;
