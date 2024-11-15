"use server";

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
    return { error: error.message };
  }

  const userId = data.user.id;
  if (!userId) {
    return { error: "유저 ID를 찾을 수 없습니다." };
  }

  const { data: userInfo, error: userError } = await supabase
    .from("userinfo")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError) {
    return { error: userError.message };
  }

  if (!userInfo?.admin) {
    return {
      error: "허용된 사용자만 로그인이 가능합니다. 관리자에게 문의하세요.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function signUp() {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signUp({
    email: "wjswlgh96@naver.com",
    password: "Dndldka19@",
    options: {
      data: {
        username: "전지호",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { data: "회원가입 성공!!" };
}
