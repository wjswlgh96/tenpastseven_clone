"use client";

import styles from "./sidebar-list-item.module.css";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Svg from "../atoms/svg";
import { SidebarListType } from "@/types/sidebar";

interface Props {
  sidebar: SidebarListType;
}

export default function SidebarListItem({ sidebar }: Props) {
  const pathname = usePathname();

  return (
    <li>
      <Link
        href={sidebar.href}
        className={`${styles.nav_a} ${
          pathname === sidebar.href ? styles.nav_active : ""
        }`}
      >
        <Svg name={sidebar.icon_name} />
        <div className={styles.nav_right_wrap}>
          <p>{sidebar.content}</p>
          <Svg name="chevron-right" />
        </div>
      </Link>
    </li>
  );
}
