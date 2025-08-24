import { isNonEmptyRecord } from "./type-guards";

/**
 * ### Schema definition for object validation.
 *
 * A validation schema maps each property of the target type to a validation rule
 * consisting of a predicate function and an error message. The predicate function
 * performs runtime type checking and narrows the type using Typescript's type guards.
 *
 * @template T the target object type to validate against
 * @example
 * ```typescript
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 *
 * const schema: ValidateSchema<Person> = {
 *   name: {
 *     predicate: (val: unknown): val is string => typeof val === 'string',
 *     errorMsg: "name must be a string"
 *   },
 *   age: {
 *     predicate: (val: unknown): val is number => typeof val === 'number',
 *     errorMsg: "age must be a number"
 *   }
 * }
 * ```
 */
type ValidateSchema<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    /** Type predicate function that validates and narrows the type */
    predicate: (val: unknown) => val is T[K];
    /** Error message to return if validation fails */
    errorMsg: string;
  };
};

/**
 * ### Successful validation result.
 *
 * Contains the validated and type=narrowed data when validation passes.
 *
 * @template T The validated object type
 */
interface ValidationSuccess<T> {
  /** Always true for successful validation */
  success: true;
  /** The validated and type-safe data */
  data: T;
}

/**
 * ### Failed validation result.
 *
 * Contains an array of error messages when validation fails.
 */
interface ValidationFailure {
  /** Always false for failed validation */
  success: false;
  /** Array of validation error messages */
  errors: string[];
}

/**
 * ### Union type representing the result of an object validation operation.
 *
 * This type serves as a discriminated union where the `success` property
 * determins which variant is active.
 *
 * @template T The type of the validated object on success
 * @example
 * ```typescript
 * const result: ValidationResult<User> = validateObject(userInput, userSchema, false);
 *
 * if (result.success) {
 *   // TypeScript knows result.data is of type User
 *   console.log(result.data.name);
 * } else {
 *   // TypeScript knows result.errors is a string array
 *   console.log(result.errors.join(', '));
 * }
 * ```
 */
type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

/**
 * ### Validates an unknown value against a schema definition.
 *
 * This function provides runtime type checking for objects while maintaining
 * full TypeScript type safety. It supports both strict validation
 * (exact schema matching) and permissive validation (allowing extra properties)
 *
 * @template T The target object type to validate against
 * @param obj The unknown value to validate
 * @param schema The validation schema defining the expected structure
 * @param allowExtra Whether to allow properties not defined in the schema
 * @returns A discriminated union indicating success or failure with appropriate data
 *
 * @remarks
 * - The function first checks if the input is a non-empty object
 * - It then validates each property defined in the schema using the provided predicates
 * - If `allowExtra` is false, only schema properties are included in the result
 * - If `allowExtra` is true, all input properties are preserved in the result
 *
 * @example Strict validation (exact schema matching)
 * ```typescript
 * const result = validateObject<User>(input, userSchema, false);
 * if (result.success) {
 *   // result.data only contains properties defined in userSchema
 * }
 * ```
 *
 * @example Permissive validation (allow extra properties)
 * ```typescript
 * const result = validateObject<User>(input, userSchema, true);
 * if (result.success) {
 *   // result.data includes both schema properties and any extra properties from input
 * }
 * ```
 */
function validateObject<T extends Record<string, unknown>>(
  obj: unknown,
  schema: ValidateSchema<T>,
  allowExtra: true,
): ValidationResult<T>;
/**
 * ### Validates an unknown value against a schema definition (strict mode).
 *
 * @template T The target object type to validate against
 * @param obj The unknown value to validate
 * @param schema The validation schema defining the expected structure
 * @param allowExtra Must be false for strict validation
 * @returns Validation result with only schema properties on success
 */
function validateObject<T extends Record<string, unknown>>(
  obj: unknown,
  schema: ValidateSchema<T>,
  allowExtra: false,
): ValidationResult<T>;
/**
 * ### Internal implementation of object validation.
 *
 * This overload handles the actual validation logic and is not meant to be called directly.
 * Use the specific overloads above based on your validation requirements.
 *
 * @template T The target object to validate against
 * @param obj The unknown value to validate
 * @param schema The validation schema defining the expected structure
 * @param allowExtra Whether to allow properties not defined in the schema
 * @returns Validation result with appropriate typing based on allowExtra parameter
 *
 * @internal
 */
function validateObject<T extends Record<string, unknown>>(
  obj: unknown,
  schema: ValidateSchema<T>,
  allowExtra: boolean,
): ValidationResult<any> {
  if (!isNonEmptyRecord(obj)) {
    return {
      success: false,
      errors: ["Given 'obj' must be a non-empty object"],
    };
  }

  const errors: string[] = [];

  for (const key of Object.keys(schema)) {
    if (!schema[key].predicate(obj[key])) {
      errors.push(schema[key].errorMsg);
    }
  }

  if (errors.length) {
    return { success: false, errors };
  }

  if (!allowExtra) {
    const data = {} as T;
    for (const key of Object.keys(schema)) {
      data[key as keyof T] = obj[key] as T[keyof T];
    }
    return { success: true, data };
  }

  return {
    success: true,
    data: obj as T & Record<string, unknown>,
  };
}

export { validateObject, type ValidateSchema, type ValidationResult };
