import { EPSILON, approxEqual } from './constants';
import { Vec3 } from './Vec3';
import { Vec4 } from './Vec4';

/**
 * Layout:
 * | m00 m04 m08 m12 |   | 0  4  8  12 |
 * | m01 m05 m09 m13 | = | 1  5  9  13 |
 * | m02 m06 m10 m14 |   | 2  6  10 14 |
 * | m03 m07 m11 m15 |   | 3  7  11 15 |
 */
export class Mat4 {
  // Column 0
  m00: f64; m01: f64; m02: f64; m03: f64;
  // Column 1
  m04: f64; m05: f64; m06: f64; m07: f64;
  // Column 2
  m08: f64; m09: f64; m10: f64; m11: f64;
  // Column 3
  m12: f64; m13: f64; m14: f64; m15: f64;

  constructor() {
    // Identity by default
    this.m00 = 1; this.m01 = 0; this.m02 = 0; this.m03 = 0;
    this.m04 = 0; this.m05 = 1; this.m06 = 0; this.m07 = 0;
    this.m08 = 0; this.m09 = 0; this.m10 = 1; this.m11 = 0;
    this.m12 = 0; this.m13 = 0; this.m14 = 0; this.m15 = 1;
  }

  static identity(): Mat4 {
    return new Mat4();
  }

  static zero(): Mat4 {
    const m = new Mat4();
    m.m00 = 0; m.m05 = 0; m.m10 = 0; m.m15 = 0;
    return m;
  }

  static fromValues(
    m00: f64, m01: f64, m02: f64, m03: f64,
    m04: f64, m05: f64, m06: f64, m07: f64,
    m08: f64, m09: f64, m10: f64, m11: f64,
    m12: f64, m13: f64, m14: f64, m15: f64
  ): Mat4 {
    const m = new Mat4();
    m.m00 = m00; m.m01 = m01; m.m02 = m02; m.m03 = m03;
    m.m04 = m04; m.m05 = m05; m.m06 = m06; m.m07 = m07;
    m.m08 = m08; m.m09 = m09; m.m10 = m10; m.m11 = m11;
    m.m12 = m12; m.m13 = m13; m.m14 = m14; m.m15 = m15;
    return m;
  }

  @inline
  setIdentity(): this {
    this.m00 = 1; this.m01 = 0; this.m02 = 0; this.m03 = 0;
    this.m04 = 0; this.m05 = 1; this.m06 = 0; this.m07 = 0;
    this.m08 = 0; this.m09 = 0; this.m10 = 1; this.m11 = 0;
    this.m12 = 0; this.m13 = 0; this.m14 = 0; this.m15 = 1;
    return this;
  }

  @inline
  copy(src: Mat4): this {
    this.m00 = src.m00; this.m01 = src.m01; this.m02 = src.m02; this.m03 = src.m03;
    this.m04 = src.m04; this.m05 = src.m05; this.m06 = src.m06; this.m07 = src.m07;
    this.m08 = src.m08; this.m09 = src.m09; this.m10 = src.m10; this.m11 = src.m11;
    this.m12 = src.m12; this.m13 = src.m13; this.m14 = src.m14; this.m15 = src.m15;
    return this;
  }

  @inline
  clone(): Mat4 {
    return new Mat4().copy(this);
  }

  multiply(b: Mat4): this {
    const a00 = this.m00, a01 = this.m01, a02 = this.m02, a03 = this.m03;
    const a10 = this.m04, a11 = this.m05, a12 = this.m06, a13 = this.m07;
    const a20 = this.m08, a21 = this.m09, a22 = this.m10, a23 = this.m11;
    const a30 = this.m12, a31 = this.m13, a32 = this.m14, a33 = this.m15;

    let bx = b.m00, by = b.m01, bz = b.m02, bw = b.m03;
    this.m00 = bx * a00 + by * a10 + bz * a20 + bw * a30;
    this.m01 = bx * a01 + by * a11 + bz * a21 + bw * a31;
    this.m02 = bx * a02 + by * a12 + bz * a22 + bw * a32;
    this.m03 = bx * a03 + by * a13 + bz * a23 + bw * a33;

    bx = b.m04; by = b.m05; bz = b.m06; bw = b.m07;
    this.m04 = bx * a00 + by * a10 + bz * a20 + bw * a30;
    this.m05 = bx * a01 + by * a11 + bz * a21 + bw * a31;
    this.m06 = bx * a02 + by * a12 + bz * a22 + bw * a32;
    this.m07 = bx * a03 + by * a13 + bz * a23 + bw * a33;

    bx = b.m08; by = b.m09; bz = b.m10; bw = b.m11;
    this.m08 = bx * a00 + by * a10 + bz * a20 + bw * a30;
    this.m09 = bx * a01 + by * a11 + bz * a21 + bw * a31;
    this.m10 = bx * a02 + by * a12 + bz * a22 + bw * a32;
    this.m11 = bx * a03 + by * a13 + bz * a23 + bw * a33;

    bx = b.m12; by = b.m13; bz = b.m14; bw = b.m15;
    this.m12 = bx * a00 + by * a10 + bz * a20 + bw * a30;
    this.m13 = bx * a01 + by * a11 + bz * a21 + bw * a31;
    this.m14 = bx * a02 + by * a12 + bz * a22 + bw * a32;
    this.m15 = bx * a03 + by * a13 + bz * a23 + bw * a33;

    return this;
  }

