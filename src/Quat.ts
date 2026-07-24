import { EPSILON, approxEqual } from './constants';
import { Vec3 } from './Vec3';
import { Mat4 } from './Mat4';

export class Quat {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  static identity(): Quat { return new Quat(0, 0, 0, 1); }

  static fromAxisAngle(axis: Vec3, radians: number): Quat {
    const halfAngle: number = radians * 0.5;
    const s: number = Math.sin(halfAngle);
    return new Quat(
      axis.x * s,
      axis.y * s,
      axis.z * s,
      Math.cos(halfAngle)
    );
  }

  static fromEuler(x: number, y: number, z: number): Quat {
    const hx: number = x * 0.5;
    const hy: number = y * 0.5;
    const hz: number = z * 0.5;

    const cx: number = Math.cos(hx);
    const sx: number = Math.sin(hx);
    const cy: number = Math.cos(hy);
    const sy: number = Math.sin(hy);
    const cz: number = Math.cos(hz);
    const sz: number = Math.sin(hz);

    return new Quat(
      sx * cy * cz - cx * sy * sz,
      cx * sy * cz + sx * cy * sz,
      cx * cy * sz - sx * sy * cz,
      cx * cy * cz + sx * sy * sz
    );
  }

  static fromRotationMatrix(m: Mat4): Quat {
    const q = new Quat();
    const trace: number = m.m00 + m.m05 + m.m10;

    if (trace > 0) {
      const s: number = 0.5 / Math.sqrt(trace + 1.0);
      q.w = 0.25 / s;
      q.x = (m.m06 - m.m09) * s;
      q.y = (m.m08 - m.m02) * s;
      q.z = (m.m01 - m.m04) * s;
    } else if (m.m00 > m.m05 && m.m00 > m.m10) {
      const s: number = 2.0 * Math.sqrt(1.0 + m.m00 - m.m05 - m.m10);
      q.w = (m.m06 - m.m09) / s;
      q.x = 0.25 * s;
      q.y = (m.m04 + m.m01) / s;
      q.z = (m.m08 + m.m02) / s;
    } else if (m.m05 > m.m10) {
      const s: number = 2.0 * Math.sqrt(1.0 + m.m05 - m.m00 - m.m10);
      q.w = (m.m08 - m.m02) / s;
      q.x = (m.m04 + m.m01) / s;
      q.y = 0.25 * s;
      q.z = (m.m09 + m.m06) / s;
    } else {
      const s: number = 2.0 * Math.sqrt(1.0 + m.m10 - m.m00 - m.m05);
      q.w = (m.m01 - m.m04) / s;
      q.x = (m.m08 + m.m02) / s;
      q.y = (m.m09 + m.m06) / s;
      q.z = 0.25 * s;
    }

    return q;
  }

  set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  copy(q: Quat): this {
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    this.w = q.w;
    return this;
  }

  clone(): Quat {
    return new Quat(this.x, this.y, this.z, this.w);
  }

  setIdentity(): this {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 1;
    return this;
  }

  multiply(q: Quat): this {
    const ax = this.x, ay = this.y, az = this.z, aw = this.w;
    const bx = q.x, by = q.y, bz = q.z, bw = q.w;

    this.x = ax * bw + aw * bx + ay * bz - az * by;
    this.y = ay * bw + aw * by + az * bx - ax * bz;
    this.z = az * bw + aw * bz + ax * by - ay * bx;
    this.w = aw * bw - ax * bx - ay * by - az * bz;

    return this;
  }

  premultiply(q: Quat): this {
    const ax = q.x, ay = q.y, az = q.z, aw = q.w;
    const bx = this.x, by = this.y, bz = this.z, bw = this.w;

    this.x = ax * bw + aw * bx + ay * bz - az * by;
    this.y = ay * bw + aw * by + az * bx - ax * bz;
    this.z = az * bw + aw * bz + ax * by - ay * bx;
    this.w = aw * bw - ax * bx - ay * by - az * bz;

    return this;
  }

  normalize(): this {
    const len: number = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    if (len > EPSILON) {
      const invLen: number = 1.0 / len;
      this.x *= invLen;
      this.y *= invLen;
      this.z *= invLen;
      this.w *= invLen;
    }
    return this;
  }

