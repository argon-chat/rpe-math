/**
 * @engine/math - Constants
 * Mathematical constants and utilities
 * 
 * Isomorphic: Works in both TypeScript and AssemblyScript
 */

/** Pi constant */
export const PI: f64 = 3.141592653589793;

/** Two times Pi */
export const TWO_PI: f64 = 6.283185307179586;

/** Half Pi */
export const HALF_PI: f64 = 1.5707963267948966;

/** Quarter Pi */
export const QUARTER_PI: f64 = 0.7853981633974483;

/** Euler's number */
export const E: f64 = 2.718281828459045;

/** Natural logarithm of 2 */
export const LN2: f64 = 0.6931471805599453;

/** Natural logarithm of 10 */
export const LN10: f64 = 2.302585092994046;

/** Base 2 logarithm of e */
export const LOG2E: f64 = 1.4426950408889634;

/** Base 10 logarithm of e */
export const LOG10E: f64 = 0.4342944819032518;

/** Square root of 2 */
export const SQRT2: f64 = 1.4142135623730951;

/** Square root of 1/2 */
export const SQRT1_2: f64 = 0.7071067811865476;

/** Degrees to radians multiplier */
export const DEG2RAD: f64 = 0.017453292519943295;

/** Radians to degrees multiplier */
export const RAD2DEG: f64 = 57.29577951308232;

/** Small epsilon for floating point comparisons */
export const EPSILON: f64 = 1e-6;

/** Larger epsilon for loose comparisons */
export const EPSILON_LOOSE: f64 = 1e-4;

/** Float64 max safe value */
export const F64_MAX: f64 = 1.7976931348623157e+308;

/** Float64 min positive value */
export const F64_MIN: f64 = 2.2250738585072014e-308;

/** Float32 max value */
export const F32_MAX: f64 = 3.4028234663852886e+38;

/** Float32 min positive value */
export const F32_MIN: f64 = 1.1754943508222875e-38;

/**
 * Convert degrees to radians
 */
export function toRadians(degrees: f64): f64 {
  return degrees * DEG2RAD;
}

/**
 * Convert radians to degrees
 */
export function toDegrees(radians: f64): f64 {
  return radians * RAD2DEG;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: f64, minVal: f64, maxVal: f64): f64 {
  if (value < minVal) return minVal;
  if (value > maxVal) return maxVal;
  return value;
}

/**
 * Clamp value between 0 and 1
 */
export function clamp01(value: f64): f64 {
  if (value < 0.0) return 0.0;
  if (value > 1.0) return 1.0;
  return value;
}

/**
 * Linear interpolation
 */
export function lerp(a: f64, b: f64, t: f64): f64 {
  return a + (b - a) * t;
}

/**
 * Inverse linear interpolation
 */
export function inverseLerp(a: f64, b: f64, value: f64): f64 {
  const denom: f64 = b - a;
  if (denom == 0.0) return 0.0;
  return (value - a) / denom;
}

/**
 * Remap value from one range to another
 */
export function remap(value: f64, fromMin: f64, fromMax: f64, toMin: f64, toMax: f64): f64 {
  const t: f64 = inverseLerp(fromMin, fromMax, value);
  return lerp(toMin, toMax, t);
}

/**
 * Smooth step (Hermite)
 */
export function smoothstep(edge0: f64, edge1: f64, x: f64): f64 {
  const t: f64 = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3.0 - 2.0 * t);
}

/**
 * Smoother step (Ken Perlin)
 */
export function smootherstep(edge0: f64, edge1: f64, x: f64): f64 {
  const t: f64 = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

/**
 * Check if two floats are approximately equal
 */
export function approxEqual(a: f64, b: f64, epsilon: f64 = EPSILON): bool {
  const diff: f64 = a - b;
  const absDiff: f64 = diff < 0 ? -diff : diff;
  return absDiff <= epsilon;
}

/**
 * Check if value is approximately zero
 */
export function approxZero(value: f64, epsilon: f64 = EPSILON): bool {
  const absVal: f64 = value < 0 ? -value : value;
  return absVal <= epsilon;
}

/**
 * Sign of value (-1, 0, or 1)
 */
export function sign(value: f64): f64 {
  if (value > 0) return 1.0;
  if (value < 0) return -1.0;
  return 0.0;
}

/**
 * Fractional part
 */
export function fract(value: f64): f64 {
  return value - Math.floor(value);
}

/**
 * Modulo that handles negative numbers
 */
export function mod(a: f64, b: f64): f64 {
  return ((a % b) + b) % b;
}

/**
 * Wrap angle to [-PI, PI]
 */
export function wrapAngle(angle: f64): f64 {
  return mod(angle + PI, TWO_PI) - PI;
}

/**
 * Wrap angle to [0, 2*PI]
 */
export function wrapAnglePositive(angle: f64): f64 {
  return mod(angle, TWO_PI);
}

/**
 * Shortest angle difference
 */
export function angleDiff(from: f64, to: f64): f64 {
  return wrapAngle(to - from);
}

/**
 * Interpolate angle (handles wrapping)
 */
export function lerpAngle(a: f64, b: f64, t: f64): f64 {
  const diff: f64 = angleDiff(a, b);
  return a + diff * t;
}

/**
 * Move towards target with max delta
 */
export function moveTowards(current: f64, target: f64, maxDelta: f64): f64 {
  const diff: f64 = target - current;
  const absDiff: f64 = diff < 0 ? -diff : diff;
  if (absDiff <= maxDelta) return target;
  return current + sign(diff) * maxDelta;
}

/**
 * Ping pong between 0 and length
 */
export function pingPong(t: f64, length: f64): f64 {
  const t2: f64 = mod(t, length * 2);
  const diff: f64 = t2 - length;
  return length - (diff < 0 ? -diff : diff);
}

/**
 * Repeat between 0 and length
 */
export function repeat(t: f64, length: f64): f64 {
  return mod(t, length);
}

/**
 * Next power of two
 */
export function nextPowerOfTwo(value: i32): i32 {
  let v: i32 = value - 1;
  v |= v >> 1;
  v |= v >> 2;
  v |= v >> 4;
  v |= v >> 8;
  v |= v >> 16;
  return v + 1;
}

/**
 * Check if power of two
 */
export function isPowerOfTwo(value: i32): bool {
  return value > 0 && (value & (value - 1)) == 0;
}

/**
 * Absolute value for f64
 */
export function absF64(value: f64): f64 {
  return value < 0 ? -value : value;
}

/**
 * Absolute value for i32
 */
export function absI32(value: i32): i32 {
  return value < 0 ? -value : value;
}

/**
 * Min of two f64
 */
export function minF64(a: f64, b: f64): f64 {
  return a < b ? a : b;
}

/**
 * Max of two f64
 */
export function maxF64(a: f64, b: f64): f64 {
  return a > b ? a : b;
}

/**
 * Min of two i32
 */
export function minI32(a: i32, b: i32): i32 {
  return a < b ? a : b;
}

/**
 * Max of two i32
 */
export function maxI32(a: i32, b: i32): i32 {
  return a > b ? a : b;
}

/**
 * Sign of f64 (-1, 0, or 1)
 */
export function signF64(value: f64): f64 {
  if (value > 0) return 1.0;
  if (value < 0) return -1.0;
  return 0.0;
}

/**
 * Sign of i32 (-1, 0, or 1)
 */
export function signI32(value: i32): i32 {
  if (value > 0) return 1;
  if (value < 0) return -1;
  return 0;
}