  premultiply(b: Mat4): this {
    const temp = Mat4.multiply(b, this, null);
    return this.copy(temp);
  }

  translate(x: f64, y: f64, z: f64): this {
    this.m12 += this.m00 * x + this.m04 * y + this.m08 * z;
    this.m13 += this.m01 * x + this.m05 * y + this.m09 * z;
    this.m14 += this.m02 * x + this.m06 * y + this.m10 * z;
    this.m15 += this.m03 * x + this.m07 * y + this.m11 * z;
    return this;
  }

  translateVec(v: Vec3): this {
    return this.translate(v.x, v.y, v.z);
  }

  scale(x: f64, y: f64, z: f64): this {
    this.m00 *= x; this.m01 *= x; this.m02 *= x; this.m03 *= x;
    this.m04 *= y; this.m05 *= y; this.m06 *= y; this.m07 *= y;
    this.m08 *= z; this.m09 *= z; this.m10 *= z; this.m11 *= z;
    return this;
  }

  scaleVec(v: Vec3): this {
    return this.scale(v.x, v.y, v.z);
  }

  scaleScalar(s: f64): this {
    return this.scale(s, s, s);
  }

  rotateX(radians: f64): this {
    const c: f64 = Math.cos(radians);
    const s: f64 = Math.sin(radians);

    const a10 = this.m04, a11 = this.m05, a12 = this.m06, a13 = this.m07;
    const a20 = this.m08, a21 = this.m09, a22 = this.m10, a23 = this.m11;

    this.m04 = a10 * c + a20 * s;
    this.m05 = a11 * c + a21 * s;
    this.m06 = a12 * c + a22 * s;
    this.m07 = a13 * c + a23 * s;
    this.m08 = a20 * c - a10 * s;
    this.m09 = a21 * c - a11 * s;
    this.m10 = a22 * c - a12 * s;
    this.m11 = a23 * c - a13 * s;

    return this;
  }

  rotateY(radians: f64): this {
    const c: f64 = Math.cos(radians);
    const s: f64 = Math.sin(radians);

    const a00 = this.m00, a01 = this.m01, a02 = this.m02, a03 = this.m03;
    const a20 = this.m08, a21 = this.m09, a22 = this.m10, a23 = this.m11;

    this.m00 = a00 * c - a20 * s;
    this.m01 = a01 * c - a21 * s;
    this.m02 = a02 * c - a22 * s;
    this.m03 = a03 * c - a23 * s;
    this.m08 = a00 * s + a20 * c;
    this.m09 = a01 * s + a21 * c;
    this.m10 = a02 * s + a22 * c;
    this.m11 = a03 * s + a23 * c;

    return this;
  }

  rotateZ(radians: f64): this {
    const c: f64 = Math.cos(radians);
    const s: f64 = Math.sin(radians);

    const a00 = this.m00, a01 = this.m01, a02 = this.m02, a03 = this.m03;
    const a10 = this.m04, a11 = this.m05, a12 = this.m06, a13 = this.m07;

    this.m00 = a00 * c + a10 * s;
    this.m01 = a01 * c + a11 * s;
    this.m02 = a02 * c + a12 * s;
    this.m03 = a03 * c + a13 * s;
    this.m04 = a10 * c - a00 * s;
    this.m05 = a11 * c - a01 * s;
    this.m06 = a12 * c - a02 * s;
    this.m07 = a13 * c - a03 * s;

    return this;
  }

