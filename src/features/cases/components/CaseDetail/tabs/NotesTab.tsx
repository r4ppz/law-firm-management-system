"use client";

import { type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { PaginatedDataTab } from "@/components/ui/PaginatedDataTab/PaginatedDataTab";
import { getCaseNotesPaginatedAction } from "@/features/cases/actions";
import type { NoteRow } from "@/features/cases/queries";

interface Props {
  caseId: string;
}

const columns: ColumnDef<NoteRow>[] = [
  { id: "content", name: "Content", isRowHeader: true },
  { id: "author", name: "Author" },
  { id: "created_at", name: "Created At" },
];

export function NotesTab({ caseId }: Props) {
  return (
    <PaginatedDataTab
      fetchAction={(p) => getCaseNotesPaginatedAction({ caseId, ...p })}
      columns={columns}
      searchPlaceholder="Search notes..."
      emptyContent="No notes yet"
      loadingMessage="Loading notes..."
      searchLabel="Search notes"
      renderAddButton
      addButtonLabel="Add Note"
    />
  );
}
