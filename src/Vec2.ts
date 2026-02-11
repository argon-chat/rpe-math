import { EPSILON, approxEqual } from './constants';

export interface Vec2Like {
  readonly x: number;
  readonly y: number;
}

export interface Vec2Mut {
  x: number;
  y: number;
}
export class Vec2 implements Vec2Mut {
  x: f64;
  y: f64;

  constructor(x: f64 = 0, y: f64 = 0) {
    this.x = x;
    this.y = y;
  }

  @inline static zero(): Vec2 { return new Vec2(0, 0); }
  @inline static one(): Vec2 { return new Vec2(1, 1); }
  @inline static up(): Vec2 { return new Vec2(0, 1); }
  @inline static down(): Vec2 { return new Vec2(0, -1); }
  @inline static left(): Vec2 { return new Vec2(-1, 0); }
  @inline static right(): Vec2 { return new Vec2(1, 0); }

  static fromAngle(radians: f64): Vec2 {
    return new Vec2(Math.cos(radians), Math.sin(radians));
  }

  @inline
  set(x: f64, y: f64): this {
    this.x = x;
    this.y = y;
    return this;
  }

  @inline
  copy(v: Vec2): this {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  @inline
  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  @inline
  add(v: Vec2): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  @inline
  addScalar(s: f64): this {
    this.x += s;
    this.y += s;
    return this;
  }

  @inline
  addScaled(v: Vec2, scale: f64): this {
    this.x += v.x * scale;
    this.y += v.y * scale;
    return this;
  }

  @inline
  sub(v: Vec2): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  @inline
  subScalar(s: f64): this {
    this.x -= s;
    this.y -= s;
    return this;
  }

  @inline
  mul(v: Vec2): this {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }

  @inline
  mulScalar(s: f64): this {
    this.x *= s;
    this.y *= s;
    return this;
  }

  @inline
  div(v: Vec2): this {
    this.x /= v.x;
    this.y /= v.y;
    return this;
  }

  @inline
  divScalar(s: f64): this {
    const inv: f64 = 1.0 / s;
    this.x *= inv;
    this.y *= inv;
    return this;
  }

  @inline
  negate(): this {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  @inline
  abs(): this {
    this.x = this.x < 0 ? -this.x : this.x;
    this.y = this.y < 0 ? -this.y : this.y;
    return this;
  }

  @inline
  floor(): this {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }

  @inline
  ceil(): this {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }

  @inline
  round(): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  @inline
  min(v: Vec2): this {
    if (v.x < this.x) this.x = v.x;
    if (v.y < this.y) this.y = v.y;
    return this;
  }

  @inline
  max(v: Vec2): this {
    if (v.x > this.x) this.x = v.x;
    if (v.y > this.y) this.y = v.y;
    return this;
  }

  clamp(minVal: Vec2, maxVal: Vec2): this {
    if (this.x < minVal.x) this.x = minVal.x;
    else if (this.x > maxVal.x) this.x = maxVal.x;
    if (this.y < minVal.y) this.y = minVal.y;
    else if (this.y > maxVal.y) this.y = maxVal.y;
    return this;
  }

  normalize(): this {
    const len: f64 = this.length();
    if (len > EPSILON) {
      const invLen: f64 = 1.0 / len;
      this.x *= invLen;
      this.y *= invLen;
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

  lerp(v: Vec2, t: f64): this {
    this.x += (v.x - this.x) * t;
    this.y += (v.y - this.y) * t;
    return this;
  }

  rotate(radians: f64): this {
    const cos: f64 = Math.cos(radians);
    const sin: f64 = Math.sin(radians);
    const x: f64 = this.x;
    const y: f64 = this.y;
    this.x = x * cos - y * sin;
    this.y = x * sin + y * cos;
    return this;
  }

  perpendicular(): this {
    const x: f64 = this.x;
    this.x = -this.y;
    this.y = x;
    return this;
  }

  reflect(normal: Vec2): this {
    const d: f64 = 2.0 * this.dot(normal);
    this.x -= normal.x * d;
    this.y -= normal.y * d;
    return this;
  }

  @inline
  dot(v: Vec2): f64 {
    return this.x * v.x + this.y * v.y;
  }

  @inline
  cross(v: Vec2): f64 {
    return this.x * v.y - this.y * v.x;
  }

  @inline
  lengthSq(): f64 {
    return this.x * this.x + this.y * this.y;
  }

  @inline
  length(): f64 {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  @inline
  manhattanLength(): f64 {
    const ax: f64 = this.x < 0 ? -this.x : this.x;
    const ay: f64 = this.y < 0 ? -this.y : this.y;
    return ax + ay;
  }

  distanceTo(v: Vec2): f64 {
    const dx: f64 = this.x - v.x;
    const dy: f64 = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  @inline
  distanceToSq(v: Vec2): f64 {
    const dx: f64 = this.x - v.x;
    const dy: f64 = this.y - v.y;
    return dx * dx + dy * dy;
  }

  manhattanDistanceTo(v: Vec2): f64 {
    let dx: f64 = this.x - v.x;
    let dy: f64 = this.y - v.y;
    if (dx < 0) dx = -dx;
    if (dy < 0) dy = -dy;
    return dx + dy;
  }

  @inline
  angle(): f64 {
    return Math.atan2(this.y, this.x);
  }

  angleTo(v: Vec2): f64 {
    const denominator: f64 = Math.sqrt(this.lengthSq() * (v.x * v.x + v.y * v.y));
    if (denominator == 0.0) return 1.5707963267948966; // HALF_PI
    let theta: f64 = this.dot(v) / denominator;
    if (theta < -1.0) theta = -1.0;
    else if (theta > 1.0) theta = 1.0;
    return Math.acos(theta);
  }

  signedAngleTo(v: Vec2): f64 {
    return Math.atan2(this.cross(v), this.dot(v));
  }

  isZero(epsilon: f64 = EPSILON): bool {
    const ax: f64 = this.x < 0 ? -this.x : this.x;
    const ay: f64 = this.y < 0 ? -this.y : this.y;
    return ax <= epsilon && ay <= epsilon;
  }

  isFinite(): bool {
    return isFinite(this.x) && isFinite(this.y);
  }

  equals(v: Vec2, epsilon: f64 = EPSILON): bool {
    return approxEqual(this.x, v.x, epsilon) && approxEqual(this.y, v.y, epsilon);
  }

  exactEquals(v: Vec2): bool {
    return this.x == v.x && this.y == v.y;
  }

  static add(a: Vec2, b: Vec2, out: Vec2 | null = null): Vec2 {
    if (out === null) out = new Vec2();
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    return out;
  }

  static sub(a: Vec2, b: Vec2, out: Vec2 | null = null): Vec2 {
    if (out === null) out = new Vec2();
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    return out;
  }

  static mul(a: Vec2, b: Vec2, out: Vec2 | null = null): Vec2 {
    if (out === null) out = new Vec2();
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    return out;
  }

  static div(a: Vec2, b: Vec2, out: Vec2 | null = null): Vec2 {
    if (out === null) out = new Vec2();
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    return out;
  }

  static scale(v: Vec2, s: f64, out: Vec2 | null = null): Vec2 {
    if (out === null) out = new Vec2();
    out.x = v.x * s;
    out.y = v.y * s;
    return out;
  }

  static negate(v: Vec2, out: Vec2 | null = null): Vec2 {
    if (out === null) out = new Vec2();
    out.x = -v.x;
    out.y = -v.y;
    return out;
  }

  static normalize(v: Vec2, out: Vec2 | null = null): Vec2 {
    if (out === null) out = new Vec2();
    const len: f64 = Math.sqrt(v.x * v.x + v.y * v.y);
    if (len > EPSILON) {
      const invLen: f64 = 1.0 / len;
      out.x = v.x * invLen;
      out.y = v.y * invLen;
    } else {
      out.x = 0;
      out.y = 0;
    }
    return out;
  }

  static lerp(a: Vec2, b: Vec2, t: f64, out: Vec2 | null = null): Vec2 {
    if (out === null) out = new Vec2();
    out.x = a.x + (b.x - a.x) * t;
    out.y = a.y + (b.y - a.y) * t;
    return out;
  }

  @inline
  static dot(a: Vec2, b: Vec2): f64 {
    return a.x * b.x + a.y * b.y;
  }

  @inline
  static cross(a: Vec2, b: Vec2): f64 {
    return a.x * b.y - a.y * b.x;
  }

  static distance(a: Vec2, b: Vec2): f64 {
    const dx: f64 = a.x - b.x;
    const dy: f64 = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  @inline
  static distanceSq(a: Vec2, b: Vec2): f64 {
    const dx: f64 = a.x - b.x;
    const dy: f64 = a.y - b.y;
    return dx * dx + dy * dy;
  }

  static min(a: Vec2, b: Vec2, out: Vec2 | null = null): Vec2 {
    if (out === null) out = new Vec2();
    out.x = a.x < b.x ? a.x : b.x;
    out.y = a.y < b.y ? a.y : b.y;
    return out;
  }

  static max(a: Vec2, b: Vec2, out: Vec2 | null = null): Vec2 {
    if (out === null) out = new Vec2();
    out.x = a.x > b.x ? a.x : b.x;
    out.y = a.y > b.y ? a.y : b.y;
    return out;
  }

  static reflect(v: Vec2, n: Vec2, out: Vec2 | null = null): Vec2 {
    if (out === null) out = new Vec2();
    const d: f64 = 2.0 * (v.x * n.x + v.y * n.y);
    out.x = v.x - n.x * d;
    out.y = v.y - n.y * d;
    return out;
  }
}
