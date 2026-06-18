"use client";

import { type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { PaginatedDataTab } from "@/components/ui/PaginatedDataTab/PaginatedDataTab";
import { getConsultationActivityLogPaginatedAction } from "@/features/consultations/actions";
import type { ActivityLogRow } from "@/features/consultations/queries";

interface Props {
  consultationId: string;
}

const columns: ColumnDef<ActivityLogRow>[] = [
  { id: "action", name: "Action", isRowHeader: true },
  { id: "actor", name: "Actor" },
  { id: "details", name: "Details" },
  { id: "created_at", name: "Date" },
];

export function ActivityLogTab({ consultationId }: Props) {
  return (
    <PaginatedDataTab
      fetchAction={(p) => getConsultationActivityLogPaginatedAction({ consultationId, ...p })}
      columns={columns}
      searchPlaceholder="Search activity..."
      emptyContent="No activity yet"
      loadingMessage="Loading activity log..."
      searchLabel="Search activity"
    />
  );
}
