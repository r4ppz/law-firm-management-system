"use client";

import { type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { ServerDataTable } from "@/components/ui/ServerDataTable/ServerDataTable";
import { getConsultationNotesPaginatedAction } from "@/features/consultations/actions";
import type { NoteRow } from "@/features/consultations/queries";

interface Props {
  consultationId: string;
}

const columns: ColumnDef<NoteRow>[] = [
  { id: "content", name: "Content", isRowHeader: true },
  { id: "author", name: "Author" },
  { id: "created_at", name: "Created At" },
];

export function NotesTab({ consultationId }: Props) {
  return (
    <ServerDataTable
      fetchAction={(p) => getConsultationNotesPaginatedAction({ consultationId, ...p })}
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
