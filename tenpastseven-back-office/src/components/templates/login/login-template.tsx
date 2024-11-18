"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import Input from "@/components/atoms/inputs/input";
import Button from "@/components/atoms/buttons/button";
import Svg from "@/components/atoms/icons/svg";

import { login } from "@/actions/auth";

import styles from "./login-template.module.css";

interface LoginFormDataType {
  email: string;
  password: string;
}

export default function LoginTemplate() {
  const [formData, setFormData] = useState<LoginFormDataType>({
    email: "",
    password: "",
  });

  const signInMutation = useMutation({
    mutationFn: async () => {
      const { error } = await login(formData);

      if (error) {
        toast.error(error);
        return;
      }
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    signInMutation.mutate();
  };

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <Svg name="logo" className={styles.logo} />
      <p className={styles.desc}>TEN PAST SEVEN - 백오피스 페이지입니다.</p>
      <Input
        value={formData.email}
        onChange={handleChange}
        type="email"
        label="이메일"
      />
      <Input
        value={formData.password}
        onChange={handleChange}
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
  );
}
