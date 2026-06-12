import { expect, it, vi } from "vitest";

import { prisma } from "@/lib/prisma";

import { getUserByEmail } from "../queries";

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: vi.fn() } },
}));

it("returns user when found", async () => {
  vi.mocked(prisma.user.findUnique).mockResolvedValue({
    id: "1",
    name: "Test User",
    email: "a@b.com",
    google_sub: null,
    role: "Dev",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    emailVerified: null,
    image: null,
  });

  const result = await getUserByEmail("a@b.com");

  expect(result).toMatchObject({
    id: "1",
    role: "Dev",
    is_active: true,
  });
  expect(prisma.user.findUnique).toHaveBeenCalledWith({
    where: { email: "a@b.com" },
    select: { id: true, role: true, is_active: true },
  });
});

it("returns null when not found", async () => {
  vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

  const result = await getUserByEmail("missing@b.com");

  expect(result).toBeNull();
});

it("propagates database errors", async () => {
  const error = new Error("connection failed");
  vi.mocked(prisma.user.findUnique).mockRejectedValue(error);

  await expect(getUserByEmail("a@b.com")).rejects.toThrow(error);
});
