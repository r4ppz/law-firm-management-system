import { cache } from "react";

import { prisma } from "@/lib/prisma";

export type DocumentRow = {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number | null;
  uploadedBy: string;
  created_at: Date;
};

interface GetDocumentsParams {
  caseId?: string;
  consultationId?: string;
  search?: string;
  cursor?: string;
  pageSize?: number;
}

export const getDocumentsPaginated = cache(
  async ({ caseId, consultationId, search = "", cursor, pageSize = 20 }: GetDocumentsParams) => {
    const where: Record<string, unknown> = {};
    if (caseId) where.case_id = caseId;
    if (consultationId) where.consultation_id = consultationId;
    if (search) {
      where.file_name = { contains: search, mode: "insensitive" as const };
    }

    const documents = await prisma.document.findMany({
      take: pageSize + 1,
      skip: cursor ? 1 : 0,
      ...(cursor ? { cursor: { id: cursor } } : {}),
      where,
      orderBy: { created_at: "desc" },
      include: {
        uploadedBy: { select: { name: true } },
      },
    });

    const hasMore = documents.length > pageSize;
    if (hasMore) documents.pop();

    const rows: DocumentRow[] = documents.map((d) => ({
      id: d.id,
      file_name: d.file_name,
      file_type: d.file_type,
      file_size: d.file_size,
      uploadedBy: d.uploadedBy.name,
      created_at: d.created_at,
    }));

    return {
      rows,
      nextCursor: hasMore ? documents[documents.length - 1].id : null,
    };
  },
);

export const getDocumentById = cache(async (id: string) => {
  return prisma.document.findUnique({
    where: { id },
  });
});
