import { UserType } from "@shared/types";
import { atom } from "recoil";

export const userState = atom<UserType | null>({
  key: "userState",
  default: null,
});

export const isSidebarState = atom({
  key: "isSidebarState",
  default: true,
});

export interface MainImagesFormData {
  main_url: FormData | null;
  list_url_01: FormData | null;
  list_url_02: FormData | null;
}
export const mainImagesFormDataState = atom<MainImagesFormData>({
  key: "mainImagesFormDataState",
  default: {
    main_url: null,
    list_url_01: null,
    list_url_02: null,
  },
});

export interface DetailImagesData {
  image_id: string;
  image_url: string;
  image_form_data: FormData | null;
}

export const detailImagesDataState = atom<DetailImagesData[]>({
  key: "detailImagesDataState",
  default: [],
});