  conjugate(): this {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  invert(): this {
    const len2: number = this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    if (len2 < EPSILON) return this;
    const invLen2: number = 1.0 / len2;
    this.x = -this.x * invLen2;
    this.y = -this.y * invLen2;
    this.z = -this.z * invLen2;
    this.w = this.w * invLen2;
    return this;
  }

  rotateX(radians: number): this {
    const halfAngle: number = radians * 0.5;
    const bx: number = Math.sin(halfAngle);
    const bw: number = Math.cos(halfAngle);

    const ax = this.x, ay = this.y, az = this.z, aw = this.w;

    this.x = ax * bw + aw * bx;
    this.y = ay * bw + az * bx;
    this.z = az * bw - ay * bx;
    this.w = aw * bw - ax * bx;

    return this;
  }

  rotateY(radians: number): this {
    const halfAngle: number = radians * 0.5;
    const by: number = Math.sin(halfAngle);
    const bw: number = Math.cos(halfAngle);

    const ax = this.x, ay = this.y, az = this.z, aw = this.w;

    this.x = ax * bw - az * by;
    this.y = ay * bw + aw * by;
    this.z = az * bw + ax * by;
    this.w = aw * bw - ay * by;

    return this;
  }

  rotateZ(radians: number): this {
    const halfAngle: number = radians * 0.5;
    const bz: number = Math.sin(halfAngle);
    const bw: number = Math.cos(halfAngle);

    const ax = this.x, ay = this.y, az = this.z, aw = this.w;

    this.x = ax * bw + ay * bz;
    this.y = ay * bw - ax * bz;
    this.z = az * bw + aw * bz;
    this.w = aw * bw - az * bz;

    return this;
  }

  setFromAxisAngle(axis: Vec3, radians: number): this {
    const halfAngle: number = radians * 0.5;
    const s: number = Math.sin(halfAngle);
    this.x = axis.x * s;
    this.y = axis.y * s;
    this.z = axis.z * s;
    this.w = Math.cos(halfAngle);
    return this;
  }

  setFromEuler(x: number, y: number, z: number): this {
    const hx: number = x * 0.5;
    const hy: number = y * 0.5;
    const hz: number = z * 0.5;

    const cx: number = Math.cos(hx);
    const sx: number = Math.sin(hx);
    const cy: number = Math.cos(hy);
    const sy: number = Math.sin(hy);
    const cz: number = Math.cos(hz);
    const sz: number = Math.sin(hz);

    this.x = sx * cy * cz - cx * sy * sz;
    this.y = cx * sy * cz + sx * cy * sz;
    this.z = cx * cy * sz - sx * sy * cz;
    this.w = cx * cy * cz + sx * sy * sz;

    return this;
  }

  slerp(q: Quat, t: number): this {
    if (t <= 0) return this;
    if (t >= 1) return this.copy(q);

    let ax = this.x, ay = this.y, az = this.z, aw = this.w;
    let bx = q.x, by = q.y, bz = q.z, bw = q.w;

    let cosHalfTheta: number = ax * bx + ay * by + az * bz + aw * bw;

    if (cosHalfTheta < 0) {
      bx = -bx; by = -by; bz = -bz; bw = -bw;
      cosHalfTheta = -cosHalfTheta;
    }

    if (cosHalfTheta >= 1.0) {
      return this;
    }

    const sqrSinHalfTheta: number = 1.0 - cosHalfTheta * cosHalfTheta;

    if (sqrSinHalfTheta < 0.001) {
      // Linear interpolation for small angles
      this.x = ax + t * (bx - ax);
      this.y = ay + t * (by - ay);
      this.z = az + t * (bz - az);
      this.w = aw + t * (bw - aw);
      return this.normalize();
    }

    const sinHalfTheta: number = Math.sqrt(sqrSinHalfTheta);
    const halfTheta: number = Math.atan2(sinHalfTheta, cosHalfTheta);
    const ratioA: number = Math.sin((1.0 - t) * halfTheta) / sinHalfTheta;
    const ratioB: number = Math.sin(t * halfTheta) / sinHalfTheta;

    this.x = ax * ratioA + bx * ratioB;
    this.y = ay * ratioA + by * ratioB;
    this.z = az * ratioA + bz * ratioB;
    this.w = aw * ratioA + bw * ratioB;

    return this;
  }

  dot(q: Quat): number {
    return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
  }

  lengthSq(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  getAxisAngle(outAxis: Vec3 | null = null): number {
    if (outAxis === null) outAxis = new Vec3();

    const rad: number = Math.acos(this.w) * 2.0;
    const s: number = Math.sin(rad / 2.0);

    if (s > EPSILON) {
      outAxis.x = this.x / s;
      outAxis.y = this.y / s;
      outAxis.z = this.z / s;
    } else {
      outAxis.x = 1;
      outAxis.y = 0;
      outAxis.z = 0;
    }

    return rad;
  }

  toEuler(out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();

    const x = this.x, y = this.y, z = this.z, w = this.w;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    // Assuming XYZ rotation order
    const m11: number = 1.0 - (yy + zz);
    const m12: number = xy - wz;
    const m13: number = xz + wy;
    const m22: number = 1.0 - (xx + zz);
    const m23: number = yz - wx;
    const m33: number = 1.0 - (xx + yy);

    out.y = Math.asin(m13 < -1 ? -1 : (m13 > 1 ? 1 : m13));

    if (m13 < 0.999999 && m13 > -0.999999) {
      out.x = Math.atan2(-m23, m33);
      out.z = Math.atan2(-m12, m11);
    } else {
      out.x = Math.atan2(m23, m22);
      out.z = 0;
    }

    return out;
  }

  toMat4(out: Mat4 | null = null): Mat4 {
    if (out === null) out = new Mat4();

    const x = this.x, y = this.y, z = this.z, w = this.w;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    out.m00 = 1 - (yy + zz);
    out.m01 = xy + wz;
    out.m02 = xz - wy;
    out.m03 = 0;

    out.m04 = xy - wz;
    out.m05 = 1 - (xx + zz);
    out.m06 = yz + wx;
    out.m07 = 0;

    out.m08 = xz + wy;
    out.m09 = yz - wx;
    out.m10 = 1 - (xx + yy);
    out.m11 = 0;

    out.m12 = 0;
    out.m13 = 0;
    out.m14 = 0;
    out.m15 = 1;

    return out;
  }

  equals(q: Quat, epsilon: number = EPSILON): boolean {
    return approxEqual(this.x, q.x, epsilon) &&
           approxEqual(this.y, q.y, epsilon) &&
           approxEqual(this.z, q.z, epsilon) &&
           approxEqual(this.w, q.w, epsilon);
  }

  exactEquals(q: Quat): boolean {
    return this.x == q.x && this.y == q.y && this.z == q.z && this.w == q.w;
  }

  transformVec3(v: Vec3, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();

    const x = v.x, y = v.y, z = v.z;
    const qx = this.x, qy = this.y, qz = this.z, qw = this.w;

    // Calculate quat * vec
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;

    // Calculate result * inverse quat
    out.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

    return out;
  }

  static multiply(a: Quat, b: Quat, out: Quat | null = null): Quat {
    if (out === null) out = new Quat();

    const ax = a.x, ay = a.y, az = a.z, aw = a.w;
    const bx = b.x, by = b.y, bz = b.z, bw = b.w;

    out.x = ax * bw + aw * bx + ay * bz - az * by;
    out.y = ay * bw + aw * by + az * bx - ax * bz;
    out.z = az * bw + aw * bz + ax * by - ay * bx;
    out.w = aw * bw - ax * bx - ay * by - az * bz;

    return out;
  }

  static slerp(a: Quat, b: Quat, t: number, out: Quat | null = null): Quat {
    if (out === null) out = new Quat();
    out.copy(a).slerp(b, t);
    return out;
  }

  static dot(a: Quat, b: Quat): number {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  }

  static conjugate(q: Quat, out: Quat | null = null): Quat {
    if (out === null) out = new Quat();
    out.x = -q.x;
    out.y = -q.y;
    out.z = -q.z;
    out.w = q.w;
    return out;
  }

  static invert(q: Quat, out: Quat | null = null): Quat {
    if (out === null) out = new Quat();
    const len2: number = q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w;
    if (len2 < EPSILON) {
      out.x = 0;
      out.y = 0;
      out.z = 0;
      out.w = 1;
      return out;
    }
    const invLen2: number = 1.0 / len2;
    out.x = -q.x * invLen2;
    out.y = -q.y * invLen2;
    out.z = -q.z * invLen2;
    out.w = q.w * invLen2;
    return out;
  }

  static normalize(q: Quat, out: Quat | null = null): Quat {
    if (out === null) out = new Quat();
    const len: number = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
    if (len > EPSILON) {
      const invLen: number = 1.0 / len;
      out.x = q.x * invLen;
      out.y = q.y * invLen;
      out.z = q.z * invLen;
      out.w = q.w * invLen;
    } else {
      out.x = 0;
      out.y = 0;
      out.z = 0;
      out.w = 1;
    }
    return out;
  }
}
