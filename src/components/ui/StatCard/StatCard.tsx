import clsx from "clsx";

import styles from "./StatCard.module.css";

interface StatCardProps {
  label: string;
  value: number;
  accent?: "open" | "scheduled" | "users" | "overdue";
}

const accentClassMap: Record<string, string> = {
  open: styles.accentOpen,
  scheduled: styles.accentScheduled,
  users: styles.accentUsers,
  overdue: styles.accentOverdue,
};

export function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className={clsx(styles.card, accent && accentClassMap[accent])}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
