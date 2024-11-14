"use client";

import { motion, MotionProps } from "motion/react";
import styles from "@/styles/atoms/spinner.module.css";

interface Props extends MotionProps {
  size?: number | string | undefined;
}

export default function Spinner({ size }: Props) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className={styles.spinner}
      style={{
        width: size && size,
        height: size && size,
      }}
    />
  );
}
