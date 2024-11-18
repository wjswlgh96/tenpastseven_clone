"use client";

import styles from "./header.module.css";

import SvgButton from "@/components/molecules/icons/svg-button";

import { useRecoilState } from "recoil";
import { userState } from "@/utils/recoil/atoms";
import { logout } from "@/actions/auth";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

export default function Header() {
  const [user, setUser] = useRecoilState(userState);

  const logOutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await logout();

      if (error) {
        toast.error(error);
        return;
      }

      setUser(null);
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
