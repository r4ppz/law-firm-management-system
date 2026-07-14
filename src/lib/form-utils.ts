import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import type { Key } from "react-aria-components";
import type { ZodType } from "zod";

/**
 * Shared normalization and validation helpers for modal forms.
 *
 * Keeps string handling, enum coercion, and RAC field validation consistent
 * across the feature modals so each component does not re-implement trimming
 * or schema derivation inline.
 */

/** Returns the trimmed string, or `undefined` when empty/whitespace-only. */
export function optionalString(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Returns the trimmed string, guaranteeing a non-empty value for required fields. */
export function requiredString(value: string): string {
  return value.trim();
}

/** Converts an `@internationalized/date` `CalendarDate` to a local-timezone `Date`. */
export function toDateValue(date: CalendarDate): Date {
  return date.toDate(getLocalTimeZone());
}

/**
 * Resolves a React Aria `Key` (or `null`) to its corresponding enum member,
 * falling back to the first enum member when the key is missing.
 */
export function coerceEnum<E extends Record<string, string>>(
  key: Key | null,
  enumObject: E,
): E[keyof E] {
  return enumObject[(key ?? Object.keys(enumObject)[0]) as keyof E];
}

/**
 * Builds a `Select` `onChange` handler that maps the selected `Key` to an enum
 * member and forwards it to `onChange`. Null selections are ignored.
 */
export function selectEnumHandler<E extends Record<string, string>>(
  enumObject: E,
  onChange: (value: E[keyof E]) => void,
) {
  return (key: Key | null) => {
    if (key != null) onChange(enumObject[key as keyof E]);
  };
}

/** Collects React Aria selection `Key`s into a `Set<string>`. */
export function keysToSet(keys: Iterable<Key>): Set<string> {
  return new Set(Array.from(keys, String));
}

/**
 * Derives a React Aria `validate` function from a Zod sub-schema. Empty
 * strings are normalized to `undefined` so optional fields validate cleanly,
 * returning `null` on success or the first issue message on failure.
 */
export function createFieldValidator<S extends ZodType>(schema: S) {
  return (value: unknown): string | null => {
    const normalized = typeof value === "string" && value.trim() === "" ? undefined : value;
    const result = schema.safeParse(normalized);
    if (result.success) return null;
    return result.error.issues[0]?.message ?? "Invalid value";
  };
}
