"use client";

import styles from "@/styles/_atoms/input.module.css";
import SvgButton from "./svg-button";

import { motion } from "motion/react";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
  handleEraseButton?: () => void;
  containerClassName?: string | undefined;
}

export default function Input(props: Props) {
  const {
    label,
    className,
    containerClassName,
    handleEraseButton,
    ...filterProps
  } = props;

  return (
    <div className={`${styles.container} ${containerClassName}`}>
      {label && (
        <motion.label
          htmlFor={label}
          className={styles.label}
          whileHover={{ opacity: 0.6 }}
        >
          {label}
          {filterProps.required && (
            <span className={styles.label_required}>*</span>
          )}
        </motion.label>
      )}

      <input
        className={`${styles.input} ${className}`}
        id={label}
        {...filterProps}
      />
      {handleEraseButton && (
        <SvgButton
          name={"x-mark"}
          onClick={() => {
            handleEraseButton();
          }}
          className={styles.erase_button}
        />
      )}
    </div>
  );
}
