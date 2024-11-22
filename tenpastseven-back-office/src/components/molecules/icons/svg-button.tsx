import { MouseEventHandler } from "react";
import Svg from "../../atoms/icons/svg";
import { SvgList } from "@shared/types";
import { motion, MotionStyle } from "motion/react";

import styles from "./svg-button.module.css";

interface Props {
  name: SvgList;
  onClick: MouseEventHandler<HTMLDivElement>;

  className?: string | undefined;
  style?: MotionStyle;
}

export default function SvgButton({ name, onClick, className, style }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClick(e);
  };

  return (
    <motion.div
      className={`${styles.container} ${className}`}
      onClick={handleClick}
      whileHover={{ opacity: 0.6 }}
      style={style}
      aria-label={name}
      draggable={false}
    >
      <Svg name={name} />
    </motion.div>
  );
}
