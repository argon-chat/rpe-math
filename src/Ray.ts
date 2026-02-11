import { EPSILON, approxEqual } from './constants';
import { Vec3 } from './Vec3';
import { AABB } from './AABB';

export class Ray {
  origin: Vec3;
  direction: Vec3;

  constructor() {
    this.origin = new Vec3(0, 0, 0);
    this.direction = new Vec3(0, 0, 1);
  }

  static create(ox: f64, oy: f64, oz: f64, dx: f64, dy: f64, dz: f64): Ray {
    const ray = new Ray();
    ray.origin.set(ox, oy, oz);
    ray.direction.set(dx, dy, dz).normalize();
    return ray;
  }

  static fromVecs(origin: Vec3, direction: Vec3): Ray {
    const ray = new Ray();
    ray.origin.copy(origin);
    ray.direction.copy(direction).normalize();
    return ray;
  }

  static fromPoints(from: Vec3, to: Vec3): Ray {
    const ray = new Ray();
    ray.origin.copy(from);
    ray.direction.x = to.x - from.x;
    ray.direction.y = to.y - from.y;
    ray.direction.z = to.z - from.z;
    ray.direction.normalize();
    return ray;
  }

  set(ox: f64, oy: f64, oz: f64, dx: f64, dy: f64, dz: f64): this {
    this.origin.set(ox, oy, oz);
    this.direction.set(dx, dy, dz).normalize();
    return this;
  }

  copy(src: Ray): this {
    this.origin.copy(src.origin);
    this.direction.copy(src.direction);
    return this;
  }

  clone(): Ray {
    return new Ray().copy(this);
  }

  setOrigin(x: f64, y: f64, z: f64): this {
    this.origin.set(x, y, z);
    return this;
  }

  setOriginVec(v: Vec3): this {
    this.origin.copy(v);
    return this;
  }

  setDirection(x: f64, y: f64, z: f64): this {
    this.direction.set(x, y, z).normalize();
    return this;
  }

  setDirectionVec(v: Vec3): this {
    this.direction.copy(v).normalize();
    return this;
  }

  lookAt(x: f64, y: f64, z: f64): this {
    this.direction.x = x - this.origin.x;
    this.direction.y = y - this.origin.y;
    this.direction.z = z - this.origin.z;
    this.direction.normalize();
    return this;
  }

  lookAtVec(target: Vec3): this {
    return this.lookAt(target.x, target.y, target.z);
  }

  getPoint(t: f64, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    out.x = this.origin.x + this.direction.x * t;
    out.y = this.origin.y + this.direction.y * t;
    out.z = this.origin.z + this.direction.z * t;
    return out;
  }

  closestPointToPoint(x: f64, y: f64, z: f64, out: Vec3 | null = null): Vec3 {
    if (out === null) out = new Vec3();
    
    const dx = x - this.origin.x;
    const dy = y - this.origin.y;
    const dz = z - this.origin.z;
    
    let t: f64 = dx * this.direction.x + dy * this.direction.y + dz * this.direction.z;
    if (t < 0) t = 0;
    
    out.x = this.origin.x + this.direction.x * t;
    out.y = this.origin.y + this.direction.y * t;
    out.z = this.origin.z + this.direction.z * t;
    return out;
  }

  closestPointToPointVec(p: Vec3, out: Vec3 | null = null): Vec3 {
    return this.closestPointToPoint(p.x, p.y, p.z, out);
  }

  distanceToPoint(x: f64, y: f64, z: f64): f64 {
    const dx = x - this.origin.x;
    const dy = y - this.origin.y;
    const dz = z - this.origin.z;
    
    let t: f64 = dx * this.direction.x + dy * this.direction.y + dz * this.direction.z;
    if (t < 0) t = 0;
    
    const px = this.origin.x + this.direction.x * t - x;
    const py = this.origin.y + this.direction.y * t - y;
    const pz = this.origin.z + this.direction.z * t - z;
    
    return Math.sqrt(px * px + py * py + pz * pz);
  }

  distanceToPointVec(p: Vec3): f64 {
    return this.distanceToPoint(p.x, p.y, p.z);
  }

  distanceToPointSq(x: f64, y: f64, z: f64): f64 {
    const dx = x - this.origin.x;
    const dy = y - this.origin.y;
    const dz = z - this.origin.z;
    
    let t: f64 = dx * this.direction.x + dy * this.direction.y + dz * this.direction.z;
    if (t < 0) t = 0;
    
    const px = this.origin.x + this.direction.x * t - x;
    const py = this.origin.y + this.direction.y * t - y;
    const pz = this.origin.z + this.direction.z * t - z;
    
    return px * px + py * py + pz * pz;
  }

