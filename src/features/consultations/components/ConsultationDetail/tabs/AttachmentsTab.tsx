"use client";

import { type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { PaginatedDataTab } from "@/components/ui/PaginatedDataTab/PaginatedDataTab";
import { getConsultationDocumentsPaginatedAction } from "@/features/consultations/actions";
import type { DocumentRow } from "@/features/consultations/queries";

interface Props {
  consultationId: string;
}

const columns: ColumnDef<DocumentRow>[] = [
  { id: "file_name", name: "File Name", isRowHeader: true },
  { id: "file_type", name: "Type" },
  { id: "file_size", name: "Size" },
  { id: "uploadedBy", name: "Uploaded By" },
  { id: "created_at", name: "Uploaded At" },
];

export function AttachmentsTab({ consultationId }: Props) {
  return (
    <PaginatedDataTab
      fetchAction={(p) => getConsultationDocumentsPaginatedAction({ consultationId, ...p })}
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
