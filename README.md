# @engine/math

Isomorphic math library for Red Pew Engine.

## Overview

High-performance math library designed to work identically in TypeScript and AssemblyScript environments. 
Provides vectors, matrices, quaternions, and geometric primitives optimized for game development.

## Features

- **Isomorphic**: Same API for TypeScript and AssemblyScript
- **Zero Allocation**: Mutating operations to avoid GC pressure
- **SIMD Ready**: Structure compatible with SIMD optimizations
- **Full Test Coverage**: Comprehensive tests for all operations
- **Inline Optimization**: `@inline` decorators for AS compilation

```typescript
import { Vec2, Vec3, Vec4, Mat4, Quat, Transform, AABB, Ray } from '@engine/math';

// Vectors
const pos = Vec3.create(1, 2, 3);
const dir = Vec3.normalize(Vec3.create(1, 0, 0));
const dot = Vec3.dot(pos, dir);

// Matrix transformations
const model = Mat4.identity();
Mat4.translate(model, model, pos);
Mat4.rotateY(model, model, Math.PI / 4);
Mat4.scale(model, model, Vec3.create(2, 2, 2));

// Quaternions
const rotation = Quat.fromEuler(Quat.create(), 0, 45, 0);
const forward = Vec3.transformQuat(Vec3.create(), Vec3.FORWARD, rotation);

// Transforms (position + rotation + scale)
const transform = Transform.create();
Transform.setPosition(transform, 10, 0, 5);
Transform.setRotationEuler(transform, 0, 90, 0);

// Geometry
const box = AABB.create(Vec3.create(-1, -1, -1), Vec3.create(1, 1, 1));
const ray = Ray.create(Vec3.create(0, 0, -5), Vec3.create(0, 0, 1));
const hit = Ray.intersectsAABB(ray, box);
```

## API Reference

### Vec2

2D vector operations.

```typescript
// Creation
Vec2.create(x?: number, y?: number): Vec2
Vec2.clone(v: Vec2): Vec2
Vec2.fromArray(arr: number[], offset?: number): Vec2

// Constants
Vec2.ZERO   // (0, 0)
Vec2.ONE    // (1, 1)
Vec2.UP     // (0, 1)
Vec2.RIGHT  // (1, 0)

// Operations (mutating - result stored in 'out')
Vec2.add(out: Vec2, a: Vec2, b: Vec2): Vec2
Vec2.sub(out: Vec2, a: Vec2, b: Vec2): Vec2
Vec2.mul(out: Vec2, a: Vec2, b: Vec2): Vec2
Vec2.scale(out: Vec2, a: Vec2, s: number): Vec2
Vec2.normalize(out: Vec2, a: Vec2): Vec2
Vec2.negate(out: Vec2, a: Vec2): Vec2
Vec2.lerp(out: Vec2, a: Vec2, b: Vec2, t: number): Vec2

// Scalar results
Vec2.dot(a: Vec2, b: Vec2): number
Vec2.cross(a: Vec2, b: Vec2): number
Vec2.length(a: Vec2): number
Vec2.lengthSq(a: Vec2): number
Vec2.distance(a: Vec2, b: Vec2): number
Vec2.distanceSq(a: Vec2, b: Vec2): number
Vec2.angle(a: Vec2, b: Vec2): number

// Comparison
Vec2.equals(a: Vec2, b: Vec2): boolean
Vec2.exactEquals(a: Vec2, b: Vec2): boolean
```

### Vec3

3D vector operations.

