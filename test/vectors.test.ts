/**
 * Tests for Vec2, Vec3, Vec4
 */

import { describe, expect, it } from 'bun:test';
import { Vec2, Vec3, Vec4, EPSILON } from '../src';

// ============================================================================
// VEC2 TESTS
// ============================================================================

describe('Vec2', () => {
  describe('construction', () => {
    it('should create zero vector by default', () => {
      const v = new Vec2();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
    });

    it('should create vector with given values', () => {
      const v = new Vec2(3, 4);
      expect(v.x).toBe(3);
      expect(v.y).toBe(4);
    });

    it('should create zero/one/up/down/left/right vectors', () => {
      expect(Vec2.zero().x).toBe(0);
      expect(Vec2.one().x).toBe(1);
      expect(Vec2.up().y).toBe(1);
      expect(Vec2.down().y).toBe(-1);
      expect(Vec2.left().x).toBe(-1);
      expect(Vec2.right().x).toBe(1);
    });

    it('should create from angle', () => {
      const v = Vec2.fromAngle(0);
      expect(v.x).toBeCloseTo(1, 5);
      expect(v.y).toBeCloseTo(0, 5);

      const v2 = Vec2.fromAngle(Math.PI / 2);
      expect(v2.x).toBeCloseTo(0, 5);
      expect(v2.y).toBeCloseTo(1, 5);
    });
  });

  describe('basic operations', () => {
    it('should add vectors', () => {
      const a = new Vec2(1, 2);
      const b = new Vec2(3, 4);
      a.add(b);
      expect(a.x).toBe(4);
      expect(a.y).toBe(6);
    });

    it('should subtract vectors', () => {
      const a = new Vec2(5, 7);
      const b = new Vec2(2, 3);
      a.sub(b);
      expect(a.x).toBe(3);
      expect(a.y).toBe(4);
    });

    it('should multiply by scalar', () => {
      const v = new Vec2(3, 4);
      v.mulScalar(2);
      expect(v.x).toBe(6);
      expect(v.y).toBe(8);
    });

    it('should divide by scalar', () => {
      const v = new Vec2(6, 8);
      v.divScalar(2);
      expect(v.x).toBe(3);
      expect(v.y).toBe(4);
    });

    it('should negate', () => {
      const v = new Vec2(3, -4);
      v.negate();
      expect(v.x).toBe(-3);
      expect(v.y).toBe(4);
    });
  });

  describe('length and normalization', () => {
    it('should calculate length', () => {
      const v = new Vec2(3, 4);
      expect(v.length()).toBe(5);
    });

    it('should calculate lengthSq', () => {
      const v = new Vec2(3, 4);
      expect(v.lengthSq()).toBe(25);
    });

    it('should normalize', () => {
      const v = new Vec2(3, 4);
      v.normalize();
      expect(v.length()).toBeCloseTo(1, 5);
      expect(v.x).toBeCloseTo(0.6, 5);
      expect(v.y).toBeCloseTo(0.8, 5);
    });

    it('should handle zero vector normalization', () => {
      const v = new Vec2(0, 0);
      v.normalize();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
    });
  });

  describe('dot and cross', () => {
    it('should calculate dot product', () => {
      const a = new Vec2(1, 2);
      const b = new Vec2(3, 4);
      expect(a.dot(b)).toBe(11); // 1*3 + 2*4
    });

    it('should calculate cross product (2D scalar)', () => {
      const a = new Vec2(1, 0);
      const b = new Vec2(0, 1);
      expect(a.cross(b)).toBe(1);

      const c = new Vec2(0, 1);
      const d = new Vec2(1, 0);
      expect(c.cross(d)).toBe(-1);
    });
  });

  describe('distance', () => {
    it('should calculate distance', () => {
      const a = new Vec2(0, 0);
      const b = new Vec2(3, 4);
      expect(a.distanceTo(b)).toBe(5);
    });

    it('should calculate distanceSq', () => {
      const a = new Vec2(0, 0);
      const b = new Vec2(3, 4);
      expect(a.distanceToSq(b)).toBe(25);
    });

    it('should calculate manhattan distance', () => {
      const a = new Vec2(0, 0);
      const b = new Vec2(3, 4);
      expect(a.manhattanDistanceTo(b)).toBe(7);
    });
  });

  describe('angles', () => {
    it('should calculate angle', () => {
      expect(new Vec2(1, 0).angle()).toBeCloseTo(0, 5);
      expect(new Vec2(0, 1).angle()).toBeCloseTo(Math.PI / 2, 5);
      expect(new Vec2(-1, 0).angle()).toBeCloseTo(Math.PI, 5);
    });

    it('should calculate angle between vectors', () => {
      const a = new Vec2(1, 0);
      const b = new Vec2(0, 1);
      expect(a.angleTo(b)).toBeCloseTo(Math.PI / 2, 5);
    });
  });

  describe('lerp', () => {
    it('should interpolate vectors', () => {
      const a = new Vec2(0, 0);
      const b = new Vec2(10, 10);
      a.lerp(b, 0.5);
      expect(a.x).toBe(5);
      expect(a.y).toBe(5);
    });
  });

  describe('clone and copy', () => {
    it('should clone', () => {
      const a = new Vec2(3, 4);
      const b = a.clone();
      expect(b.x).toBe(3);
      expect(b.y).toBe(4);
      a.x = 10;
      expect(b.x).toBe(3); // Independent
    });

    it('should copy', () => {
      const a = new Vec2(3, 4);
      const b = new Vec2();
      b.copy(a);
      expect(b.x).toBe(3);
      expect(b.y).toBe(4);
    });
  });

  describe('equality', () => {
    it('should check approximate equality', () => {
      const a = new Vec2(1, 2);
      const b = new Vec2(1 + EPSILON / 2, 2 + EPSILON / 2);
      expect(a.equals(b)).toBe(true);
    });

    it('should check exact equality', () => {
      const a = new Vec2(1, 2);
      const b = new Vec2(1, 2);
      expect(a.exactEquals(b)).toBe(true);

      const c = new Vec2(1, 2.0001);
      expect(a.exactEquals(c)).toBe(false);
    });
  });

  describe('static methods', () => {
    it('Vec2.add should not mutate inputs', () => {
      const a = new Vec2(1, 2);
      const b = new Vec2(3, 4);
      const c = Vec2.add(a, b);
      expect(c.x).toBe(4);
      expect(a.x).toBe(1); // Unchanged
    });

    it('Vec2.sub should work', () => {
      const c = Vec2.sub(new Vec2(5, 7), new Vec2(2, 3));
      expect(c.x).toBe(3);
      expect(c.y).toBe(4);
    });

    it('Vec2.lerp should work', () => {
      const c = Vec2.lerp(new Vec2(0, 0), new Vec2(10, 10), 0.5);
      expect(c.x).toBe(5);
      expect(c.y).toBe(5);
    });

    it('Vec2.distance should work', () => {
      const d = Vec2.distance(new Vec2(0, 0), new Vec2(3, 4));
      expect(d).toBe(5);
    });
  });
});

