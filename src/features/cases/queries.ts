import { prisma } from "@/lib/prisma";

const caseSelect = {
  id: true,
  case_title: true,
  case_type: true,
  created_at: true,
  client: { select: { name: true } },
  caseAssignments: {
    select: { user: { select: { name: true } } },
  },
  milestones: {
    orderBy: { created_at: "desc" as const },
    take: 1,
    select: { title: true, status: true },
  },
} as const;

export type CaseRow = {
  id: string;
  case_title: string;
  case_type: string;
  clientName: string;
  assignTo: string;
  latestMilestone: string;
  status: string | null;
  created_at: Date;
};

export async function getCasesPaginated({
  search = "",
  cursor,
  pageSize = 10,
}: {
  search?: string;
  cursor?: string;
  pageSize?: number;
}) {
  const where = search
    ? {
        OR: [
          { case_title: { contains: search, mode: "insensitive" as const } },
          { client: { name: { contains: search, mode: "insensitive" as const } } },
        ],
      }
    : undefined;

  const cases = await prisma.case.findMany({
    take: pageSize + 1,
    skip: cursor ? 1 : 0,
    ...(cursor ? { cursor: { id: cursor } } : {}),
    where,
    orderBy: { created_at: "desc" },
    select: caseSelect,
  });

  const hasMore = cases.length > pageSize;
  if (hasMore) cases.pop();

  const rows: CaseRow[] = cases.map((c) => ({
    id: c.id,
    case_title: c.case_title,
    case_type: c.case_type,
    clientName: c.client.name,
    assignTo: c.caseAssignments.map((a) => a.user.name).join(", "),
    latestMilestone: c.milestones[0]?.title ?? "",
    status: c.milestones[0]?.status ?? null,
    created_at: c.created_at,
  }));

  return {
    cases: rows,
    nextCursor: hasMore ? cases[cases.length - 1].id : null,
  };
}
