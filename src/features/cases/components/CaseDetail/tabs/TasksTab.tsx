"use client";

import clsx from "clsx";

import { type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { PaginatedDataTab } from "@/components/ui/PaginatedDataTab/PaginatedDataTab";
import { getCaseTasksPaginatedAction } from "@/features/cases/actions";
import type { TaskRow } from "@/features/cases/queries";

import tabStyles from "./Tab.module.css";

interface Props {
  caseId: string;
}

const statusClassMap: Record<string, string> = {
  Pending: tabStyles.statusPending,
  Ongoing: tabStyles.statusOngoing,
  Submitted: tabStyles.statusInfo,
  Accepted: tabStyles.statusDone,
  Rejected: tabStyles.statusCancelled,
  Cancelled: tabStyles.statusCancelled,
};

const columns: ColumnDef<TaskRow>[] = [
  { id: "title", name: "Title", isRowHeader: true, allowsSorting: true },
  {
    id: "status",
    name: "Status",
    render: (value) => {
      const s = value as string;
      return <span className={clsx(tabStyles.badge, statusClassMap[s])}>{s}</span>;
    },
  },
  { id: "assignTo", name: "Assigned To" },
  { id: "updated_at", name: "Updated At" },
];

export function TasksTab({ caseId }: Props) {
  return (
    <PaginatedDataTab
      fetchAction={(p) => getCaseTasksPaginatedAction({ caseId, ...p })}
      columns={columns}
      searchPlaceholder="Search tasks..."
      emptyContent="No tasks yet"
      loadingMessage="Loading tasks..."
      searchLabel="Search tasks"
      renderAddButton
      addButtonLabel="Add Task"
    />
  );
}
