"use server";

import {
  getOverdueMilestones,
  getRecentCases,
  getUpcomingConsultations,
  type OverdueMilestoneRow,
  type RecentCaseRow,
  type UpcomingConsultationRow,
} from "@/features/dashboard/queries";

export async function getRecentCasesAction(limit = 10): Promise<RecentCaseRow[]> {
  return getRecentCases(limit);
}

export async function getUpcomingConsultationsAction(
  limit = 10,
): Promise<UpcomingConsultationRow[]> {
  return getUpcomingConsultations(limit);
}

export async function getOverdueMilestonesAction(limit = 5): Promise<OverdueMilestoneRow[]> {
  return getOverdueMilestones(limit);
}
