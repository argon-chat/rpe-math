import { EPSILON } from './constants';
import { Vec3 } from './Vec3';
import { Quat } from './Quat';
import { Mat4 } from './Mat4';

export class Transform {
  position: Vec3;
  rotation: Quat;
  scale: Vec3;

  private _matrix: Mat4 | null;
  private _dirty: bool;

  constructor() {
    this.position = new Vec3(0, 0, 0);
    this.rotation = new Quat(0, 0, 0, 1);
    this.scale = new Vec3(1, 1, 1);
    this._matrix = null;
    this._dirty = true;
  }

  static identity(): Transform {
    return new Transform();
  }

  static fromPosition(x: f64, y: f64, z: f64): Transform {
    const t = new Transform();
    t.position.set(x, y, z);
    return t;
  }

  static fromPositionVec(pos: Vec3): Transform {
    const t = new Transform();
    t.position.copy(pos);
    return t;
  }

  @inline
  markDirty(): void {
    this._dirty = true;
  }

  setIdentity(): this {
    this.position.set(0, 0, 0);
    this.rotation.set(0, 0, 0, 1);
    this.scale.set(1, 1, 1);
    this._dirty = true;
    return this;
  }

  copy(src: Transform): this {
    this.position.copy(src.position);
    this.rotation.copy(src.rotation);
    this.scale.copy(src.scale);
    this._dirty = true;
    return this;
  }

  clone(): Transform {
    return new Transform().copy(this);
  }

  setPosition(x: f64, y: f64, z: f64): this {
    this.position.set(x, y, z);
    this._dirty = true;
    return this;
  }

  setPositionVec(v: Vec3): this {
    this.position.copy(v);
    this._dirty = true;
    return this;
  }

  translate(x: f64, y: f64, z: f64): this {
    this.position.x += x;
    this.position.y += y;
    this.position.z += z;
    this._dirty = true;
    return this;
  }

  translateVec(v: Vec3): this {
    this.position.add(v);
    this._dirty = true;
    return this;
  }

  setRotation(x: f64, y: f64, z: f64, w: f64): this {
    this.rotation.set(x, y, z, w);
    this._dirty = true;
    return this;
  }

  setRotationQuat(q: Quat): this {
    this.rotation.copy(q);
    this._dirty = true;
    return this;
  }

  setEuler(x: f64, y: f64, z: f64): this {
    this.rotation.setFromEuler(x, y, z);
    this._dirty = true;
    return this;
  }

  rotateX(radians: f64): this {
    this.rotation.rotateX(radians);
    this._dirty = true;
    return this;
  }

  rotateY(radians: f64): this {
    this.rotation.rotateY(radians);
    this._dirty = true;
    return this;
  }

  rotateZ(radians: f64): this {
    this.rotation.rotateZ(radians);
    this._dirty = true;
    return this;
  }

  rotateAxisAngle(axis: Vec3, radians: f64): this {
    this.rotation.setFromAxisAngle(axis, radians).multiply(this.rotation);
    this._dirty = true;
    return this;
  }

  setScale(x: f64, y: f64, z: f64): this {
    this.scale.set(x, y, z);
    this._dirty = true;
    return this;
  }

  setScaleVec(v: Vec3): this {
    this.scale.copy(v);
    this._dirty = true;
    return this;
  }

  setScaleScalar(s: f64): this {
    this.scale.set(s, s, s);
    this._dirty = true;
    return this;
  }

  scaleBy(x: f64, y: f64, z: f64): this {
    this.scale.x *= x;
    this.scale.y *= y;
    this.scale.z *= z;
    this._dirty = true;
    return this;
  }

  scaleByScalar(s: f64): this {
    this.scale.mulScalar(s);
    this._dirty = true;
    return this;
  }

  compose(other: Transform): this {
    this.scale.x *= other.scale.x;
    this.scale.y *= other.scale.y;
    this.scale.z *= other.scale.z;

    this.rotation.multiply(other.rotation);

    const rotatedPos = this.rotation.transformVec3(other.position, null);
    this.position.x += rotatedPos.x * this.scale.x;
    this.position.y += rotatedPos.y * this.scale.y;
    this.position.z += rotatedPos.z * this.scale.z;

    this._dirty = true;
    return this;
  }

