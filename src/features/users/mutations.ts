import { Role } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function upsertDeveloperUser(email: string, name: string, image?: string | null) {
  return prisma.user.upsert({
    where: { email },
    update: { image },
    create: {
      email,
      name,
      image,
      role: Role.Dev,
      is_active: true,
    },
  });
}
