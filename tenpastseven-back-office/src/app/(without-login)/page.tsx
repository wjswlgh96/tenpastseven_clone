import Svg from "@/components/_atoms/svg";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Svg className={styles.logo} name="logo" />
    </div>
  );
}
