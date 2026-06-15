"use client";

import { useEffect, useState } from "react";

import { DataTable, type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";
import { getOverdueMilestonesAction } from "@/features/dashboard/actions";
import type { OverdueMilestoneRow } from "@/features/dashboard/queries";

import styles from "./OverdueMilestonesTable.module.css";

const columns: ColumnDef<OverdueMilestoneRow>[] = [
  { id: "caseTitle", name: "Case Title", isRowHeader: true },
  { id: "milestoneTitle", name: "Milestone" },
  {
    id: "due_date",
    name: "Due Date",
    render: (value) => {
      const date = value as Date;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
  },
];

export function OverdueMilestonesTable() {
  const [items, setItems] = useState<OverdueMilestoneRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getOverdueMilestonesAction().then((result) => {
      if (cancelled) return;
      setItems(result);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <h3 className={styles.heading}>Overdue Milestones</h3>
        <div className={styles.loadingContainer}>
          <ProgressCircle aria-label="Loading overdue milestones..." />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>Overdue Milestones</h3>
      <DataTable columns={columns} rows={items} />
    </div>
  );
}
