/**
 * ### Type guard that checks if a value is a non-empty record object.
 *
 * This function verifies that the input is an object (not null), has at least
 * one property, and is not an array or other non-record object type.
 *
 * @param obj The value to check
 * @returns True if the value is a non-empty record, false otherwise
 *
 * @remarks
 * - Returns false for null, undefined, arrays, dates, and primitive values
 * - Returns false for empty objects (objects with no properties)
 * - Returns true for objects with at least on property
 *
 * @example
 * ```typescript
 * isNonEmptyRecord({ name: "John" }); // true
 * isNonEmptyRecord({}); // false
 * isNonEmptyRecord(null); // false
 * isNonEmptyRecord([]); // false
 * isNonEmptyRecord("string"); // false
 * isNonEmptyRecord(new Date()); // false (Date is not a record)
 * ```
 */
export function isNonEmptyRecord(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === "object" && obj !== null && Object.keys(obj).length > 0;
}
