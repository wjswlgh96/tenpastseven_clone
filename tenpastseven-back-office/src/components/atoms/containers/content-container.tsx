"use client";

import styles from "./content-container.module.css";

import { useRecoilValue } from "recoil";
import { isSidebarState } from "@/utils/recoil/atoms";

import { motion, Variants } from "motion/react";

const contentVariants: Variants = {
  initial: {
    paddingLeft: 300,
  },
  active: {
    paddingLeft: 75,
  },
};

export default function ContentContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSidebar = useRecoilValue(isSidebarState);

  return (
    <motion.section
      variants={contentVariants}
      initial={"initial"}
      animate={isSidebar ? "initial" : "active"}
      transition={{ type: "tween", duration: 0.2 }}
      className={styles.container}
    >
      {children}
    </motion.section>
  );
}
