import { prisma } from "@/lib/prisma";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  is_active: true,
  created_at: true,
} as const;

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      role: true,
      is_active: true,
    },
  });
}

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { created_at: "desc" },
    select: userSelect,
  });
}

export async function getUsersPaginated({
  search = "",
  cursor,
  pageSize = 20,
}: {
  search?: string;
  cursor?: string;
  pageSize?: number;
}) {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const users = await prisma.user.findMany({
    take: pageSize + 1,
    skip: cursor ? 1 : 0,
    ...(cursor ? { cursor: { id: cursor } } : {}),
    where,
    orderBy: { created_at: "desc" },
    select: userSelect,
  });

  const hasMore = users.length > pageSize;
  if (hasMore) users.pop();

  return {
    users,
    nextCursor: hasMore ? users[users.length - 1].id : null,
  };
}
