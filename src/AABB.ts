import { EPSILON, approxEqual } from './constants';
import { Vec3 } from './Vec3';

export class AABB {
  min: Vec3;
  max: Vec3;

  constructor() {
    // Initialize to "empty" state (inverted)
    this.min = new Vec3(Infinity, Infinity, Infinity);
    this.max = new Vec3(-Infinity, -Infinity, -Infinity);
  }

  static empty(): AABB {
    return new AABB();
  }

  static fromMinMax(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): AABB {
    const aabb = new AABB();
    aabb.min.set(minX, minY, minZ);
    aabb.max.set(maxX, maxY, maxZ);
    return aabb;
  }

  static fromMinMaxVec(min: Vec3, max: Vec3): AABB {
    const aabb = new AABB();
    aabb.min.copy(min);
    aabb.max.copy(max);
    return aabb;
  }

  static fromCenterExtents(cx: number, cy: number, cz: number, ex: number, ey: number, ez: number): AABB {
    const aabb = new AABB();
    aabb.min.set(cx - ex, cy - ey, cz - ez);
    aabb.max.set(cx + ex, cy + ey, cz + ez);
    return aabb;
  }

  static fromCenterExtentsVec(center: Vec3, extents: Vec3): AABB {
    return AABB.fromCenterExtents(
      center.x, center.y, center.z,
      extents.x, extents.y, extents.z
    );
  }

  setEmpty(): this {
    this.min.set(Infinity, Infinity, Infinity);
    this.max.set(-Infinity, -Infinity, -Infinity);
    return this;
  }

  set(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): this {
    this.min.set(minX, minY, minZ);
    this.max.set(maxX, maxY, maxZ);
    return this;
  }

  copy(src: AABB): this {
    this.min.copy(src.min);
    this.max.copy(src.max);
    return this;
  }

  clone(): AABB {
    return new AABB().copy(this);
  }

  expandByPoint(x: number, y: number, z: number): this {
    if (x < this.min.x) this.min.x = x;
    if (y < this.min.y) this.min.y = y;
    if (z < this.min.z) this.min.z = z;
    if (x > this.max.x) this.max.x = x;
    if (y > this.max.y) this.max.y = y;
    if (z > this.max.z) this.max.z = z;
    return this;
  }

  expandByPointVec(p: Vec3): this {
    return this.expandByPoint(p.x, p.y, p.z);
  }

  union(other: AABB): this {
    if (other.min.x < this.min.x) this.min.x = other.min.x;
    if (other.min.y < this.min.y) this.min.y = other.min.y;
    if (other.min.z < this.min.z) this.min.z = other.min.z;
    if (other.max.x > this.max.x) this.max.x = other.max.x;
    if (other.max.y > this.max.y) this.max.y = other.max.y;
    if (other.max.z > this.max.z) this.max.z = other.max.z;
    return this;
  }

  intersect(other: AABB): this {
    if (other.min.x > this.min.x) this.min.x = other.min.x;
    if (other.min.y > this.min.y) this.min.y = other.min.y;
    if (other.min.z > this.min.z) this.min.z = other.min.z;
    if (other.max.x < this.max.x) this.max.x = other.max.x;
    if (other.max.y < this.max.y) this.max.y = other.max.y;
    if (other.max.z < this.max.z) this.max.z = other.max.z;
    return this;
  }
yScalar(s: number): this {
    this.min.x -= s;
    this.min.y -= s;
    this.min.z -= s;
    this.max.x += s;
    this.max.y += s;
    this.max.z += s;
    return this;
  }

  translate(x: number, y: number, z: number): this {
    this.min.x += x;
    this.min.y += y;
    this.min.z += z;
    this.max.x += x;
    this.max.y += y;
    this.max.z += z;
    return this;
  }

  translateVec(v: Vec3): this {
    return this.translate(v.x, v.y, v.z);
  }

  setFromCenterExtents(cx: number, cy: number, cz: number, ex: number, ey: number, ez: number): this {
    this.min.set(cx - ex, cy - ey, cz - ez);
    this.max.set(cx + ex, cy + ey, cz + ez);
    return this;
  }

  isEmpty(): boolean {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }

  getCenter(out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = (this.min.x + this.max.x) * 0.5;
    out.y = (this.min.y + this.max.y) * 0.5;
    out.z = (this.min.z + this.max.z) * 0.5;
    return out;
  }

  getSize(out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = this.max.x - this.min.x;
    out.y = this.max.y - this.min.y;
    out.z = this.max.z - this.min.z;
    return out;
  }

