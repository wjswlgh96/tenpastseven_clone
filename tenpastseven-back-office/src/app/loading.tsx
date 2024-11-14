import styles from "./loading.module.css";

import Spinner from "@/components/atoms/spinner";

export default function Loading() {
  return (
    <div className={styles.overlay}>
      <Spinner />
    </div>
  );
}
