"use client";

import { type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { ServerDataTable } from "@/components/ui/ServerDataTable/ServerDataTable";
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
    <ServerDataTable
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
