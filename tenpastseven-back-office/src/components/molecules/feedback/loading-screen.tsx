import Spinner from "@/components/atoms/feedback/spinner";
import styles from "./loading-screen.module.css";

export default function LoadingScreen() {
  return (
    <div className={styles.overlay}>
      <Spinner size={80} borderWidth={"5px"} />
    </div>
  );
}