```typescript
// Creation
Vec3.create(x?: number, y?: number, z?: number): Vec3
Vec3.clone(v: Vec3): Vec3
Vec3.fromArray(arr: number[], offset?: number): Vec3

// Constants
Vec3.ZERO     // (0, 0, 0)
Vec3.ONE      // (1, 1, 1)
Vec3.UP       // (0, 1, 0)
Vec3.DOWN     // (0, -1, 0)
Vec3.FORWARD  // (0, 0, 1)
Vec3.BACK     // (0, 0, -1)
Vec3.RIGHT    // (1, 0, 0)
Vec3.LEFT     // (-1, 0, 0)

// Operations
Vec3.add(out: Vec3, a: Vec3, b: Vec3): Vec3
Vec3.sub(out: Vec3, a: Vec3, b: Vec3): Vec3
Vec3.mul(out: Vec3, a: Vec3, b: Vec3): Vec3
Vec3.scale(out: Vec3, a: Vec3, s: number): Vec3
Vec3.normalize(out: Vec3, a: Vec3): Vec3
Vec3.cross(out: Vec3, a: Vec3, b: Vec3): Vec3
Vec3.lerp(out: Vec3, a: Vec3, b: Vec3, t: number): Vec3
Vec3.transformMat4(out: Vec3, a: Vec3, m: Mat4): Vec3
Vec3.transformQuat(out: Vec3, a: Vec3, q: Quat): Vec3

// Scalar results
Vec3.dot(a: Vec3, b: Vec3): number
Vec3.length(a: Vec3): number
Vec3.lengthSq(a: Vec3): number
Vec3.distance(a: Vec3, b: Vec3): number
```

### Vec4

4D vector / homogeneous coordinates.

```typescript
Vec4.create(x?: number, y?: number, z?: number, w?: number): Vec4
Vec4.transformMat4(out: Vec4, a: Vec4, m: Mat4): Vec4
// ... similar operations to Vec3
```

### Mat4

4x4 matrix for 3D transformations.

```typescript
// Creation
Mat4.create(): Mat4
Mat4.identity(): Mat4
Mat4.clone(m: Mat4): Mat4

// Transformations (modify 'out')
Mat4.translate(out: Mat4, a: Mat4, v: Vec3): Mat4
Mat4.rotate(out: Mat4, a: Mat4, rad: number, axis: Vec3): Mat4
Mat4.rotateX(out: Mat4, a: Mat4, rad: number): Mat4
Mat4.rotateY(out: Mat4, a: Mat4, rad: number): Mat4
Mat4.rotateZ(out: Mat4, a: Mat4, rad: number): Mat4
Mat4.scale(out: Mat4, a: Mat4, v: Vec3): Mat4

// Matrix operations
Mat4.multiply(out: Mat4, a: Mat4, b: Mat4): Mat4
Mat4.invert(out: Mat4, a: Mat4): Mat4 | null
Mat4.transpose(out: Mat4, a: Mat4): Mat4
Mat4.determinant(a: Mat4): number

// Camera matrices
Mat4.lookAt(out: Mat4, eye: Vec3, center: Vec3, up: Vec3): Mat4
Mat4.perspective(out: Mat4, fov: number, aspect: number, near: number, far: number): Mat4
Mat4.ortho(out: Mat4, left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4

// Decomposition
Mat4.getTranslation(out: Vec3, m: Mat4): Vec3
Mat4.getRotation(out: Quat, m: Mat4): Quat
Mat4.getScaling(out: Vec3, m: Mat4): Vec3

// From components
Mat4.fromRotationTranslation(out: Mat4, q: Quat, v: Vec3): Mat4
Mat4.fromRotationTranslationScale(out: Mat4, q: Quat, v: Vec3, s: Vec3): Mat4
Mat4.fromQuat(out: Mat4, q: Quat): Mat4
```

### Quat

Quaternion for rotations.

```typescript
// Creation
Quat.create(): Quat
Quat.identity(): Quat
Quat.clone(q: Quat): Quat

// From angles
Quat.fromEuler(out: Quat, x: number, y: number, z: number): Quat
Quat.fromAxisAngle(out: Quat, axis: Vec3, rad: number): Quat
Quat.fromMat4(out: Quat, m: Mat4): Quat

// Operations
Quat.multiply(out: Quat, a: Quat, b: Quat): Quat
Quat.invert(out: Quat, a: Quat): Quat
Quat.conjugate(out: Quat, a: Quat): Quat
Quat.normalize(out: Quat, a: Quat): Quat
Quat.slerp(out: Quat, a: Quat, b: Quat, t: number): Quat

// Conversion
Quat.toEuler(out: Vec3, q: Quat): Vec3
Quat.toAxisAngle(outAxis: Vec3, q: Quat): number

// Rotation helpers
Quat.rotateX(out: Quat, a: Quat, rad: number): Quat
Quat.rotateY(out: Quat, a: Quat, rad: number): Quat
Quat.rotateZ(out: Quat, a: Quat, rad: number): Quat
```

