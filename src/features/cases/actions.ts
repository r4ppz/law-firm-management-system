"use server";

import {
  getCaseActivityLogPaginated,
  getCaseMilestonesPaginated,
  getCaseNotesPaginated,
  getCaseOverviewById,
  getCasePaymentsPaginated,
  getCasesPaginated,
  getCaseTasksPaginated,
} from "@/features/cases/queries";
import { getDocumentsPaginated } from "@/features/documents/queries";

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

export async function getCaseOverviewByIdAction(id: string) {
  return getCaseOverviewById(id);
}

export async function getCaseTasksPaginatedAction({
  caseId,
  search,
  cursor,
  pageSize,
}: {
  caseId: string;
  search?: string;
  cursor?: string;
  pageSize?: number;
}) {
  return getCaseTasksPaginated({ caseId, search, cursor, pageSize });
}

export async function getCaseNotesPaginatedAction({
  caseId,
  search,
  cursor,
  pageSize,
}: {
  caseId: string;
  search?: string;
  cursor?: string;
  pageSize?: number;
}) {
  return getCaseNotesPaginated({ caseId, search, cursor, pageSize });
}

export async function getCaseDocumentsPaginatedAction({
  caseId,
  search,
  cursor,
  pageSize,
}: {
  caseId: string;
  search?: string;
  cursor?: string;
  pageSize?: number;
}) {
  return getDocumentsPaginated({ caseId, search, cursor, pageSize });
}

export async function getCaseMilestonesPaginatedAction({
  caseId,
  search,
  cursor,
  pageSize,
}: {
  caseId: string;
  search?: string;
  cursor?: string;
  pageSize?: number;
}) {
  return getCaseMilestonesPaginated({ caseId, search, cursor, pageSize });
}

export async function getCasePaymentsPaginatedAction({
  caseId,
  search,
  cursor,
  pageSize,
}: {
  caseId: string;
  search?: string;
  cursor?: string;
  pageSize?: number;
}) {
  return getCasePaymentsPaginated({ caseId, search, cursor, pageSize });
}

export async function getCaseActivityLogPaginatedAction({
  caseId,
  search,
  cursor,
  pageSize,
}: {
  caseId: string;
  search?: string;
  cursor?: string;
  pageSize?: number;
}) {
  return getCaseActivityLogPaginated({ caseId, search, cursor, pageSize });
}
