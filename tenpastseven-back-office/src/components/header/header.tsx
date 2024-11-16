"use client";

import styles from "./header.module.css";

import { useRecoilValue } from "recoil";
import { userState } from "@/utils/recoil/atoms";
import SvgButton from "../_atoms/svg-button";
import { logout } from "@/actions/auth";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

export default function Header() {
  const user = useRecoilValue(userState);

  const logOutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await logout();

      if (error) {
        toast.error(error);
        return;
      }
    },
  });

  return (
    <header className={styles.container}>
      <p>좋은 하루 보내세요. {user?.username}님 😊</p>
      <SvgButton
        name="log-out"
        onClick={() => {
          logOutMutation.mutate();
        }}
      />
    </header>
  );
}
