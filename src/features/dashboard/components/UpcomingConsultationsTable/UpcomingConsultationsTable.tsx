"use client";

import { useEffect, useState } from "react";

import { DataTable, type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";
import { getUpcomingConsultationsAction } from "@/features/dashboard/actions";
import type { UpcomingConsultationRow } from "@/features/dashboard/queries";

import styles from "./UpcomingConsultationsTable.module.css";

const columns: ColumnDef<UpcomingConsultationRow>[] = [
  { id: "clientName", name: "Client Name", isRowHeader: true },
  { id: "concern", name: "Concern" },
  {
    id: "booking_datetime",
    name: "Date & Time",
    render: (value) => {
      const date = value as Date;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    },
  },
];

export function UpcomingConsultationsTable() {
  const [items, setItems] = useState<UpcomingConsultationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getUpcomingConsultationsAction().then((result) => {
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
        <h3 className={styles.heading}>Upcoming Consultations</h3>
        <div className={styles.loadingContainer}>
          <ProgressCircle aria-label="Loading upcoming consultations..." />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>Upcoming Consultations</h3>
      <DataTable columns={columns} rows={items} />
    </div>
  );
}
