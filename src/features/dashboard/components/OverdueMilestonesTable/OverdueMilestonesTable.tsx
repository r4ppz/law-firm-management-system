"use client";

import { useEffect, useState, useTransition } from "react";

import { DataTable, type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";
import type { OverdueMilestoneRow } from "@/features/dashboard/queries";
import { formatDate } from "@/lib/date";

import styles from "./OverdueMilestonesTable.module.css";

interface OverdueMilestonesTableProps {
  milestones: OverdueMilestoneRow[];
}

const columns: ColumnDef<OverdueMilestoneRow>[] = [
  { id: "caseTitle", name: "Case Title", isRowHeader: true },
  { id: "milestoneTitle", name: "Milestone" },
  {
    id: "due_date",
    name: "Due Date",
    render: (value) => formatDate(value as Date),
  },
];

export function OverdueMilestonesTable({ milestones }: OverdueMilestonesTableProps) {
  const [isClient, setIsClient] = useState(false);
  const [, startTransition] = useTransition();
  useEffect(() => {
    startTransition(() => setIsClient(true));
  }, [startTransition]);

  if (!isClient) {
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
      <DataTable columns={columns} rows={milestones} emptyContent={"No data yet"} />
    </div>
  );
}
