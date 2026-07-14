import { z } from "zod";

/** Reusable Zod schemas for pagination, sorting, and embedded client data. */

/** Sort descriptor for a single column (used by paginated queries). */
export const SortQuerySchema = z.object({
  column: z.string().trim().min(1).max(100),
  direction: z.enum(["asc", "desc"]),
});

/** Query parameters shared by paginated list Server Actions. */
export const PageQuerySchema = z.object({
  search: z.string().trim().max(500).optional().default(""),
  cursor: z.uuid().optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
  sort: SortQuerySchema.optional(),
});

/** Optional integer limit (1–100) used by bounded list queries. */
export const LimitSchema = z.coerce.number().int().min(1).max(100).optional();

/** Validated shape for an embedded/inlined client record. */
export const ClientDataSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: z.string().trim().min(1).max(255).pipe(z.email()).optional(),
  phone_number: z.string().trim().min(1).max(50).optional(),
  address: z.string().trim().min(1).max(500).optional(),
});

/** Payload that must reference exactly one parent resource. */
interface ParentRefinementPayload {
  case_id?: string | null;
  consultation_id?: string | null;
}

/**
 * Zod refinement asserting that exactly one parent (`case_id` XOR
 * `consultation_id`) is present.
 */
export function exactlyOneParentRefinement(payload: ParentRefinementPayload): boolean {
  const { case_id, consultation_id } = payload;
  return Boolean(case_id) !== Boolean(consultation_id);
}
