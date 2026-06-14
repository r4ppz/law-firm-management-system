"use client";

import { DataTable, type ColumnDef } from "@/components/ui/DataTable/DataTable";

import styles from "./MiniTable.module.css";

interface MiniTableProps<T extends { id: string }> {
  columns: ColumnDef<T>[];
  rows: T[];
  heading: string;
  emptyContent?: React.ReactNode;
}

export function MiniTable<T extends { id: string }>({
  columns,
  rows,
  heading,
  emptyContent = "No data available.",
}: MiniTableProps<T>) {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>{heading}</h3>
      <DataTable columns={columns} rows={rows} emptyContent={emptyContent} />
    </div>
  );
}
