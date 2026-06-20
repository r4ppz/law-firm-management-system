"use client";

import { type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { ServerDataTable } from "@/components/ui/ServerDataTable/ServerDataTable";
import { getCaseActivityLogPaginatedAction } from "@/features/cases/actions";
import type { ActivityLogRow } from "@/features/cases/queries";

interface Props {
  caseId: string;
}

const columns: ColumnDef<ActivityLogRow>[] = [
  { id: "action", name: "Action", isRowHeader: true },
  { id: "actor", name: "Actor" },
  { id: "details", name: "Details" },
  { id: "created_at", name: "Timestamp" },
];

export function ActivityLogTab({ caseId }: Props) {
  return (
    <ServerDataTable
      fetchAction={(p) => getCaseActivityLogPaginatedAction({ caseId, ...p })}
      columns={columns}
      searchPlaceholder="Search activity..."
      emptyContent="No activity yet"
      loadingMessage="Loading activity log..."
      searchLabel="Search activity"
    />
  );
}
