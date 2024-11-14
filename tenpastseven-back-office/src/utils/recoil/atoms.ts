import { UserType, ProductTypes } from "@shared/types";
import { atom } from "recoil";

export const userState = atom<UserType | null>({
  key: "userState",
  default: null,
});

export const productState = atom<ProductTypes[] | null>({
  key: "productState",
  default: null,
});

export const isSidebarState = atom({
  key: "isSidebarState",
  default: true,
});
