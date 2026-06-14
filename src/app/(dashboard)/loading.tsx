import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";

import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.page}>
      <ProgressCircle aria-label="Loading..." className={styles.spinner} />
      <p className={styles.text}>Loading...</p>
    </div>
  );
}
