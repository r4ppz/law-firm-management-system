"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { FaPlus } from "react-icons/fa6";

import { Button } from "@/components/ui/Button/Button";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";
import { SearchField } from "@/components/ui/SearchField/SearchField";
import { useDebounce } from "@/lib/useDebounce";

import styles from "./ServerDataTable.module.css";

interface ServerDataTableProps<T extends { id: string }> {
  fetchAction: (params: {
    search?: string;
    cursor?: string;
    pageSize?: number;
  }) => Promise<{ rows: T[]; nextCursor: string | null }>;
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  emptyContent?: string;
  loadingMessage?: string;
  searchLabel?: string;
  renderAddButton?: boolean;
  addButtonLabel?: string;
  onAddButtonPress?: () => void;
  selectionMode?: "none" | "single" | "multiple";
  selectionBehavior?: "toggle" | "replace";
  onRowAction?: (key: string) => void;
}

export function ServerDataTable<T extends { id: string }>({
  fetchAction,
  columns,
  searchPlaceholder = "Search...",
  emptyContent = "No items yet",
  loadingMessage = "Loading...",
  searchLabel = "Search",
  renderAddButton = false,
  addButtonLabel = "Add",
  onAddButtonPress,
  selectionMode = "single",
  selectionBehavior = "replace",
  onRowAction,
}: ServerDataTableProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const isLoading = isPending || isLoadingMore;
  const debouncedSearch = useDebounce(search, 300);

  const fetchActionRef = useRef(fetchAction);
  useEffect(() => {
    fetchActionRef.current = fetchAction;
  });

  useEffect(() => {
    let cancelled = false;

    startTransition(async () => {
      const result = await fetchActionRef.current({ search: debouncedSearch, pageSize: 10 });
      if (cancelled) return;
      setItems(result.rows);
      setCursor(result.nextCursor);
      setHasMore(result.nextCursor !== null);
      setIsInitialLoad(false);
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, startTransition]);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore || !cursor) return;

    setIsLoadingMore(true);
    try {
      const result = await fetchActionRef.current({
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
  }, [isLoading, hasMore, cursor, debouncedSearch]);

  const computedEmptyContent =
    debouncedSearch && items.length === 0 && !isLoading
      ? `No results matching "${debouncedSearch}"`
      : items.length === 0 && !isLoading
        ? emptyContent
        : undefined;

  return (
    <div className={styles.content}>
      <div className={styles.toolbar}>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder={searchPlaceholder}
          aria-label={searchLabel}
        />
        {renderAddButton && (
          <Button
            variant="secondary"
            className={styles.addButton}
            aria-label={addButtonLabel}
            onPress={onAddButtonPress}
          >
            <FaPlus /> {addButtonLabel}
          </Button>
        )}
      </div>
      {isInitialLoad ? (
        <div className={styles.loadingContainer}>
          <ProgressCircle aria-label={loadingMessage} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          selectionMode={selectionMode}
          selectionBehavior={selectionBehavior}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          isLoading={isLoading}
          emptyContent={computedEmptyContent}
          onRowAction={onRowAction}
        />
      )}
    </div>
  );
}
