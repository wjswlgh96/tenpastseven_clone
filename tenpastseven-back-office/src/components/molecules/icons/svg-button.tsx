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
<<<<<<< HEAD
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
=======
  return (
    <motion.div
      className={`${styles.container} ${className}`}
      onClick={onClick}
      whileHover={{ opacity: 0.6 }}
      style={style}
      aria-label={name}
>>>>>>> 1f0373c666f00ca74a3efd57466311724d8ebe1b
    >
      <Svg name={name} />
    </motion.div>
  );
}
