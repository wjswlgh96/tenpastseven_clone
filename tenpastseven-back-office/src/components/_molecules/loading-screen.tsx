import Spinner from "../_atoms/spinner";
import styles from "@/styles/_molecules/loading.module.css";

export default function LoadingScreen() {
  return (
    <div className={styles.overlay}>
      <Spinner size={80} borderWidth={"5px"} />
    </div>
  );
}
