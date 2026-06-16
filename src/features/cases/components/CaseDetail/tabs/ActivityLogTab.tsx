"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import { DataTable, type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";
import { SearchField } from "@/components/ui/SearchField/SearchField";
import { getCaseActivityLogPaginatedAction } from "@/features/cases/actions";
import type { ActivityLogRow } from "@/features/cases/queries";
import { useDebounce } from "@/lib/useDebounce";

import tabStyles from "./Tab.module.css";

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
  const [items, setItems] = useState<ActivityLogRow[]>([]);
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
      const result = await getCaseActivityLogPaginatedAction({
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
      const result = await getCaseActivityLogPaginatedAction({
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
      ? `No activity matching "${debouncedSearch}"`
      : !debouncedSearch && items.length === 0 && !isLoading
        ? "No activity yet"
        : undefined;

  if (isInitialLoad) {
    return (
      <div className={tabStyles.loading}>
        <ProgressCircle aria-label="Loading activity log..." />
      </div>
    );
  }

  return (
    <div className={tabStyles.tabContent}>
      <div className={tabStyles.toolbar}>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search activity..."
          aria-label="Search activity"
        />
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
