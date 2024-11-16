"use client";

import styles from "@/styles/_atoms/card.module.css";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  shadow?: boolean;
  bgColor?: string | undefined;
};

export default function Card(props: Props) {
  const { shadow = true, bgColor, className, children, ...filterProps } = props;

  return (
    <div
      className={`${styles.card} ${
        shadow === false && styles.none_shadow
      } ${className}`}
      style={{ backgroundColor: bgColor }}
      {...filterProps}
    >
      {children}
    </div>
  );
}
