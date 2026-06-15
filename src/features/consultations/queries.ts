import { cache } from "react";

import { prisma } from "@/lib/prisma";

const consultationSelect = {
  id: true,
  concern: true,
  booking_datetime: true,
  status: true,
  client: { select: { name: true } },
  createdBy: { select: { name: true } },
} as const;

export type ConsultationRow = {
  id: string;
  clientName: string;
  concern: string;
  createdByName: string;
  booking_datetime: Date;
  status: string;
};

export const getConsultationsPaginated = cache(
  async ({
    search = "",
    cursor,
    pageSize = 20,
  }: {
    search?: string;
    cursor?: string;
    pageSize?: number;
  }) => {
    const where = search
      ? {
          OR: [
            { concern: { contains: search, mode: "insensitive" as const } },
            { client: { name: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : undefined;

    const consultations = await prisma.consultation.findMany({
      take: pageSize + 1,
      skip: cursor ? 1 : 0,
      ...(cursor ? { cursor: { id: cursor } } : {}),
      where,
      orderBy: { booking_datetime: "desc" },
      select: consultationSelect,
    });

    const hasMore = consultations.length > pageSize;
    if (hasMore) consultations.pop();

    const rows: ConsultationRow[] = consultations.map((c) => ({
      id: c.id,
      clientName: c.client.name,
      concern: c.concern,
      createdByName: c.createdBy.name,
      booking_datetime: c.booking_datetime,
      status: c.status,
    }));

    return {
      consultations: rows,
      nextCursor: hasMore ? consultations[consultations.length - 1].id : null,
    };
  },
);
