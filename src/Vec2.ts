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
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  static zero(): Vec2 { return new Vec2(0, 0); }
  static one(): Vec2 { return new Vec2(1, 1); }
  static up(): Vec2 { return new Vec2(0, 1); }
  static down(): Vec2 { return new Vec2(0, -1); }
  static left(): Vec2 { return new Vec2(-1, 0); }
  static right(): Vec2 { return new Vec2(1, 0); }

  static fromAngle(radians: number): Vec2 {
    return new Vec2(Math.cos(radians), Math.sin(radians));
  }

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  copy(v: Vec2): this {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  add(v: Vec2): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  addScalar(s: number): this {
    this.x += s;
    this.y += s;
    return this;
  }

  addScaled(v: Vec2, scale: number): this {
    this.x += v.x * scale;
    this.y += v.y * scale;
    return this;
  }

  sub(v: Vec2): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  subScalar(s: number): this {
    this.x -= s;
    this.y -= s;
    return this;
  }

  mul(v: Vec2): this {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }

  mulScalar(s: number): this {
    this.x *= s;
    this.y *= s;
    return this;
  }

  div(v: Vec2): this {
    this.x /= v.x;
    this.y /= v.y;
    return this;
  }

  divScalar(s: number): this {
    const inv: number = 1.0 / s;
    this.x *= inv;
    this.y *= inv;
    return this;
  }

  negate(): this {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  abs(): this {
    this.x = this.x < 0 ? -this.x : this.x;
    this.y = this.y < 0 ? -this.y : this.y;
    return this;
  }

  floor(): this {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }

  ceil(): this {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }

  round(): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  min(v: Vec2): this {
    if (v.x < this.x) this.x = v.x;
    if (v.y < this.y) this.y = v.y;
    return this;
  }

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
    const len: number = this.length();
    if (len > EPSILON) {
      const invLen: number = 1.0 / len;
      this.x *= invLen;
      this.y *= invLen;
    }
    return this;
  }

  setLength(length: number): this {
    return this.normalize().mulScalar(length);
  }

  clampLength(minLen: number, maxLen: number): this {
    const len: number = this.length();
    if (len < EPSILON) return this;
    let clampedLen: number = len;
    if (clampedLen < minLen) clampedLen = minLen;
    else if (clampedLen > maxLen) clampedLen = maxLen;
    return this.mulScalar(clampedLen / len);
  }

  lerp(v: Vec2, t: number): this {
    this.x += (v.x - this.x) * t;
    this.y += (v.y - this.y) * t;
    return this;
  }

  rotate(radians: number): this {
    const cos: number = Math.cos(radians);
    const sin: number = Math.sin(radians);
    const x: number = this.x;
    const y: number = this.y;
    this.x = x * cos - y * sin;
    this.y = x * sin + y * cos;
    return this;
  }

  perpendicular(): this {
    const x: number = this.x;
    this.x = -this.y;
    this.y = x;
    return this;
  }

  reflect(normal: Vec2): this {
    const d: number = 2.0 * this.dot(normal);
    this.x -= normal.x * d;
    this.y -= normal.y * d;
    return this;
  }

  dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y;
  }

  cross(v: Vec2): number {
    return this.x * v.y - this.y * v.x;
  }

  lengthSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  manhattanLength(): number {
    const ax: number = this.x < 0 ? -this.x : this.x;
    const ay: number = this.y < 0 ? -this.y : this.y;
    return ax + ay;
  }

  distanceTo(v: Vec2): number {
    const dx: number = this.x - v.x;
    const dy: number = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  distanceToSq(v: Vec2): number {
    const dx: number = this.x - v.x;
    const dy: number = this.y - v.y;
    return dx * dx + dy * dy;
  }

  manhattanDistanceTo(v: Vec2): number {
    let dx: number = this.x - v.x;
    let dy: number = this.y - v.y;
    if (dx < 0) dx = -dx;
    if (dy < 0) dy = -dy;
    return dx + dy;
  }

  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  angleTo(v: Vec2): number {
    const denominator: number = Math.sqrt(this.lengthSq() * (v.x * v.x + v.y * v.y));
    if (denominator == 0.0) return 1.5707963267948966; // HALF_PI
    let theta: number = this.dot(v) / denominator;
    if (theta < -1.0) theta = -1.0;
    else if (theta > 1.0) theta = 1.0;
    return Math.acos(theta);
  }

  signedAngleTo(v: Vec2): number {
    return Math.atan2(this.cross(v), this.dot(v));
  }

  isZero(epsilon: number = EPSILON): boolean {
    const ax: number = this.x < 0 ? -this.x : this.x;
    const ay: number = this.y < 0 ? -this.y : this.y;
    return ax <= epsilon && ay <= epsilon;
  }

  isFinite(): boolean {
    return isFinite(this.x) && isFinite(this.y);
  }

  equals(v: Vec2, epsilon: number = EPSILON): boolean {
    return approxEqual(this.x, v.x, epsilon) && approxEqual(this.y, v.y, epsilon);
  }

  exactEquals(v: Vec2): boolean {
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

  static scale(v: Vec2, s: number, out: Vec2 | null = null): Vec2 {
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
    const len: number = Math.sqrt(v.x * v.x + v.y * v.y);
    if (len > EPSILON) {
      const invLen: number = 1.0 / len;
      out.x = v.x * invLen;
      out.y = v.y * invLen;
    } else {
      out.x = 0;
      out.y = 0;
    }
    return out;
  }

  static lerp(a: Vec2, b: Vec2, t: number, out: Vec2 | null = null): Vec2 {
    if (out === null) out = new Vec2();
    out.x = a.x + (b.x - a.x) * t;
    out.y = a.y + (b.y - a.y) * t;
    return out;
  }

  static dot(a: Vec2, b: Vec2): number {
    return a.x * b.x + a.y * b.y;
  }

  static cross(a: Vec2, b: Vec2): number {
    return a.x * b.y - a.y * b.x;
  }

  static distance(a: Vec2, b: Vec2): number {
    const dx: number = a.x - b.x;
    const dy: number = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static distanceSq(a: Vec2, b: Vec2): number {
    const dx: number = a.x - b.x;
    const dy: number = a.y - b.y;
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
    const d: number = 2.0 * (v.x * n.x + v.y * n.y);
    out.x = v.x - n.x * d;
    out.y = v.y - n.y * d;
    return out;
  }
}
