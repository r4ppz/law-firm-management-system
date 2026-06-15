"use server";

import {
  getOverdueMilestones,
  getRecentCases,
  getUpcomingConsultations,
} from "@/features/dashboard/queries";

export async function getRecentCasesAction(limit = 5) {
  return getRecentCases(limit);
}

export async function getUpcomingConsultationsAction(limit = 5) {
  return getUpcomingConsultations(limit);
}

export async function getOverdueMilestonesAction(limit = 5) {
  return getOverdueMilestones(limit);
}
