"use server";

import { createUser } from "@/features/users/mutations";
import { getUsersPaginated } from "@/features/users/queries";
import { Role } from "@/generated/prisma/client";

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

// This exclude dev users
const VALID_ROLES = new Set(Object.values(Role));

export async function createUserAction(email: string, role: string) {
  if (!VALID_ROLES.has(role as Role)) {
    return { error: "Invalid role." };
  }

  const existing = await getUsersPaginated({ search: email, pageSize: 1 });
  if (existing.users.some((u) => u.email === email)) {
    return { error: "A user with this email already exists." };
  }

  await createUser(email, role as Role);
  return { error: null };
}
