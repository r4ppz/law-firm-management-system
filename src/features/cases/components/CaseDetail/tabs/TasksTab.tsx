"use client";

import clsx from "clsx";
import { useCallback, useEffect, useState, useTransition } from "react";
import { FaPlus } from "react-icons/fa6";

import { Button } from "@/components/ui/Button/Button";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";
import { SearchField } from "@/components/ui/SearchField/SearchField";
import { getCaseTasksPaginatedAction } from "@/features/cases/actions";
import type { TaskRow } from "@/features/cases/queries";
import { useDebounce } from "@/lib/useDebounce";

import tabStyles from "./Tab.module.css";

interface Props {
  caseId: string;
}

const statusClassMap: Record<string, string> = {
  Pending: tabStyles.statusPending,
  Ongoing: tabStyles.statusOngoing,
  Submitted: tabStyles.statusInfo,
  Accepted: tabStyles.statusDone,
  Rejected: tabStyles.statusCancelled,
  Cancelled: tabStyles.statusCancelled,
};

const columns: ColumnDef<TaskRow>[] = [
  { id: "title", name: "Title", isRowHeader: true, allowsSorting: true },
  {
    id: "status",
    name: "Status",
    render: (value) => {
      const s = value as string;
      return <span className={clsx(tabStyles.badge, statusClassMap[s])}>{s}</span>;
    },
  },
  { id: "assignTo", name: "Assigned To" },
  { id: "updated_at", name: "Updated At" },
];

export function TasksTab({ caseId }: Props) {
  const [items, setItems] = useState<TaskRow[]>([]);
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
      const result = await getCaseTasksPaginatedAction({
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
      const result = await getCaseTasksPaginatedAction({
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
      ? `No tasks matching "${debouncedSearch}"`
      : !debouncedSearch && items.length === 0 && !isLoading
        ? "No tasks yet"
        : undefined;

  if (isInitialLoad) {
    return (
      <div className={tabStyles.loading}>
        <ProgressCircle aria-label="Loading tasks..." />
      </div>
    );
  }

  return (
    <div className={tabStyles.tabContent}>
      <div className={tabStyles.toolbar}>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search tasks..."
          aria-label="Search tasks"
        />
        <Button variant="secondary" className={tabStyles.addButton} aria-label="Add task">
          <FaPlus /> Add Task
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
