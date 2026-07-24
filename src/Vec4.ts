import { EPSILON, approxEqual } from './constants';

export class Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  static zero(): Vec4 { return new Vec4(0, 0, 0, 0); }
  static one(): Vec4 { return new Vec4(1, 1, 1, 1); }

  set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  copy(v: Vec4): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
    return this;
  }

  clone(): Vec4 {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  add(v: Vec4): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;
    return this;
  }

  addScalar(s: number): this {
    this.x += s;
    this.y += s;
    this.z += s;
    this.w += s;
    return this;
  }

  sub(v: Vec4): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;
    return this;
  }

  subScalar(s: number): this {
    this.x -= s;
    this.y -= s;
    this.z -= s;
    this.w -= s;
    return this;
  }

  mul(v: Vec4): this {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    this.w *= v.w;
    return this;
  }

  mulScalar(s: number): this {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    this.w *= s;
    return this;
  }

  div(v: Vec4): this {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    this.w /= v.w;
    return this;
  }

  divScalar(s: number): this {
    const inv: number = 1.0 / s;
    this.x *= inv;
    this.y *= inv;
    this.z *= inv;
    this.w *= inv;
    return this;
  }

  negate(): this {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;
    return this;
  }

  abs(): this {
    if (this.x < 0) this.x = -this.x;
    if (this.y < 0) this.y = -this.y;
    if (this.z < 0) this.z = -this.z;
    if (this.w < 0) this.w = -this.w;
    return this;
  }

  floor(): this {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    this.w = Math.floor(this.w);
    return this;
  }

  ceil(): this {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    this.w = Math.ceil(this.w);
    return this;
  }

  round(): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    this.w = Math.round(this.w);
    return this;
  }

  min(v: Vec4): this {
    if (v.x < this.x) this.x = v.x;
    if (v.y < this.y) this.y = v.y;
    if (v.z < this.z) this.z = v.z;
    if (v.w < this.w) this.w = v.w;
    return this;
  }

  max(v: Vec4): this {
    if (v.x > this.x) this.x = v.x;
    if (v.y > this.y) this.y = v.y;
    if (v.z > this.z) this.z = v.z;
    if (v.w > this.w) this.w = v.w;
    return this;
  }

  clamp(minVal: Vec4, maxVal: Vec4): this {
    if (this.x < minVal.x) this.x = minVal.x;
    else if (this.x > maxVal.x) this.x = maxVal.x;
    if (this.y < minVal.y) this.y = minVal.y;
    else if (this.y > maxVal.y) this.y = maxVal.y;
    if (this.z < minVal.z) this.z = minVal.z;
    else if (this.z > maxVal.z) this.z = maxVal.z;
    if (this.w < minVal.w) this.w = minVal.w;
    else if (this.w > maxVal.w) this.w = maxVal.w;
    return this;
  }

  normalize(): this {
    const len: number = this.length();
    if (len > EPSILON) {
      const invLen: number = 1.0 / len;
      this.x *= invLen;
      this.y *= invLen;
      this.z *= invLen;
      this.w *= invLen;
    }
    return this;
  }

  lerp(v: Vec4, t: number): this {
    this.x += (v.x - this.x) * t;
    this.y += (v.y - this.y) * t;
    this.z += (v.z - this.z) * t;
    this.w += (v.w - this.w) * t;
    return this;
  }

  dot(v: Vec4): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  lengthSq(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  manhattanLength(): number {
    let ax: number = this.x; if (ax < 0) ax = -ax;
    let ay: number = this.y; if (ay < 0) ay = -ay;
    let az: number = this.z; if (az < 0) az = -az;
    let aw: number = this.w; if (aw < 0) aw = -aw;
    return ax + ay + az + aw;
  }

  isZero(epsilon: number = EPSILON): boolean {
    let ax: number = this.x; if (ax < 0) ax = -ax;
    let ay: number = this.y; if (ay < 0) ay = -ay;
    let az: number = this.z; if (az < 0) az = -az;
    let aw: number = this.w; if (aw < 0) aw = -aw;
    return ax <= epsilon && ay <= epsilon && az <= epsilon && aw <= epsilon;
  }

  isFinite(): boolean {
    return isFinite(this.x) && isFinite(this.y) && isFinite(this.z) && isFinite(this.w);
  }

  equals(v: Vec4, epsilon: number = EPSILON): boolean {
    return approxEqual(this.x, v.x, epsilon) &&
           approxEqual(this.y, v.y, epsilon) &&
           approxEqual(this.z, v.z, epsilon) &&
           approxEqual(this.w, v.w, epsilon);
  }

  exactEquals(v: Vec4): boolean {
    return this.x == v.x && this.y == v.y && this.z == v.z && this.w == v.w;
  }

  static add(a: Vec4, b: Vec4, out: Vec4 | null = null): Vec4 {
    if (out === null) out = new Vec4();
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    out.w = a.w + b.w;
    return out;
  }

  static sub(a: Vec4, b: Vec4, out: Vec4 | null = null): Vec4 {
    if (out === null) out = new Vec4();
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    out.w = a.w - b.w;
    return out;
  }

  static mul(a: Vec4, b: Vec4, out: Vec4 | null = null): Vec4 {
    if (out === null) out = new Vec4();
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    out.w = a.w * b.w;
    return out;
  }

  static scale(v: Vec4, s: number, out: Vec4 | null = null): Vec4 {
    if (out === null) out = new Vec4();
    out.x = v.x * s;
    out.y = v.y * s;
    out.z = v.z * s;
    out.w = v.w * s;
    return out;
  }

  static normalize(v: Vec4, out: Vec4 | null = null): Vec4 {
    if (out === null) out = new Vec4();
    const len: number = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z + v.w * v.w);
    if (len > EPSILON) {
      const invLen: number = 1.0 / len;
      out.x = v.x * invLen;
      out.y = v.y * invLen;
      out.z = v.z * invLen;
      out.w = v.w * invLen;
    } else {
      out.x = 0;
      out.y = 0;
      out.z = 0;
      out.w = 0;
    }
    return out;
  }

  static lerp(a: Vec4, b: Vec4, t: number, out: Vec4 | null = null): Vec4 {
    if (out === null) out = new Vec4();
    out.x = a.x + (b.x - a.x) * t;
    out.y = a.y + (b.y - a.y) * t;
    out.z = a.z + (b.z - a.z) * t;
    out.w = a.w + (b.w - a.w) * t;
    return out;
  }

  static dot(a: Vec4, b: Vec4): number {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  }

  static min(a: Vec4, b: Vec4, out: Vec4 | null = null): Vec4 {
    if (out === null) out = new Vec4();
    out.x = a.x < b.x ? a.x : b.x;
    out.y = a.y < b.y ? a.y : b.y;
    out.z = a.z < b.z ? a.z : b.z;
    out.w = a.w < b.w ? a.w : b.w;
    return out;
  }

  static max(a: Vec4, b: Vec4, out: Vec4 | null = null): Vec4 {
    if (out === null) out = new Vec4();
    out.x = a.x > b.x ? a.x : b.x;
    out.y = a.y > b.y ? a.y : b.y;
    out.z = a.z > b.z ? a.z : b.z;
    out.w = a.w > b.w ? a.w : b.w;
    return out;
  }
}
