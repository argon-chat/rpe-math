/**
 * @engine/math - Type Utilities
 * 
 * Utility functions for type conversion.
 * Types themselves are declared in global.d.ts (for TS) or built-in (for AS).
 */

export function i32_cast(value: f64): i32 {
  return value | 0;
}

export function f32_cast(value: f64): f32 {
  return Math.fround(value);
}

export function f64_cast(value: i32 | f32): f64 {
  return value;
}

export function i8_clamp(value: i32): i8 {
  return Math.max(-128, Math.min(127, value));
}

export function u8_clamp(value: i32): u8 {
  return Math.max(0, Math.min(255, value));
}

export function i16_clamp(value: i32): i16 {
  return Math.max(-32768, Math.min(32767, value));
}

export function u16_clamp(value: i32): u16 {
  return Math.max(0, Math.min(65535, value));
}

export function i32_clamp(value: f64): i32 {
  return Math.max(-2147483648, Math.min(2147483647, value)) | 0;
}

export function u32_clamp(value: f64): u32 {
  return Math.max(0, Math.min(4294967295, value)) >>> 0;
}
