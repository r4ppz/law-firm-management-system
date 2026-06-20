import type { Role } from "@/generated/prisma/client";

export const CREATABLE_ROLES: Role[] = [
  "Admin",
  "BranchManager",
  "Lawyer",
  "Paralegal",
  "ProcessServer",
];

export const roleLabels: Record<Role, string> = {
  Dev: "Dev",
  Admin: "Admin",
  BranchManager: "Branch Manager",
  Lawyer: "Lawyer",
  Paralegal: "Paralegal",
  ProcessServer: "Process Server",
};