  rotate(radians: f64, axisX: f64, axisY: f64, axisZ: f64): this {
    let len: f64 = Math.sqrt(axisX * axisX + axisY * axisY + axisZ * axisZ);
    if (len < EPSILON) return this;

    len = 1.0 / len;
    const x: f64 = axisX * len;
    const y: f64 = axisY * len;
    const z: f64 = axisZ * len;

    const c: f64 = Math.cos(radians);
    const s: f64 = Math.sin(radians);
    const t: f64 = 1.0 - c;

    const r00 = x * x * t + c,     r01 = y * x * t + z * s, r02 = z * x * t - y * s;
    const r10 = x * y * t - z * s, r11 = y * y * t + c,     r12 = z * y * t + x * s;
    const r20 = x * z * t + y * s, r21 = y * z * t - x * s, r22 = z * z * t + c;

    const a00 = this.m00, a01 = this.m01, a02 = this.m02, a03 = this.m03;
    const a10 = this.m04, a11 = this.m05, a12 = this.m06, a13 = this.m07;
    const a20 = this.m08, a21 = this.m09, a22 = this.m10, a23 = this.m11;

    this.m00 = a00 * r00 + a10 * r01 + a20 * r02;
    this.m01 = a01 * r00 + a11 * r01 + a21 * r02;
    this.m02 = a02 * r00 + a12 * r01 + a22 * r02;
    this.m03 = a03 * r00 + a13 * r01 + a23 * r02;
    this.m04 = a00 * r10 + a10 * r11 + a20 * r12;
    this.m05 = a01 * r10 + a11 * r11 + a21 * r12;
    this.m06 = a02 * r10 + a12 * r11 + a22 * r12;
    this.m07 = a03 * r10 + a13 * r11 + a23 * r12;
    this.m08 = a00 * r20 + a10 * r21 + a20 * r22;
    this.m09 = a01 * r20 + a11 * r21 + a21 * r22;
    this.m10 = a02 * r20 + a12 * r21 + a22 * r22;
    this.m11 = a03 * r20 + a13 * r21 + a23 * r22;

    return this;
  }

  transpose(): this {
    let t: f64;
    t = this.m01; this.m01 = this.m04; this.m04 = t;
    t = this.m02; this.m02 = this.m08; this.m08 = t;
    t = this.m03; this.m03 = this.m12; this.m12 = t;
    t = this.m06; this.m06 = this.m09; this.m09 = t;
    t = this.m07; this.m07 = this.m13; this.m13 = t;
    t = this.m11; this.m11 = this.m14; this.m14 = t;
    return this;
  }

  invert(): this {
    const a00 = this.m00, a01 = this.m01, a02 = this.m02, a03 = this.m03;
    const a10 = this.m04, a11 = this.m05, a12 = this.m06, a13 = this.m07;
    const a20 = this.m08, a21 = this.m09, a22 = this.m10, a23 = this.m11;
    const a30 = this.m12, a31 = this.m13, a32 = this.m14, a33 = this.m15;

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (det < EPSILON && det > -EPSILON) {
      return this; // Non-invertible
    }

    det = 1.0 / det;

    this.m00 = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    this.m01 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    this.m02 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    this.m03 = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    this.m04 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    this.m05 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    this.m06 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    this.m07 = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    this.m08 = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    this.m09 = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    this.m10 = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    this.m11 = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    this.m12 = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    this.m13 = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    this.m14 = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    this.m15 = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return this;
  }

  determinant(): f64 {
    const a00 = this.m00, a01 = this.m01, a02 = this.m02, a03 = this.m03;
    const a10 = this.m04, a11 = this.m05, a12 = this.m06, a13 = this.m07;
    const a20 = this.m08, a21 = this.m09, a22 = this.m10, a23 = this.m11;
    const a30 = this.m12, a31 = this.m13, a32 = this.m14, a33 = this.m15;

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }

  getTranslation(out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = this.m12;
    out.y = this.m13;
    out.z = this.m14;
    return out;
  }

  getScaling(out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = Math.sqrt(this.m00 * this.m00 + this.m01 * this.m01 + this.m02 * this.m02);
    out.y = Math.sqrt(this.m04 * this.m04 + this.m05 * this.m05 + this.m06 * this.m06);
    out.z = Math.sqrt(this.m08 * this.m08 + this.m09 * this.m09 + this.m10 * this.m10);
    return out;
  }

