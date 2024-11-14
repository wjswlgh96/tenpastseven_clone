"use client";

import { logout } from "@/actions/auth";
import Svg from "../atoms/svg";

export default function LogOutButton() {
  const onClick = async () => {
    await logout();
  };

  return <Svg onClick={onClick} name={"log-out"} />;
}
