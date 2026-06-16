"use client";

import clsx from "clsx";
import { useCallback, useEffect, useState, useTransition } from "react";
import { FaPlus } from "react-icons/fa6";

import { Button } from "@/components/ui/Button/Button";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable/DataTable";
import { ProgressCircle } from "@/components/ui/ProgressCircle/ProgressCircle";
import { SearchField } from "@/components/ui/SearchField/SearchField";
import { getCasePaymentsPaginatedAction } from "@/features/cases/actions";
import type { PaymentRow } from "@/features/cases/queries";
import { useDebounce } from "@/lib/useDebounce";

import tabStyles from "./Tab.module.css";

interface Props {
  caseId: string;
}

const statusClassMap: Record<string, string> = {
  Unpaid: tabStyles.statusPending,
  Partial: tabStyles.statusOngoing,
  Paid: tabStyles.statusDone,
  Refunded: tabStyles.statusCancelled,
};

const columns: ColumnDef<PaymentRow>[] = [
  {
    id: "amount",
    name: "Amount",
    isRowHeader: true,
    allowsSorting: true,
    render: (value) => {
      const v = value as number;
      return `$${v.toFixed(2)}`;
    },
  },
  { id: "payment_date", name: "Date" },
  { id: "payment_method", name: "Method" },
  { id: "receipt_number", name: "Receipt" },
  {
    id: "status",
    name: "Status",
    render: (value) => {
      const s = value as string;
      return <span className={clsx(tabStyles.badge, statusClassMap[s])}>{s}</span>;
    },
  },
];

export function PaymentsTab({ caseId }: Props) {
  const [items, setItems] = useState<PaymentRow[]>([]);
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
      const result = await getCasePaymentsPaginatedAction({
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
      const result = await getCasePaymentsPaginatedAction({
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
      ? `No payments matching "${debouncedSearch}"`
      : !debouncedSearch && items.length === 0 && !isLoading
        ? "No payments yet"
        : undefined;

  if (isInitialLoad) {
    return (
      <div className={tabStyles.loading}>
        <ProgressCircle aria-label="Loading payments..." />
      </div>
    );
  }

  return (
    <div className={tabStyles.tabContent}>
      <div className={tabStyles.toolbar}>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search payments..."
          aria-label="Search payments"
        />
        <Button variant="secondary" className={tabStyles.addButton} aria-label="Add payment">
          <FaPlus /> Add Payment
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
