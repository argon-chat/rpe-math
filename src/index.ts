import './polyfills';

export { i32_cast, f32_cast, f64_cast } from './types';
export { i8_clamp, u8_clamp, i16_clamp, u16_clamp, i32_clamp, u32_clamp } from './types';

export {
  EPSILON,
  PI, TWO_PI, HALF_PI, QUARTER_PI,
  DEG2RAD, RAD2DEG,
  E, LN2, LN10, LOG2E, LOG10E,
  SQRT2, SQRT1_2,
  clamp, lerp, smoothstep, approxEqual,
  wrapAngle, angleDiff,
  isPowerOfTwo, nextPowerOfTwo,
  absF64, absI32, minF64, maxF64, minI32, maxI32,
  signF64, signI32
} from './constants';

export { Vec2, type Vec2Like, type Vec2Mut } from './Vec2';
export { Vec3 } from './Vec3';
export { Vec4 } from './Vec4';

export { Mat4 } from './Mat4';
export { Quat } from './Quat';

export { Transform } from './Transform';

export { AABB } from './AABB';
export { Ray } from './Ray';