  getExtents(out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = (this.max.x - this.min.x) * 0.5;
    out.y = (this.max.y - this.min.y) * 0.5;
    out.z = (this.max.z - this.min.z) * 0.5;
    return out;
  }

  getVolume(): number {
    const sx = this.max.x - this.min.x;
    const sy = this.max.y - this.min.y;
    const sz = this.max.z - this.min.z;
    return sx * sy * sz;
  }

  getSurfaceArea(): number {
    const sx = this.max.x - this.min.x;
    const sy = this.max.y - this.min.y;
    const sz = this.max.z - this.min.z;
    return 2.0 * (sx * sy + sy * sz + sz * sx);
  }

  containsPoint(x: number, y: number, z: number): boolean {
    return x >= this.min.x && x <= this.max.x &&
           y >= this.min.y && y <= this.max.y &&
           z >= this.min.z && z <= this.max.z;
  }

  containsPointVec(p: Vec3): boolean {
    return this.containsPoint(p.x, p.y, p.z);
  }

  containsAABB(other: AABB): boolean {
    return other.min.x >= this.min.x && other.max.x <= this.max.x &&
           other.min.y >= this.min.y && other.max.y <= this.max.y &&
           other.min.z >= this.min.z && other.max.z <= this.max.z;
  }

  intersectsAABB(other: AABB): boolean {
    return this.max.x >= other.min.x && this.min.x <= other.max.x &&
           this.max.y >= other.min.y && this.min.y <= other.max.y &&
           this.max.z >= other.min.z && this.min.z <= other.max.z;
  }

  distanceToPoint(x: number, y: number, z: number): number {
    let dx: number = 0;
    let dy: number = 0;
    let dz: number = 0;

    if (x < this.min.x) dx = this.min.x - x;
    else if (x > this.max.x) dx = x - this.max.x;

    if (y < this.min.y) dy = this.min.y - y;
    else if (y > this.max.y) dy = y - this.max.y;

    if (z < this.min.z) dz = this.min.z - z;
    else if (z > this.max.z) dz = z - this.max.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  distanceToPointVec(p: Vec3): number {
    return this.distanceToPoint(p.x, p.y, p.z);
  }

  distanceToPointSq(x: number, y: number, z: number): number {
    let dx: number = 0;
    let dy: number = 0;
    let dz: number = 0;

    if (x < this.min.x) dx = this.min.x - x;
    else if (x > this.max.x) dx = x - this.max.x;

    if (y < this.min.y) dy = this.min.y - y;
    else if (y > this.max.y) dy = y - this.max.y;

    if (z < this.min.z) dz = this.min.z - z;
    else if (z > this.max.z) dz = z - this.max.z;

    return dx * dx + dy * dy + dz * dz;
  }

  clampPoint(x: number, y: number, z: number, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = x < this.min.x ? this.min.x : (x > this.max.x ? this.max.x : x);
    out.y = y < this.min.y ? this.min.y : (y > this.max.y ? this.max.y : y);
    out.z = z < this.min.z ? this.min.z : (z > this.max.z ? this.max.z : z);
    return out;
  }

  clampPointVec(p: Vec3, out: Vec3 | null = null): Vec3 {
    return this.clampPoint(p.x, p.y, p.z, out);
  }

  equals(other: AABB, epsilon: number = EPSILON): boolean {
    return this.min.equals(other.min, epsilon) && this.max.equals(other.max, epsilon);
  }

  static union(a: AABB, b: AABB, out: AABB | null = null): AABB {
    if (out === null) out = new AABB();
    out.min.x = a.min.x < b.min.x ? a.min.x : b.min.x;
    out.min.y = a.min.y < b.min.y ? a.min.y : b.min.y;
    out.min.z = a.min.z < b.min.z ? a.min.z : b.min.z;
    out.max.x = a.max.x > b.max.x ? a.max.x : b.max.x;
    out.max.y = a.max.y > b.max.y ? a.max.y : b.max.y;
    out.max.z = a.max.z > b.max.z ? a.max.z : b.max.z;
    return out;
  }

  static intersection(a: AABB, b: AABB, out: AABB | null = null): AABB {
    if (out === null) out = new AABB();
    out.min.x = a.min.x > b.min.x ? a.min.x : b.min.x;
    out.min.y = a.min.y > b.min.y ? a.min.y : b.min.y;
    out.min.z = a.min.z > b.min.z ? a.min.z : b.min.z;
    out.max.x = a.max.x < b.max.x ? a.max.x : b.max.x;
    out.max.y = a.max.y < b.max.y ? a.max.y : b.max.y;
    out.max.z = a.max.z < b.max.z ? a.max.z : b.max.z;
    return out;
  }
}
