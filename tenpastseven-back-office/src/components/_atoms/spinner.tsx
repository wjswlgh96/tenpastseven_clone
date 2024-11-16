"use client";

import { motion, MotionProps } from "motion/react";
import styles from "@/styles/_atoms/spinner.module.css";

interface Props extends MotionProps {
  size?: number | string | undefined;
  borderWidth?: number | string | undefined;
}

export default function Spinner({ size, borderWidth }: Props) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className={styles.spinner}
      style={{
        width: size && size,
        height: size && size,
        borderWidth: borderWidth,
      }}
    />
  );
}
