/**
 * Global type declarations for TypeScript
 * AssemblyScript has these built-in, so this file only matters for TS compilation.
 */

/**
 * @inline decorator - hints to AS compiler to inline the function
 * No-op in TypeScript. Supports both ES2022 and experimental decorators.
 */
declare function inline<T extends (...args: any[]) => any>(
  target: Object,
  propertyKey: string | symbol,
  descriptor?: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void;

/** 8-bit signed integer */
type i8 = number;
/** 16-bit signed integer */
type i16 = number;
/** 32-bit signed integer */
type i32 = number;
/** 64-bit signed integer */
type i64 = number;

/** 8-bit unsigned integer */
type u8 = number;
/** 16-bit unsigned integer */
type u16 = number;
/** 32-bit unsigned integer */
type u32 = number;
/** 64-bit unsigned integer */
type u64 = number;

/** 32-bit float */
type f32 = number;
/** 64-bit float (same as JS number) */
type f64 = number;

/** Boolean */
type bool = boolean;

/** Signed size (platform-dependent) */
type isize = number;
/** Unsigned size (platform-dependent) */
type usize = number;
