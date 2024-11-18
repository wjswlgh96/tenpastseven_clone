"use client";

import styles from "./button.module.css";
import clsx from "clsx";
import { HTMLMotionProps, motion, Variants } from "motion/react";
import Spinner from "../feedback/spinner";

type ButtonType = "option" | "delete";

interface ButtonProps extends HTMLMotionProps<"button"> {
  buttonType?: ButtonType;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

const BUTTON_CONSTANTS = {
  variants: {
    initial: { opacity: 1 },
    hover: { opacity: 0.6 },
  } as Variants,

  styles: {
    option: {
      backgroundColor: "#f5f5dc",
      color: "#5d4037",
    },
    delete: {
      backgroundColor: "#ff4c4c",
    },
  },

  sizes: {
    sm: {
      padding: "0.25rem 0.5rem",
      fontSize: "12px",
      borderRadius: "4px",
    },
    md: {
      padding: "0.5rem 1rem",
      fontSize: "14px",
      borderRadius: "6px",
    },
    lg: {
      padding: "0.75rem 1.5rem",
      fontSize: "16px",
      borderRadius: "8px",
    },
  },

  transition: {
    duration: 0.1,
  },
} as const;

export default function Button({
  buttonType,
  loading = false,
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const buttonClassName = clsx(styles.button, className);

  const buttonStyle = {
    ...BUTTON_CONSTANTS.sizes[size],
    ...(buttonType ? BUTTON_CONSTANTS.styles[buttonType] : {}),
  };

  return (
    <motion.button
      {...rest}
      className={buttonClassName}
      variants={BUTTON_CONSTANTS.variants}
      initial="initial"
      whileHover="hover"
      transition={BUTTON_CONSTANTS.transition}
      style={buttonStyle}
    >
      {loading ? <Spinner size={20} /> : children}
    </motion.button>
  );
}
