"use client";

import styles from "./sidebar-list-item.module.css";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Svg from "@/components/atoms/icons/svg";
import { SidebarListType } from "@shared/types";

interface SidebarListItemProps {
  sidebar: SidebarListType;
}

export default function SidebarListItem({ sidebar }: SidebarListItemProps) {
  const pathname = usePathname();

  return (
    <li>
      <Link
        href={sidebar.href}
        className={`${styles.nav_a} ${
          pathname.startsWith(sidebar.href) ? styles.nav_active : ""
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
