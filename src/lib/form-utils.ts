import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import type { Key } from "react-aria-components";
import type { ZodType } from "zod";

export function optionalString(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function requiredString(value: string): string {
  return value.trim();
}

export function toDateValue(date: CalendarDate): Date {
  return date.toDate(getLocalTimeZone());
}

export function coerceEnum<E extends Record<string, string>>(
  key: Key | null,
  enumObject: E,
): E[keyof E] {
  return enumObject[(key ?? Object.keys(enumObject)[0]) as keyof E];
}

export function selectEnumHandler<E extends Record<string, string>>(
  enumObject: E,
  onChange: (value: E[keyof E]) => void,
) {
  return (key: Key | null) => {
    if (key != null) onChange(enumObject[key as keyof E]);
  };
}

export function keysToSet(keys: Iterable<Key>): Set<string> {
  return new Set(Array.from(keys, String));
}

export function createFieldValidator<S extends ZodType>(schema: S) {
  return (value: unknown): string | null => {
    const normalized = typeof value === "string" && value.trim() === "" ? undefined : value;
    const result = schema.safeParse(normalized);
    if (result.success) return null;
    return result.error.issues[0]?.message ?? "Invalid value";
  };
}