// ============================================================================
// VEC3 TESTS
// ============================================================================

describe('Vec3', () => {
  describe('construction', () => {
    it('should create zero vector by default', () => {
      const v = new Vec3();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });

    it('should create vector with given values', () => {
      const v = new Vec3(1, 2, 3);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
    });

    it('should create directional vectors', () => {
      expect(Vec3.up().y).toBe(1);
      expect(Vec3.down().y).toBe(-1);
      expect(Vec3.right().x).toBe(1);
      expect(Vec3.left().x).toBe(-1);
      expect(Vec3.forward().z).toBe(1);
      expect(Vec3.back().z).toBe(-1);
    });
  });

  describe('basic operations', () => {
    it('should add vectors', () => {
      const a = new Vec3(1, 2, 3);
      const b = new Vec3(4, 5, 6);
      a.add(b);
      expect(a.x).toBe(5);
      expect(a.y).toBe(7);
      expect(a.z).toBe(9);
    });

    it('should multiply by scalar', () => {
      const v = new Vec3(1, 2, 3);
      v.mulScalar(2);
      expect(v.x).toBe(2);
      expect(v.y).toBe(4);
      expect(v.z).toBe(6);
    });
  });

  describe('length and normalization', () => {
    it('should calculate length', () => {
      const v = new Vec3(2, 3, 6);
      expect(v.length()).toBe(7); // sqrt(4 + 9 + 36) = 7
    });

    it('should normalize', () => {
      const v = new Vec3(2, 3, 6);
      v.normalize();
      expect(v.length()).toBeCloseTo(1, 5);
    });
  });

  describe('cross product', () => {
    it('should calculate cross product', () => {
      const x = new Vec3(1, 0, 0);
      const y = new Vec3(0, 1, 0);
      const z = Vec3.cross(x, y);
      expect(z.x).toBeCloseTo(0, 5);
      expect(z.y).toBeCloseTo(0, 5);
      expect(z.z).toBeCloseTo(1, 5);
    });

    it('should calculate right-hand rule', () => {
      const y = new Vec3(0, 1, 0);
      const x = new Vec3(1, 0, 0);
      const negZ = Vec3.cross(y, x);
      expect(negZ.z).toBeCloseTo(-1, 5);
    });
  });

  describe('dot product', () => {
    it('should calculate dot product', () => {
      const a = new Vec3(1, 2, 3);
      const b = new Vec3(4, 5, 6);
      expect(a.dot(b)).toBe(32); // 1*4 + 2*5 + 3*6
    });

    it('should be zero for perpendicular vectors', () => {
      const x = new Vec3(1, 0, 0);
      const y = new Vec3(0, 1, 0);
      expect(x.dot(y)).toBe(0);
    });
  });

  describe('reflect', () => {
    it('should reflect vector', () => {
      const v = new Vec3(1, -1, 0);
      const n = new Vec3(0, 1, 0); // Up normal
      const r = Vec3.reflect(v, n);
      expect(r.x).toBeCloseTo(1, 5);
      expect(r.y).toBeCloseTo(1, 5);
      expect(r.z).toBeCloseTo(0, 5);
    });
  });
});

