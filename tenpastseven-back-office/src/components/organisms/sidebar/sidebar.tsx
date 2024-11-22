"use client";

import styles from "./sidebar.module.css";

import { useRecoilState } from "recoil";
import { motion, Variants } from "motion/react";
import { isSidebarState } from "@/utils/recoil/atoms";

import Svg from "@/components/atoms/icons/svg";
import SvgButton from "@/components/molecules/icons/svg-button";
import SidebarListItem from "./sidebar-list-item";

import { sidebarList } from "@/constant/sidebar";
import { useRouter } from "next/navigation";

const sidebarVariants: Variants = {
  initial: {
    width: 300,
  },
  active: {
    width: 75,
  },
};

export default function SideBar() {
  const router = useRouter();
  const [isSidebar, setIsSidebar] = useRecoilState(isSidebarState);

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={"initial"}
      animate={isSidebar ? "initial" : "active"}
      transition={{ type: "tween", duration: 0.2 }}
      className={styles.container}
    >
      {isSidebar ? (
        <>
          <div className={styles.header_wrap}>
            <Svg
              className={styles.logo}
              name="logo"
              onClick={() => router.replace("/")}
            />
            <SvgButton
              className={styles.svg_wrap}
              name="angles-left"
              onClick={() => setIsSidebar((prev) => !prev)}
            />
          </div>
          <nav className={styles.nav}>
            <ul>
              {sidebarList.map((sidebar) => (
                <SidebarListItem key={sidebar.id} sidebar={sidebar} />
              ))}
            </ul>
          </nav>
        </>
      ) : (
        <div className={styles.inactive_header_wrap}>
          <SvgButton
            name="angles-right"
            onClick={() => setIsSidebar((prev) => !prev)}
          />
        </div>
      )}
    </motion.aside>
  );
}
