"use client";

import styles from "@/styles/atoms/input.module.css";
import SvgButton from "./svg-button";
import { useRef } from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
  eraseButton?: boolean;
  containerClassName?: string | undefined;
}

export default function Input(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { label, className, containerClassName, eraseButton, ...filterProps } =
    props;

  return (
    <div className={`${styles.container} ${containerClassName}`}>
      {label && (
        <label htmlFor={label} className={styles.label}>
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        className={`${styles.input} ${className}`}
        id={label}
        {...filterProps}
      />
      {eraseButton && (
        <SvgButton
          name={"x-mark"}
          onClick={() => {
            if (inputRef && inputRef.current) {
              inputRef.current.value = "";
            }
          }}
          className={styles.erase_button}
        />
      )}
    </div>
  );
}
