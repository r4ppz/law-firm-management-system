"use server";

import { getConsultationsPaginated } from "@/features/consultations/queries";

export async function getConsultationsPaginatedAction({
  search,
  cursor,
  pageSize,
}: {
  search?: string;
  cursor?: string;
  pageSize?: number;
}) {
  return getConsultationsPaginated({ search, cursor, pageSize });
}
