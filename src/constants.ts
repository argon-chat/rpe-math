/**
 * @engine/math - Constants
 * Mathematical constants and utilities
 * 
 * Isomorphic: Works in both TypeScript and AssemblyScript
 */

/** Pi constant */
export const PI: number = 3.141592653589793;

/** Two times Pi */
export const TWO_PI: number = 6.283185307179586;

/** Half Pi */
export const HALF_PI: number = 1.5707963267948966;

/** Quarter Pi */
export const QUARTER_PI: number = 0.7853981633974483;

/** Euler's number */
export const E: number = 2.718281828459045;

/** Natural logarithm of 2 */
export const LN2: number = 0.6931471805599453;

/** Natural logarithm of 10 */
export const LN10: number = 2.302585092994046;

/** Base 2 logarithm of e */
export const LOG2E: number = 1.4426950408889634;

/** Base 10 logarithm of e */
export const LOG10E: number = 0.4342944819032518;

/** Square root of 2 */
export const SQRT2: number = 1.4142135623730951;

/** Square root of 1/2 */
export const SQRT1_2: number = 0.7071067811865476;

/** Degrees to radians multiplier */
export const DEG2RAD: number = 0.017453292519943295;

/** Radians to degrees multiplier */
export const RAD2DEG: number = 57.29577951308232;

/** Small epsilon for floating point comparisons */
export const EPSILON: number = 1e-6;

/** Larger epsilon for loose comparisons */
export const EPSILON_LOOSE: number = 1e-4;

/** Float64 max safe value */
export const F64_MAX: number = 1.7976931348623157e+308;

/** Float64 min positive value */
export const F64_MIN: number = 2.2250738585072014e-308;

/** Float32 max value */
export const F32_MAX: number = 3.4028234663852886e+38;

/** Float32 min positive value */
export const F32_MIN: number = 1.1754943508222875e-38;

/**
 * Convert degrees to radians
 */
export function toRadians(degrees: number): number {
  return degrees * DEG2RAD;
}

/**
 * Convert radians to degrees
 */
export function toDegrees(radians: number): number {
  return radians * RAD2DEG;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, minVal: number, maxVal: number): number {
  if (value < minVal) return minVal;
  if (value > maxVal) return maxVal;
  return value;
}

/**
 * Clamp value between 0 and 1
 */
export function clamp01(value: number): number {
  if (value < 0.0) return 0.0;
  if (value > 1.0) return 1.0;
  return value;
}

/**
 * Linear interpolation
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Inverse linear interpolation
 */
export function inverseLerp(a: number, b: number, value: number): number {
  const denom: number = b - a;
  if (denom == 0.0) return 0.0;
  return (value - a) / denom;
}

/**
 * Remap value from one range to another
 */
export function remap(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number {
  const t: number = inverseLerp(fromMin, fromMax, value);
  return lerp(toMin, toMax, t);
}

/**
 * Smooth step (Hermite)
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t: number = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3.0 - 2.0 * t);
}

/**
 * Smoother step (Ken Perlin)
 */
export function smootherstep(edge0: number, edge1: number, x: number): number {
  const t: number = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

/**
 * Check if two floats are approximately equal
 */
export function approxEqual(a: number, b: number, epsilon: number = EPSILON): boolean {
  const diff: number = a - b;
  const absDiff: number = diff < 0 ? -diff : diff;
  return absDiff <= epsilon;
}

/**
 * Check if value is approximately zero
 */
export function approxZero(value: number, epsilon: number = EPSILON): boolean {
  const absVal: number = value < 0 ? -value : value;
  return absVal <= epsilon;
}

/**
 * Sign of value (-1, 0, or 1)
 */
export function sign(value: number): number {
  if (value > 0) return 1.0;
  if (value < 0) return -1.0;
  return 0.0;
}

/**
 * Fractional part
 */
export function fract(value: number): number {
  return value - Math.floor(value);
}

/**
 * Modulo that handles negative numbers
 */
export function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

/**
 * Wrap angle to [-PI, PI]
 */
export function wrapAngle(angle: number): number {
  return mod(angle + PI, TWO_PI) - PI;
}

/**
 * Wrap angle to [0, 2*PI]
 */
export function wrapAnglePositive(angle: number): number {
  return mod(angle, TWO_PI);
}

/**
 * Shortest angle difference
 */
export function angleDiff(from: number, to: number): number {
  return wrapAngle(to - from);
}

/**
 * Interpolate angle (handles wrapping)
 */
export function lerpAngle(a: number, b: number, t: number): number {
  const diff: number = angleDiff(a, b);
  return a + diff * t;
}

/**
 * Move towards target with max delta
 */
export function moveTowards(current: number, target: number, maxDelta: number): number {
  const diff: number = target - current;
  const absDiff: number = diff < 0 ? -diff : diff;
  if (absDiff <= maxDelta) return target;
  return current + sign(diff) * maxDelta;
}

/**
 * Ping pong between 0 and length
 */
export function pingPong(t: number, length: number): number {
  const t2: number = mod(t, length * 2);
  const diff: number = t2 - length;
  return length - (diff < 0 ? -diff : diff);
}

/**
 * Repeat between 0 and length
 */
export function repeat(t: number, length: number): number {
  return mod(t, length);
}

/**
 * Next power of two
 */
export function nextPowerOfTwo(value: number): number {
  let v: number = value - 1;
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
export function isPowerOfTwo(value: number): boolean {
  return value > 0 && (value & (value - 1)) == 0;
}

/**
 * Absolute value for f64
 */
export function absF64(value: number): number {
  return value < 0 ? -value : value;
}

/**
 * Absolute value for i32
 */
export function absI32(value: number): number {
  return value < 0 ? -value : value;
}

/**
 * Min of two f64
 */
export function minF64(a: number, b: number): number {
  return a < b ? a : b;
}

/**
 * Max of two f64
 */
export function maxF64(a: number, b: number): number {
  return a > b ? a : b;
}

/**
 * Min of two i32
 */
export function minI32(a: number, b: number): number {
  return a < b ? a : b;
}

/**
 * Max of two i32
 */
export function maxI32(a: number, b: number): number {
  return a > b ? a : b;
}

/**
 * Sign of f64 (-1, 0, or 1)
 */
export function signF64(value: number): number {
  if (value > 0) return 1.0;
  if (value < 0) return -1.0;
  return 0.0;
}

/**
 * Sign of i32 (-1, 0, or 1)
 */
export function signI32(value: number): number {
  if (value > 0) return 1;
  if (value < 0) return -1;
  return 0;
}
