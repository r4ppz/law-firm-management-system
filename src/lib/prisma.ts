import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { getRequiredEnvVar } from "@/lib/env";

import { PrismaClient } from "../generated/prisma/client";

/**
 * Prisma client singleton.
 *
 * Wraps `PrismaClient` with the `@prisma/adapter-pg` driver so the app talks to
 * PostgreSQL over a connection pool. Import this instance from Server-only code
 * (queries/mutations); never import it into client components.
 */
const adapter = new PrismaPg({
  connectionString: getRequiredEnvVar("DATABASE_URL"),
});

export const prisma = new PrismaClient({ adapter });
