"use client";

import clsx from "clsx";
import { useCallback, useEffect, useState, useTransition } from "react";
import { FaPlus } from "react-icons/fa6";

import { Button } from "@/components/ui/Button/Button";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";
import { SearchField } from "@/components/ui/SearchField/SearchField";
import { getConsultationCasesPaginatedAction } from "@/features/consultations/actions";
import type { CaseRow } from "@/features/consultations/queries";
import { useDebounce } from "@/lib/useDebounce";

import tabStyles from "./Tab.module.css";

interface Props {
  consultationId: string;
}

const statusClassMap: Record<string, string> = {
  Pending: tabStyles.statusPending,
  Open: tabStyles.statusInfo,
  Ongoing: tabStyles.statusInfo,
  Closed: tabStyles.statusDone,
  Terminated: tabStyles.statusCancelled,
  Settled: tabStyles.statusInfo,
  Done: tabStyles.statusDone,
  Cancelled: tabStyles.statusCancelled,
};

const columns: ColumnDef<CaseRow>[] = [
  { id: "case_title", name: "Case Title", isRowHeader: true },
  { id: "case_type", name: "Type" },
  {
    id: "status",
    name: "Status",
    render: (value) => {
      const status = value as string;
      return <span className={clsx(tabStyles.badge, statusClassMap[status])}>{status}</span>;
    },
  },
  { id: "created_at", name: "Created At" },
];

export function CasesTab({ consultationId }: Props) {
  const [items, setItems] = useState<CaseRow[]>([]);
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
      const result = await getConsultationCasesPaginatedAction({
        consultationId,
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
  }, [consultationId, debouncedSearch, startTransition]);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore || !cursor) return;
    setIsLoadingMore(true);
    try {
      const result = await getConsultationCasesPaginatedAction({
        consultationId,
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
  }, [isLoading, hasMore, cursor, consultationId, debouncedSearch]);

  const emptyContent =
    debouncedSearch && items.length === 0 && !isLoading
      ? `No cases matching "${debouncedSearch}"`
      : !debouncedSearch && items.length === 0 && !isLoading
        ? "No cases yet"
        : undefined;

  if (isInitialLoad) {
    return (
      <div className={tabStyles.loading}>
        <ProgressCircle aria-label="Loading cases..." />
      </div>
    );
  }

  return (
    <div className={tabStyles.tabContent}>
      <div className={tabStyles.toolbar}>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search cases..."
          aria-label="Search cases"
        />
        <Button variant="secondary" className={tabStyles.addButton} aria-label="Add case">
          <FaPlus /> Add Case
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
