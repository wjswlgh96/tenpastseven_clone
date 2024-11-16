"use client";

import { FormEvent, useState } from "react";
import styles from "./page.module.css";

import Input from "@/components/_atoms/input";
import Button from "@/components/_atoms/button";
import Svg from "@/components/_atoms/svg";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { login } from "@/actions/auth";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const signInMutation = useMutation({
    mutationFn: async () => {
      const { error } = await login({ email, password });

      if (error) {
        toast.error(error);
        return;
      }
    },
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    signInMutation.mutate();
  };

  return (
    <>
      <form className={styles.container} onSubmit={onSubmit}>
        <Svg name="logo" className={styles.logo} />

        <p className={styles.desc}>TEN PAST SEVEN - 백오피스 페이지입니다.</p>

        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          label="이메일"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          label="비밀번호"
        />
        <Button
          loading={signInMutation.isPending}
          className={styles.login_button}
        >
          로그인
        </Button>
      </form>
    </>
  );
}