// ============================================================================
// VEC4 TESTS
// ============================================================================

describe('Vec4', () => {
  describe('construction', () => {
    it('should create zero vector by default', () => {
      const v = new Vec4();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
      expect(v.w).toBe(0);
    });

    it('should create vector with given values', () => {
      const v = new Vec4(1, 2, 3, 4);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
      expect(v.w).toBe(4);
    });
  });

  describe('basic operations', () => {
    it('should add vectors', () => {
      const a = new Vec4(1, 2, 3, 4);
      const b = new Vec4(5, 6, 7, 8);
      a.add(b);
      expect(a.x).toBe(6);
      expect(a.y).toBe(8);
      expect(a.z).toBe(10);
      expect(a.w).toBe(12);
    });

    it('should calculate dot product', () => {
      const a = new Vec4(1, 2, 3, 4);
      const b = new Vec4(5, 6, 7, 8);
      expect(a.dot(b)).toBe(70); // 5 + 12 + 21 + 32
    });

    it('should normalize', () => {
      const v = new Vec4(1, 2, 3, 4);
      v.normalize();
      expect(v.length()).toBeCloseTo(1, 5);
    });
  });

  describe('lerp', () => {
    it('should interpolate vectors', () => {
      const a = new Vec4(0, 0, 0, 0);
      const b = new Vec4(10, 20, 30, 40);
      const c = Vec4.lerp(a, b, 0.5);
      expect(c.x).toBe(5);
      expect(c.y).toBe(10);
      expect(c.z).toBe(15);
      expect(c.w).toBe(20);
    });
  });
});
