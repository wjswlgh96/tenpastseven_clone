"use server";

import { MessageResponse } from "./type";
import mapSupabaseError from "@/utils/supabase/errorMessage";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const message = mapSupabaseError(error);
    throw new Error(message);
  }

  const userId = data.user.id;
  if (!userId) {
    const message = "유저 ID를 찾을 수 없습니다.";
    throw new Error(message);
  }

  const { data: userInfo, error: userError } = await supabase
    .from("userinfo")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError) {
    const message = mapSupabaseError(userError);
    throw new Error(message);
  }

  if (!userInfo?.admin) {
    const message =
      "허용된 사용자만 로그인이 가능합니다. 관리자에게 문의하세요.";
    throw new Error(message);
  }

  revalidatePath("/login");
  redirect("/");
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    const message = mapSupabaseError(error);
    throw new Error(message);
  }

  revalidatePath("/");
  redirect("/login");
}

export async function signUp(): Promise<MessageResponse> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signUp({
    email: "",
    password: "",
    options: {
      data: {
        username: "username",
      },
    },
  });

  if (error) {
    const message = mapSupabaseError(error);
    throw new Error(message);
  }

  return { success: true, message: "회원가입을 축하드립니다." };
}
