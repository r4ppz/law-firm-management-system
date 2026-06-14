"use server";

import { getUsersPaginated } from "@/features/users/queries";

export async function getUsersPaginatedAction({
  search,
  cursor,
  pageSize,
}: {
  search?: string;
  cursor?: string;
  pageSize?: number;
}) {
  return getUsersPaginated({ search, cursor, pageSize });
}