  equals(m: Mat4, epsilon: f64 = EPSILON): bool {
    return approxEqual(this.m00, m.m00, epsilon) &&
           approxEqual(this.m01, m.m01, epsilon) &&
           approxEqual(this.m02, m.m02, epsilon) &&
           approxEqual(this.m03, m.m03, epsilon) &&
           approxEqual(this.m04, m.m04, epsilon) &&
           approxEqual(this.m05, m.m05, epsilon) &&
           approxEqual(this.m06, m.m06, epsilon) &&
           approxEqual(this.m07, m.m07, epsilon) &&
           approxEqual(this.m08, m.m08, epsilon) &&
           approxEqual(this.m09, m.m09, epsilon) &&
           approxEqual(this.m10, m.m10, epsilon) &&
           approxEqual(this.m11, m.m11, epsilon) &&
           approxEqual(this.m12, m.m12, epsilon) &&
           approxEqual(this.m13, m.m13, epsilon) &&
           approxEqual(this.m14, m.m14, epsilon) &&
           approxEqual(this.m15, m.m15, epsilon);
  }

  transformVec3(v: Vec3, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    const x = v.x, y = v.y, z = v.z;
    const w: f64 = 1.0 / (this.m03 * x + this.m07 * y + this.m11 * z + this.m15);
    out.x = (this.m00 * x + this.m04 * y + this.m08 * z + this.m12) * w;
    out.y = (this.m01 * x + this.m05 * y + this.m09 * z + this.m13) * w;
    out.z = (this.m02 * x + this.m06 * y + this.m10 * z + this.m14) * w;
    return out;
  }

  transformVec4(v: Vec4, out: Vec4 | null = null): Vec4 {
    if (out === null) out = new Vec4();
    const x = v.x, y = v.y, z = v.z, w = v.w;
    out.x = this.m00 * x + this.m04 * y + this.m08 * z + this.m12 * w;
    out.y = this.m01 * x + this.m05 * y + this.m09 * z + this.m13 * w;
    out.z = this.m02 * x + this.m06 * y + this.m10 * z + this.m14 * w;
    out.w = this.m03 * x + this.m07 * y + this.m11 * z + this.m15 * w;
    return out;
  }

  transformDirection(v: Vec3, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    const x = v.x, y = v.y, z = v.z;
    out.x = this.m00 * x + this.m04 * y + this.m08 * z;
    out.y = this.m01 * x + this.m05 * y + this.m09 * z;
    out.z = this.m02 * x + this.m06 * y + this.m10 * z;
    return out;
  }

  static multiply(a: Mat4, b: Mat4, out: Mat4 | null = null): Mat4 {
    if (out === null) out = new Mat4();

    const a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03;
    const a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07;
    const a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11;
    const a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

    let bx = b.m00, by = b.m01, bz = b.m02, bw = b.m03;
    out.m00 = bx * a00 + by * a10 + bz * a20 + bw * a30;
    out.m01 = bx * a01 + by * a11 + bz * a21 + bw * a31;
    out.m02 = bx * a02 + by * a12 + bz * a22 + bw * a32;
    out.m03 = bx * a03 + by * a13 + bz * a23 + bw * a33;

    bx = b.m04; by = b.m05; bz = b.m06; bw = b.m07;
    out.m04 = bx * a00 + by * a10 + bz * a20 + bw * a30;
    out.m05 = bx * a01 + by * a11 + bz * a21 + bw * a31;
    out.m06 = bx * a02 + by * a12 + bz * a22 + bw * a32;
    out.m07 = bx * a03 + by * a13 + bz * a23 + bw * a33;

    bx = b.m08; by = b.m09; bz = b.m10; bw = b.m11;
    out.m08 = bx * a00 + by * a10 + bz * a20 + bw * a30;
    out.m09 = bx * a01 + by * a11 + bz * a21 + bw * a31;
    out.m10 = bx * a02 + by * a12 + bz * a22 + bw * a32;
    out.m11 = bx * a03 + by * a13 + bz * a23 + bw * a33;

    bx = b.m12; by = b.m13; bz = b.m14; bw = b.m15;
    out.m12 = bx * a00 + by * a10 + bz * a20 + bw * a30;
    out.m13 = bx * a01 + by * a11 + bz * a21 + bw * a31;
    out.m14 = bx * a02 + by * a12 + bz * a22 + bw * a32;
    out.m15 = bx * a03 + by * a13 + bz * a23 + bw * a33;

    return out;
  }

