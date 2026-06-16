"use server";

import { CREATABLE_ROLES } from "@/features/users/constants";
import { createUser, setUserActiveStatus, updateUser } from "@/features/users/mutations";
import { getUsersPaginated } from "@/features/users/queries";
import { Role } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { parseDeveloperEmails } from "@/lib/developer-emails";

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

const ALLOWED_ROLES = new Set(CREATABLE_ROLES);

export async function createUserAction(email: string, role: string) {
  if (!ALLOWED_ROLES.has(role as Role)) {
    return { error: "Invalid role." };
  }

  if (parseDeveloperEmails().includes(email)) {
    return { error: "This email is reserved for system developers." };
  }

  const existing = await getUsersPaginated({ search: email, pageSize: 1 });
  if (existing.users.some((u) => u.email === email)) {
    return { error: "A user with this email already exists." };
  }

  await createUser(email, role as Role);
  return { error: null };
}

export async function updateUserAction(id: string, email: string, role: string) {
  if (!ALLOWED_ROLES.has(role as Role)) {
    return { error: "Invalid role." };
  }

  const existing = await getUsersPaginated({ search: email, pageSize: 1 });
  if (existing.users.some((u) => u.email === email && u.id !== id)) {
    return { error: "A user with this email already exists." };
  }

  await updateUser(id, { email, role: role as Role });
  return { error: null };
}

export async function deactivateUserAction(id: string) {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    return { error: "Only admins can deactivate users." };
  }

  await setUserActiveStatus(id, false);
  return { error: null };
}