  intersectAABB(aabb: AABB): f64 {
    const ox = this.origin.x, oy = this.origin.y, oz = this.origin.z;
    const dx = this.direction.x, dy = this.direction.y, dz = this.direction.z;
    
    const invDx: f64 = dx == 0 ? Infinity : 1.0 / dx;
    const invDy: f64 = dy == 0 ? Infinity : 1.0 / dy;
    const invDz: f64 = dz == 0 ? Infinity : 1.0 / dz;

    let t1: f64 = (aabb.min.x - ox) * invDx;
    let t2: f64 = (aabb.max.x - ox) * invDx;
    let t3: f64 = (aabb.min.y - oy) * invDy;
    let t4: f64 = (aabb.max.y - oy) * invDy;
    let t5: f64 = (aabb.min.z - oz) * invDz;
    let t6: f64 = (aabb.max.z - oz) * invDz;

    const tmin1: f64 = t1 < t2 ? t1 : t2;
    const tmax1: f64 = t1 > t2 ? t1 : t2;
    const tmin2: f64 = t3 < t4 ? t3 : t4;
    const tmax2: f64 = t3 > t4 ? t3 : t4;
    const tmin3: f64 = t5 < t6 ? t5 : t6;
    const tmax3: f64 = t5 > t6 ? t5 : t6;

    let tmin: f64 = tmin1;
    if (tmin2 > tmin) tmin = tmin2;
    if (tmin3 > tmin) tmin = tmin3;

    let tmax: f64 = tmax1;
    if (tmax2 < tmax) tmax = tmax2;
    if (tmax3 < tmax) tmax = tmax3;

    if (tmax < 0 || tmin > tmax) {
      return -1;
    }

    return tmin >= 0 ? tmin : tmax;
  }

  intersectsAABB(aabb: AABB): bool {
    return this.intersectAABB(aabb) >= 0;
  }

  intersectSphere(centerX: f64, centerY: f64, centerZ: f64, radius: f64): f64 {
    const ox = this.origin.x - centerX;
    const oy = this.origin.y - centerY;
    const oz = this.origin.z - centerZ;

    const a: f64 = this.direction.x * this.direction.x + 
                   this.direction.y * this.direction.y + 
                   this.direction.z * this.direction.z;
    const b: f64 = 2.0 * (ox * this.direction.x + oy * this.direction.y + oz * this.direction.z);
    const c: f64 = ox * ox + oy * oy + oz * oz - radius * radius;

    const discriminant: f64 = b * b - 4.0 * a * c;

    if (discriminant < 0) {
      return -1;
    }

    const sqrtD: f64 = Math.sqrt(discriminant);
    const t1: f64 = (-b - sqrtD) / (2.0 * a);
    const t2: f64 = (-b + sqrtD) / (2.0 * a);

    if (t1 >= 0) return t1;
    if (t2 >= 0) return t2;
    return -1;
  }

  intersectSphereVec(center: Vec3, radius: f64): f64 {
    return this.intersectSphere(center.x, center.y, center.z, radius);
  }

  intersectPlane(nx: f64, ny: f64, nz: f64, d: f64): f64 {
    const denom: f64 = nx * this.direction.x + ny * this.direction.y + nz * this.direction.z;
    
    if (denom > -EPSILON && denom < EPSILON) {
      return -1; // Parallel
    }

    const t: f64 = -(nx * this.origin.x + ny * this.origin.y + nz * this.origin.z + d) / denom;
    
    return t >= 0 ? t : -1;
  }

  intersectPlaneVec(normal: Vec3, d: f64): f64 {
    return this.intersectPlane(normal.x, normal.y, normal.z, d);
  }

  intersectTriangle(v0: Vec3, v1: Vec3, v2: Vec3): f64 {
    const edge1x = v1.x - v0.x, edge1y = v1.y - v0.y, edge1z = v1.z - v0.z;
    const edge2x = v2.x - v0.x, edge2y = v2.y - v0.y, edge2z = v2.z - v0.z;

    // P = D x edge2
    const px = this.direction.y * edge2z - this.direction.z * edge2y;
    const py = this.direction.z * edge2x - this.direction.x * edge2z;
    const pz = this.direction.x * edge2y - this.direction.y * edge2x;

    const det: f64 = edge1x * px + edge1y * py + edge1z * pz;

    if (det > -EPSILON && det < EPSILON) {
      return -1; // Ray parallel to triangle
    }

    const invDet: f64 = 1.0 / det;

    // T = O - v0
    const tx = this.origin.x - v0.x;
    const ty = this.origin.y - v0.y;
    const tz = this.origin.z - v0.z;

    // u = T . P * invDet
    const u: f64 = (tx * px + ty * py + tz * pz) * invDet;
    if (u < 0 || u > 1) {
      return -1;
    }

    // Q = T x edge1
    const qx = ty * edge1z - tz * edge1y;
    const qy = tz * edge1x - tx * edge1z;
    const qz = tx * edge1y - ty * edge1x;

    // v = D . Q * invDet
    const v: f64 = (this.direction.x * qx + this.direction.y * qy + this.direction.z * qz) * invDet;
    if (v < 0 || u + v > 1) {
      return -1;
    }

    // t = edge2 . Q * invDet
    const t: f64 = (edge2x * qx + edge2y * qy + edge2z * qz) * invDet;

    return t >= 0 ? t : -1;
  }

  equals(other: Ray, epsilon: f64 = EPSILON): bool {
    return this.origin.equals(other.origin, epsilon) && 
           this.direction.equals(other.direction, epsilon);
  }
}
