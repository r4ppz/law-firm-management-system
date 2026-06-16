"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { FaPlus } from "react-icons/fa6";

import { Button } from "@/components/ui/Button/Button";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";
import { SearchField } from "@/components/ui/SearchField/SearchField";
import { getCaseDocumentsPaginatedAction } from "@/features/cases/actions";
import type { DocumentRow } from "@/features/cases/queries";
import { useDebounce } from "@/lib/useDebounce";

import tabStyles from "./Tab.module.css";

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
  const [items, setItems] = useState<DocumentRow[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const isLoading = isPending || isLoadingMore;
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    let cancelled = false;
    startTransition(async () => {
      const result = await getCaseDocumentsPaginatedAction({
        caseId,
        search: debouncedSearch,
        pageSize: 10,
      });
      if (cancelled) return;
      setItems(result.rows);
      setCursor(result.nextCursor);
      setHasMore(result.nextCursor !== null);
      setIsInitialLoad(false);
    });
    return () => {
      cancelled = true;
    };
  }, [caseId, debouncedSearch, startTransition]);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore || !cursor) return;
    setIsLoadingMore(true);
    try {
      const result = await getCaseDocumentsPaginatedAction({
        caseId,
        search: debouncedSearch,
        cursor,
        pageSize: 10,
      });
      setItems((prev) => [...prev, ...result.rows]);
      setCursor(result.nextCursor);
      setHasMore(result.nextCursor !== null);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoading, hasMore, cursor, caseId, debouncedSearch]);

  const emptyContent =
    debouncedSearch && items.length === 0 && !isLoading
      ? `No attachments matching "${debouncedSearch}"`
      : !debouncedSearch && items.length === 0 && !isLoading
        ? "No attachments yet"
        : undefined;

  if (isInitialLoad) {
    return (
      <div className={tabStyles.loading}>
        <ProgressCircle aria-label="Loading attachments..." />
      </div>
    );
  }

  return (
    <div className={tabStyles.tabContent}>
      <div className={tabStyles.toolbar}>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search attachments..."
          aria-label="Search attachments"
        />
        <Button variant="secondary" className={tabStyles.addButton} aria-label="Add attachment">
          <FaPlus /> Add Attachment
        </Button>
      </div>
      <DataTable
        columns={columns}
        rows={items}
        selectionMode="single"
        selectionBehavior="replace"
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        isLoading={isLoading}
        emptyContent={emptyContent}
      />
    </div>
  );
}
