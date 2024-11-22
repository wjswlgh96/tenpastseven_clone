"use client";

import { motion } from "motion/react";
import styles from "./textarea.module.css";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label?: string;
  containerClassName?: string | undefined;
}

export default function TextArea(props: Props) {
  const { label, className, containerClassName, ...filterProps } = props;

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

      <textarea
        className={`${styles.textArea} ${className}`}
        id={label}
        {...filterProps}
      />
    </div>
  );
}
