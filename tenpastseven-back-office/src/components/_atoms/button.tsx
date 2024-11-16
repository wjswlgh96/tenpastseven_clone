"use client";

import styles from "@/styles/_atoms/button.module.css";
import { HTMLMotionProps, motion, Variants } from "motion/react";
import Spinner from "./spinner";

type buttonType = "option" | "delete";

type Props = HTMLMotionProps<"button"> & {
  buttonType?: buttonType | undefined;
  loading?: boolean;
};

const buttonVariants: Variants = {
  initial: { opacity: 1 },
  hover: { opacity: 0.6 },
};

const buttonStyles = {
  option: {
    backgroundColor: "#f5f5dc",
    color: "#5d4037",
  },
  delete: {
    backgroundColor: "#ff4c4c",
  },
};

export default function Button(props: Props) {
  const { buttonType, loading = false, className, children, ...rest } = props;

  const appliedStyles = buttonType ? buttonStyles[buttonType] : {};

  return (
    <motion.button
      {...rest}
      className={`${styles.button} ${className}`}
      variants={buttonVariants}
      initial={"initial"}
      whileHover={"hover"}
      transition={{
        duration: 0.1,
      }}
      style={appliedStyles}
    >
      {loading ? <Spinner size={20} /> : children}
    </motion.button>
  );
}