  static transpose(m: Mat4, out: Mat4 | null = null): Mat4 {
    if (out === null) out = new Mat4();
    out.m00 = m.m00; out.m01 = m.m04; out.m02 = m.m08; out.m03 = m.m12;
    out.m04 = m.m01; out.m05 = m.m05; out.m06 = m.m09; out.m07 = m.m13;
    out.m08 = m.m02; out.m09 = m.m06; out.m10 = m.m10; out.m11 = m.m14;
    out.m12 = m.m03; out.m13 = m.m07; out.m14 = m.m11; out.m15 = m.m15;
    return out;
  }

  static perspective(fovY: f64, aspect: f64, near: f64, far: f64, out: Mat4 | null = null): Mat4 {
    if (out === null) out = new Mat4();

    const f: f64 = 1.0 / Math.tan(fovY / 2.0);
    const nf: f64 = 1.0 / (near - far);

    out.m00 = f / aspect; out.m01 = 0; out.m02 = 0; out.m03 = 0;
    out.m04 = 0; out.m05 = f; out.m06 = 0; out.m07 = 0;
    out.m08 = 0; out.m09 = 0; out.m10 = (far + near) * nf; out.m11 = -1;
    out.m12 = 0; out.m13 = 0; out.m14 = 2 * far * near * nf; out.m15 = 0;

    return out;
  }

  static ortho(left: f64, right: f64, bottom: f64, top: f64, near: f64, far: f64, out: Mat4 | null = null): Mat4 {
    if (out === null) out = new Mat4();

    const lr: f64 = 1.0 / (left - right);
    const bt: f64 = 1.0 / (bottom - top);
    const nf: f64 = 1.0 / (near - far);

    out.m00 = -2 * lr; out.m01 = 0; out.m02 = 0; out.m03 = 0;
    out.m04 = 0; out.m05 = -2 * bt; out.m06 = 0; out.m07 = 0;
    out.m08 = 0; out.m09 = 0; out.m10 = 2 * nf; out.m11 = 0;
    out.m12 = (left + right) * lr; out.m13 = (top + bottom) * bt; out.m14 = (far + near) * nf; out.m15 = 1;

    return out;
  }

  static lookAt(eye: Vec3, target: Vec3, up: Vec3, out: Mat4 | null = null): Mat4 {
    if (out === null) out = new Mat4();

    const eyex = eye.x, eyey = eye.y, eyez = eye.z;
    const targetx = target.x, targety = target.y, targetz = target.z;
    const upx = up.x, upy = up.y, upz = up.z;

    let zx = eyex - targetx;
    let zy = eyey - targety;
    let zz = eyez - targetz;

    let len: f64 = zx * zx + zy * zy + zz * zz;
    if (len > 0) {
      len = 1.0 / Math.sqrt(len);
      zx *= len; zy *= len; zz *= len;
    }

    let xx = upy * zz - upz * zy;
    let xy = upz * zx - upx * zz;
    let xz = upx * zy - upy * zx;

    len = xx * xx + xy * xy + xz * xz;
    if (len > 0) {
      len = 1.0 / Math.sqrt(len);
      xx *= len; xy *= len; xz *= len;
    }

    const yx = zy * xz - zz * xy;
    const yy = zz * xx - zx * xz;
    const yz = zx * xy - zy * xx;

    out.m00 = xx; out.m01 = yx; out.m02 = zx; out.m03 = 0;
    out.m04 = xy; out.m05 = yy; out.m06 = zy; out.m07 = 0;
    out.m08 = xz; out.m09 = yz; out.m10 = zz; out.m11 = 0;
    out.m12 = -(xx * eyex + xy * eyey + xz * eyez);
    out.m13 = -(yx * eyex + yy * eyey + yz * eyez);
    out.m14 = -(zx * eyex + zy * eyey + zz * eyez);
    out.m15 = 1;

    return out;
  }

  static fromTranslation(x: f64, y: f64, z: f64, out: Mat4 | null = null): Mat4 {
    if (out === null) out = new Mat4();
    out.m00 = 1; out.m01 = 0; out.m02 = 0; out.m03 = 0;
    out.m04 = 0; out.m05 = 1; out.m06 = 0; out.m07 = 0;
    out.m08 = 0; out.m09 = 0; out.m10 = 1; out.m11 = 0;
    out.m12 = x; out.m13 = y; out.m14 = z; out.m15 = 1;
    return out;
  }

