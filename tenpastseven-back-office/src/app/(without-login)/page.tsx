"use client";

import { userState } from "@/utils/recoil/atoms";
import { useRecoilValue } from "recoil";

export default function Home() {
  const user = useRecoilValue(userState);

  return <div>안뇽하세용?? {user?.username}</div>;
}
