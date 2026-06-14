"use server";

import { getCasesPaginated } from "@/features/cases/queries";

export async function getCasesPaginatedAction({
  search,
  cursor,
  pageSize,
}: {
  search?: string;
  cursor?: string;
  pageSize?: number;
}) {
  return getCasesPaginated({ search, cursor, pageSize });
}