  invert(): this {
    this.scale.x = 1.0 / this.scale.x;
    this.scale.y = 1.0 / this.scale.y;
    this.scale.z = 1.0 / this.scale.z;

    this.rotation.invert();

    this.position.mulScalar(-1);
    
    this.position.x *= this.scale.x;
    this.position.y *= this.scale.y;
    this.position.z *= this.scale.z;
    
    this.rotation.transformVec3(this.position, this.position);

    this._dirty = true;
    return this;
  }

  lerp(other: Transform, t: f64): this {
    this.position.lerp(other.position, t);
    this.rotation.slerp(other.rotation, t);
    this.scale.lerp(other.scale, t);
    this._dirty = true;
    return this;
  }

  getMatrix(): Mat4 {
    if (this._dirty || this._matrix === null) {
      if (this._matrix === null) {
        this._matrix = new Mat4();
      }
      this.computeMatrix(this._matrix);
      this._dirty = false;
    }
    return this._matrix!;
  }

  computeMatrix(out: Mat4): Mat4 {
    // M = T * R * S
    const px = this.position.x, py = this.position.y, pz = this.position.z;
    const sx = this.scale.x, sy = this.scale.y, sz = this.scale.z;

    const x = this.rotation.x, y = this.rotation.y, z = this.rotation.z, w = this.rotation.w;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    out.m00 = (1 - (yy + zz)) * sx;
    out.m01 = (xy + wz) * sx;
    out.m02 = (xz - wy) * sx;
    out.m03 = 0;

    out.m04 = (xy - wz) * sy;
    out.m05 = (1 - (xx + zz)) * sy;
    out.m06 = (yz + wx) * sy;
    out.m07 = 0;

    out.m08 = (xz + wy) * sz;
    out.m09 = (yz - wx) * sz;
    out.m10 = (1 - (xx + yy)) * sz;
    out.m11 = 0;

    out.m12 = px;
    out.m13 = py;
    out.m14 = pz;
    out.m15 = 1;

    return out;
  }

  transformPoint(v: Vec3, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    
    // Scale
    const sx = v.x * this.scale.x;
    const sy = v.y * this.scale.y;
    const sz = v.z * this.scale.z;

    // Rotate
    const qx = this.rotation.x, qy = this.rotation.y, qz = this.rotation.z, qw = this.rotation.w;
    const ix = qw * sx + qy * sz - qz * sy;
    const iy = qw * sy + qz * sx - qx * sz;
    const iz = qw * sz + qx * sy - qy * sx;
    const iw = -qx * sx - qy * sy - qz * sz;

    out.x = ix * qw + iw * -qx + iy * -qz - iz * -qy + this.position.x;
    out.y = iy * qw + iw * -qy + iz * -qx - ix * -qz + this.position.y;
    out.z = iz * qw + iw * -qz + ix * -qy - iy * -qx + this.position.z;

    return out;
  }

  transformDirection(v: Vec3, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    return this.rotation.transformVec3(v, out);
  }

  getForward(out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.set(0, 0, 1);
    return this.rotation.transformVec3(out, out);
  }

  getRight(out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.set(1, 0, 0);
    return this.rotation.transformVec3(out, out);
  }

  getUp(out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.set(0, 1, 0);
    return this.rotation.transformVec3(out, out);
  }

  equals(other: Transform, epsilon: f64 = EPSILON): bool {
    return this.position.equals(other.position, epsilon) &&
           this.rotation.equals(other.rotation, epsilon) &&
           this.scale.equals(other.scale, epsilon);
  }

  static lerp(a: Transform, b: Transform, t: f64, out: Transform | null = null): Transform {
    if (out === null) out = new Transform();
    Vec3.lerp(a.position, b.position, t, out.position);
    Quat.slerp(a.rotation, b.rotation, t, out.rotation);
    Vec3.lerp(a.scale, b.scale, t, out.scale);
    out._dirty = true;
    return out;
  }

  static compose(a: Transform, b: Transform, out: Transform | null = null): Transform {
    if (out === null) out = new Transform();
    out.copy(a).compose(b);
    return out;
  }

  static invert(t: Transform, out: Transform | null = null): Transform {
    if (out === null) out = new Transform();
    out.copy(t).invert();
    return out;
  }
}
