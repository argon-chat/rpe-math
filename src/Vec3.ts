import { EPSILON, approxEqual } from './constants';

export class Vec3 {
  x: f64;
  y: f64;
  z: f64;

  constructor(x: f64 = 0, y: f64 = 0, z: f64 = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  @inline static zero(): Vec3 { return new Vec3(0, 0, 0); }
  @inline static one(): Vec3 { return new Vec3(1, 1, 1); }
  @inline static up(): Vec3 { return new Vec3(0, 1, 0); }
  @inline static down(): Vec3 { return new Vec3(0, -1, 0); }
  @inline static left(): Vec3 { return new Vec3(-1, 0, 0); }
  @inline static right(): Vec3 { return new Vec3(1, 0, 0); }
  @inline static forward(): Vec3 { return new Vec3(0, 0, 1); }
  @inline static back(): Vec3 { return new Vec3(0, 0, -1); }

  @inline
  set(x: f64, y: f64, z: f64): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  @inline
  copy(v: Vec3): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  @inline
  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  @inline
  add(v: Vec3): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  @inline
  addScalar(s: f64): this {
    this.x += s;
    this.y += s;
    this.z += s;
    return this;
  }

  @inline
  addScaled(v: Vec3, scale: f64): this {
    this.x += v.x * scale;
    this.y += v.y * scale;
    this.z += v.z * scale;
    return this;
  }

  @inline
  sub(v: Vec3): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  @inline
  subScalar(s: f64): this {
    this.x -= s;
    this.y -= s;
    this.z -= s;
    return this;
  }

  @inline
  mul(v: Vec3): this {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
  }

  @inline
  mulScalar(s: f64): this {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  @inline
  div(v: Vec3): this {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    return this;
  }

  @inline
  divScalar(s: f64): this {
    const inv: f64 = 1.0 / s;
    this.x *= inv;
    this.y *= inv;
    this.z *= inv;
    return this;
  }

  @inline
  negate(): this {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  @inline
  abs(): this {
    if (this.x < 0) this.x = -this.x;
    if (this.y < 0) this.y = -this.y;
    if (this.z < 0) this.z = -this.z;
    return this;
  }

  @inline
  floor(): this {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    return this;
  }

  @inline
  ceil(): this {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    return this;
  }

  @inline
  round(): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
  }

  @inline
  min(v: Vec3): this {
    if (v.x < this.x) this.x = v.x;
    if (v.y < this.y) this.y = v.y;
    if (v.z < this.z) this.z = v.z;
    return this;
  }

  @inline
  max(v: Vec3): this {
    if (v.x > this.x) this.x = v.x;
    if (v.y > this.y) this.y = v.y;
    if (v.z > this.z) this.z = v.z;
    return this;
  }

  clamp(minVal: Vec3, maxVal: Vec3): this {
    if (this.x < minVal.x) this.x = minVal.x;
    else if (this.x > maxVal.x) this.x = maxVal.x;
    if (this.y < minVal.y) this.y = minVal.y;
    else if (this.y > maxVal.y) this.y = maxVal.y;
    if (this.z < minVal.z) this.z = minVal.z;
    else if (this.z > maxVal.z) this.z = maxVal.z;
    return this;
  }

  normalize(): this {
    const len: f64 = this.length();
    if (len > EPSILON) {
      const invLen: f64 = 1.0 / len;
      this.x *= invLen;
      this.y *= invLen;
      this.z *= invLen;
    }
    return this;
  }

  setLength(length: f64): this {
    return this.normalize().mulScalar(length);
  }

  clampLength(minLen: f64, maxLen: f64): this {
    const len: f64 = this.length();
    if (len < EPSILON) return this;
    let clampedLen: f64 = len;
    if (clampedLen < minLen) clampedLen = minLen;
    else if (clampedLen > maxLen) clampedLen = maxLen;
    return this.mulScalar(clampedLen / len);
  }

  lerp(v: Vec3, t: f64): this {
    this.x += (v.x - this.x) * t;
    this.y += (v.y - this.y) * t;
    this.z += (v.z - this.z) * t;
    return this;
  }

  crossVectors(a: Vec3, b: Vec3): this {
    const ax: f64 = a.x, ay: f64 = a.y, az: f64 = a.z;
    const bx: f64 = b.x, by: f64 = b.y, bz: f64 = b.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }

  cross(v: Vec3): this {
    return this.crossVectors(this.clone(), v);
  }

  reflect(normal: Vec3): this {
    const d: f64 = 2.0 * this.dot(normal);
    this.x -= normal.x * d;
    this.y -= normal.y * d;
    this.z -= normal.z * d;
    return this;
  }

  project(v: Vec3): this {
    const len2: f64 = v.lengthSq();
    if (len2 < EPSILON) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      return this;
    }
    const scalar: f64 = this.dot(v) / len2;
    this.x = v.x * scalar;
    this.y = v.y * scalar;
    this.z = v.z * scalar;
    return this;
  }

  projectOnPlane(planeNormal: Vec3): this {
    const d: f64 = this.dot(planeNormal);
    this.x -= planeNormal.x * d;
    this.y -= planeNormal.y * d;
    this.z -= planeNormal.z * d;
    return this;
  }

  @inline
  dot(v: Vec3): f64 {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  @inline
  lengthSq(): f64 {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  @inline
  length(): f64 {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  @inline
  manhattanLength(): f64 {
    let ax: f64 = this.x; if (ax < 0) ax = -ax;
    let ay: f64 = this.y; if (ay < 0) ay = -ay;
    let az: f64 = this.z; if (az < 0) az = -az;
    return ax + ay + az;
  }

  distanceTo(v: Vec3): f64 {
    const dx: f64 = this.x - v.x;
    const dy: f64 = this.y - v.y;
    const dz: f64 = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  @inline
  distanceToSq(v: Vec3): f64 {
    const dx: f64 = this.x - v.x;
    const dy: f64 = this.y - v.y;
    const dz: f64 = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }

  manhattanDistanceTo(v: Vec3): f64 {
    let dx: f64 = this.x - v.x; if (dx < 0) dx = -dx;
    let dy: f64 = this.y - v.y; if (dy < 0) dy = -dy;
    let dz: f64 = this.z - v.z; if (dz < 0) dz = -dz;
    return dx + dy + dz;
  }

  angleTo(v: Vec3): f64 {
    const denominator: f64 = Math.sqrt(this.lengthSq() * v.lengthSq());
    if (denominator == 0.0) return 1.5707963267948966; // HALF_PI
    let theta: f64 = this.dot(v) / denominator;
    if (theta < -1.0) theta = -1.0;
    else if (theta > 1.0) theta = 1.0;
    return Math.acos(theta);
  }

  isZero(epsilon: f64 = EPSILON): bool {
    let ax: f64 = this.x; if (ax < 0) ax = -ax;
    let ay: f64 = this.y; if (ay < 0) ay = -ay;
    let az: f64 = this.z; if (az < 0) az = -az;
    return ax <= epsilon && ay <= epsilon && az <= epsilon;
  }

  isFinite(): bool {
    return isFinite(this.x) && isFinite(this.y) && isFinite(this.z);
  }

  equals(v: Vec3, epsilon: f64 = EPSILON): bool {
    return approxEqual(this.x, v.x, epsilon) &&
           approxEqual(this.y, v.y, epsilon) &&
           approxEqual(this.z, v.z, epsilon);
  }

  exactEquals(v: Vec3): bool {
    return this.x == v.x && this.y == v.y && this.z == v.z;
  }

  static add(a: Vec3, b: Vec3, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    return out;
  }

  static sub(a: Vec3, b: Vec3, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    return out;
  }

  static mul(a: Vec3, b: Vec3, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    return out;
  }

  static div(a: Vec3, b: Vec3, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    out.z = a.z / b.z;
    return out;
  }

  static scale(v: Vec3, s: f64, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = v.x * s;
    out.y = v.y * s;
    out.z = v.z * s;
    return out;
  }

  static negate(v: Vec3, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = -v.x;
    out.y = -v.y;
    out.z = -v.z;
    return out;
  }

  static normalize(v: Vec3, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    const len: f64 = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    if (len > EPSILON) {
      const invLen: f64 = 1.0 / len;
      out.x = v.x * invLen;
      out.y = v.y * invLen;
      out.z = v.z * invLen;
    } else {
      out.x = 0;
      out.y = 0;
      out.z = 0;
    }
    return out;
  }

  static lerp(a: Vec3, b: Vec3, t: f64, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = a.x + (b.x - a.x) * t;
    out.y = a.y + (b.y - a.y) * t;
    out.z = a.z + (b.z - a.z) * t;
    return out;
  }

  static cross(a: Vec3, b: Vec3, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    const ax: f64 = a.x, ay: f64 = a.y, az: f64 = a.z;
    const bx: f64 = b.x, by: f64 = b.y, bz: f64 = b.z;
    out.x = ay * bz - az * by;
    out.y = az * bx - ax * bz;
    out.z = ax * by - ay * bx;
    return out;
  }

  @inline
  static dot(a: Vec3, b: Vec3): f64 {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  static distance(a: Vec3, b: Vec3): f64 {
    const dx: f64 = a.x - b.x;
    const dy: f64 = a.y - b.y;
    const dz: f64 = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  @inline
  static distanceSq(a: Vec3, b: Vec3): f64 {
    const dx: f64 = a.x - b.x;
    const dy: f64 = a.y - b.y;
    const dz: f64 = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
  }

  static min(a: Vec3, b: Vec3, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = a.x < b.x ? a.x : b.x;
    out.y = a.y < b.y ? a.y : b.y;
    out.z = a.z < b.z ? a.z : b.z;
    return out;
  }

  static max(a: Vec3, b: Vec3, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = a.x > b.x ? a.x : b.x;
    out.y = a.y > b.y ? a.y : b.y;
    out.z = a.z > b.z ? a.z : b.z;
    return out;
  }

  static reflect(v: Vec3, n: Vec3, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    const d: f64 = 2.0 * (v.x * n.x + v.y * n.y + v.z * n.z);
    out.x = v.x - n.x * d;
    out.y = v.y - n.y * d;
    out.z = v.z - n.z * d;
    return out;
  }
}
