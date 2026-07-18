import { prisma } from "@/lib/prisma";

export async function updateMilestonesRemindedAt(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  await prisma.caseMilestone.updateMany({
    where: { id: { in: ids } },
    data: { last_reminded_at: new Date() },
  });
}

export async function updateConsultationsRemindedAt(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  await prisma.consultation.updateMany({
    where: { id: { in: ids } },
    data: { last_reminded_at: new Date() },
  });
}