  static fromScaling(x: f64, y: f64, z: f64, out: Mat4 | null = null): Mat4 {
    if (out === null) out = new Mat4();
    out.m00 = x; out.m01 = 0; out.m02 = 0; out.m03 = 0;
    out.m04 = 0; out.m05 = y; out.m06 = 0; out.m07 = 0;
    out.m08 = 0; out.m09 = 0; out.m10 = z; out.m11 = 0;
    out.m12 = 0; out.m13 = 0; out.m14 = 0; out.m15 = 1;
    return out;
  }

  static fromRotationX(radians: f64, out: Mat4 | null = null): Mat4 {
    if (out === null) out = new Mat4();
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    out.m00 = 1; out.m01 = 0; out.m02 = 0; out.m03 = 0;
    out.m04 = 0; out.m05 = c; out.m06 = s; out.m07 = 0;
    out.m08 = 0; out.m09 = -s; out.m10 = c; out.m11 = 0;
    out.m12 = 0; out.m13 = 0; out.m14 = 0; out.m15 = 1;
    return out;
  }

  static fromRotationY(radians: f64, out: Mat4 | null = null): Mat4 {
    if (out === null) out = new Mat4();
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    out.m00 = c; out.m01 = 0; out.m02 = -s; out.m03 = 0;
    out.m04 = 0; out.m05 = 1; out.m06 = 0; out.m07 = 0;
    out.m08 = s; out.m09 = 0; out.m10 = c; out.m11 = 0;
    out.m12 = 0; out.m13 = 0; out.m14 = 0; out.m15 = 1;
    return out;
  }

  static fromRotationZ(radians: f64, out: Mat4 | null = null): Mat4 {
    if (out === null) out = new Mat4();
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    out.m00 = c; out.m01 = s; out.m02 = 0; out.m03 = 0;
    out.m04 = -s; out.m05 = c; out.m06 = 0; out.m07 = 0;
    out.m08 = 0; out.m09 = 0; out.m10 = 1; out.m11 = 0;
    out.m12 = 0; out.m13 = 0; out.m14 = 0; out.m15 = 1;
    return out;
  }
  
  /**
   * Write matrix to Float32Array (for GPU upload)
   * @param out - Target array (must have at least 16 elements)
   * @param offset - Starting index in output array (default: 0)
   */
  toFloat32Array(out: Float32Array, offset: i32 = 0): Float32Array {
    out[offset + 0] = <f32>this.m00;
    out[offset + 1] = <f32>this.m01;
    out[offset + 2] = <f32>this.m02;
    out[offset + 3] = <f32>this.m03;
    out[offset + 4] = <f32>this.m04;
    out[offset + 5] = <f32>this.m05;
    out[offset + 6] = <f32>this.m06;
    out[offset + 7] = <f32>this.m07;
    out[offset + 8] = <f32>this.m08;
    out[offset + 9] = <f32>this.m09;
    out[offset + 10] = <f32>this.m10;
    out[offset + 11] = <f32>this.m11;
    out[offset + 12] = <f32>this.m12;
    out[offset + 13] = <f32>this.m13;
    out[offset + 14] = <f32>this.m14;
    out[offset + 15] = <f32>this.m15;
    return out;
  }
  
  /**
   * Read matrix from Float32Array
   * @param arr - Source array (must have at least 16 elements)
   * @param offset - Starting index in source array (default: 0)
   */
  fromFloat32Array(arr: Float32Array, offset: i32 = 0): this {
    this.m00 = arr[offset + 0];
    this.m01 = arr[offset + 1];
    this.m02 = arr[offset + 2];
    this.m03 = arr[offset + 3];
    this.m04 = arr[offset + 4];
    this.m05 = arr[offset + 5];
    this.m06 = arr[offset + 6];
    this.m07 = arr[offset + 7];
    this.m08 = arr[offset + 8];
    this.m09 = arr[offset + 9];
    this.m10 = arr[offset + 10];
    this.m11 = arr[offset + 11];
    this.m12 = arr[offset + 12];
    this.m13 = arr[offset + 13];
    this.m14 = arr[offset + 14];
    this.m15 = arr[offset + 15];
    return this;
  }
}
