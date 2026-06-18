"use client";

import { type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { PaginatedDataTab } from "@/components/ui/PaginatedDataTab/PaginatedDataTab";
import { getCaseDocumentsPaginatedAction } from "@/features/cases/actions";
import type { DocumentRow } from "@/features/cases/queries";

interface Props {
  caseId: string;
}

const columns: ColumnDef<DocumentRow>[] = [
  { id: "file_name", name: "File Name", isRowHeader: true, allowsSorting: true },
  { id: "file_type", name: "Type" },
  { id: "file_size", name: "Size" },
  { id: "uploadedBy", name: "Uploaded By" },
  { id: "created_at", name: "Date" },
];

export function AttachmentsTab({ caseId }: Props) {
  return (
    <PaginatedDataTab
      fetchAction={(p) => getCaseDocumentsPaginatedAction({ caseId, ...p })}
      columns={columns}
      searchPlaceholder="Search attachments..."
      emptyContent="No attachments yet"
      loadingMessage="Loading attachments..."
      searchLabel="Search attachments"
      renderAddButton
      addButtonLabel="Add Attachment"
    />
  );
}
