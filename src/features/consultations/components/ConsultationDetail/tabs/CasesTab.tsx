"use client";

import clsx from "clsx";

import { type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { PaginatedDataTab } from "@/components/ui/PaginatedDataTab/PaginatedDataTab";
import { getConsultationCasesPaginatedAction } from "@/features/consultations/actions";
import type { CaseRow } from "@/features/consultations/queries";

import tabStyles from "./Tab.module.css";

interface Props {
  consultationId: string;
}

const statusClassMap: Record<string, string> = {
  Pending: tabStyles.statusPending,
  Open: tabStyles.statusInfo,
  Ongoing: tabStyles.statusInfo,
  Closed: tabStyles.statusDone,
  Terminated: tabStyles.statusCancelled,
  Settled: tabStyles.statusInfo,
  Done: tabStyles.statusDone,
  Cancelled: tabStyles.statusCancelled,
};

const columns: ColumnDef<CaseRow>[] = [
  { id: "case_title", name: "Case Title", isRowHeader: true },
  { id: "case_type", name: "Type" },
  {
    id: "status",
    name: "Status",
    render: (value) => {
      const status = value as string;
      return <span className={clsx(tabStyles.badge, statusClassMap[status])}>{status}</span>;
    },
  },
  { id: "created_at", name: "Created At" },
];

export function CasesTab({ consultationId }: Props) {
  return (
    <PaginatedDataTab
      fetchAction={(p) => getConsultationCasesPaginatedAction({ consultationId, ...p })}
      columns={columns}
      searchPlaceholder="Search cases..."
      emptyContent="No cases yet"
      loadingMessage="Loading cases..."
      searchLabel="Search cases"
      renderAddButton
      addButtonLabel="Add Case"
    />
  );
}