### Transform

Combined position, rotation, scale.

```typescript
// Creation
Transform.create(): Transform
Transform.clone(t: Transform): Transform

// Setters
Transform.setPosition(t: Transform, x: number, y: number, z: number): void
Transform.setRotation(t: Transform, q: Quat): void
Transform.setRotationEuler(t: Transform, x: number, y: number, z: number): void
Transform.setScale(t: Transform, x: number, y: number, z: number): void

// Getters
Transform.getPosition(out: Vec3, t: Transform): Vec3
Transform.getRotation(out: Quat, t: Transform): Quat
Transform.getScale(out: Vec3, t: Transform): Vec3

// Matrix
Transform.getMatrix(out: Mat4, t: Transform): Mat4
Transform.getInverseMatrix(out: Mat4, t: Transform): Mat4

// Hierarchy
Transform.localToWorld(out: Vec3, point: Vec3, t: Transform): Vec3
Transform.worldToLocal(out: Vec3, point: Vec3, t: Transform): Vec3
```

### AABB

Axis-Aligned Bounding Box.

```typescript
// Creation
AABB.create(min?: Vec3, max?: Vec3): AABB
AABB.fromPoints(points: Vec3[]): AABB
AABB.fromCenterSize(center: Vec3, size: Vec3): AABB

// Properties
AABB.getCenter(out: Vec3, aabb: AABB): Vec3
AABB.getSize(out: Vec3, aabb: AABB): Vec3
AABB.getExtents(out: Vec3, aabb: AABB): Vec3

// Operations
AABB.expand(out: AABB, aabb: AABB, point: Vec3): AABB
AABB.merge(out: AABB, a: AABB, b: AABB): AABB
AABB.transform(out: AABB, aabb: AABB, m: Mat4): AABB

// Tests
AABB.containsPoint(aabb: AABB, point: Vec3): boolean
AABB.intersectsAABB(a: AABB, b: AABB): boolean
```

### Ray

Ray for raycasting.

```typescript
// Creation
Ray.create(origin?: Vec3, direction?: Vec3): Ray
Ray.fromPoints(start: Vec3, end: Vec3): Ray

// Operations
Ray.getPoint(out: Vec3, ray: Ray, t: number): Vec3

// Intersection tests (returns distance or -1 if no hit)
Ray.intersectsAABB(ray: Ray, aabb: AABB): number
Ray.intersectsPlane(ray: Ray, planeNormal: Vec3, planeD: number): number
Ray.intersectsSphere(ray: Ray, center: Vec3, radius: number): number
Ray.intersectsTriangle(ray: Ray, v0: Vec3, v1: Vec3, v2: Vec3): number
```

## AssemblyScript Usage

The library uses `@inline` decorators that compile differently in TS vs AS:

```typescript
// In TypeScript: @inline is a no-op decorator
// In AssemblyScript: @inline is a compiler hint for inlining

import { Vec3 } from '@engine/math';

// Same code works in both environments
const a = Vec3.create(1, 2, 3);
const b = Vec3.create(4, 5, 6);
const result = Vec3.add(Vec3.create(), a, b);
```

## Performance Tips

1. **Reuse vectors** - Avoid creating new vectors in loops
   ```typescript
   const temp = Vec3.create(); // Create once
   for (const entity of entities) {
     Vec3.sub(temp, target, entity.position); // Reuse
   }
   ```

2. **Use squared distances** when comparing
   ```typescript
   // Fast (no sqrt)
   if (Vec3.distanceSq(a, b) < radiusSq) { ... }
   
   // Slow (has sqrt)
   if (Vec3.distance(a, b) < radius) { ... }
   ```

3. **Batch matrix operations**
   ```typescript
   // Build transform matrix once
   const mvp = Mat4.create();
   Mat4.multiply(mvp, projection, view);
   Mat4.multiply(mvp, mvp, model);
   ```

## Testing

```bash
cd packages/math
bun test
```

## License

MIT
