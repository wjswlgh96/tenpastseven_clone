"use client";

import { useEffect, useMemo } from "react";

import { useSetRecoilState } from "recoil";
import { userState } from "../recoil/atoms";

import { createBrowserSupabaseClient } from "../supabase/client";

export default function AuthProvider() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        setUser(null);
        return;
      }

      const { data: userInfo } = await supabase
        .from("userinfo")
        .select("*")
        .eq("id", user.id)
        .single();

      setUser(userInfo || null);
    };

    fetchUser();
  }, [supabase, setUser]);

  return null;
}
