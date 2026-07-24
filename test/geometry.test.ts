/**
 * Tests for AABB and Ray
 */

import { describe, expect, it } from 'bun:test';
import { AABB, Ray, Vec3 } from '../src';

// ============================================================================
// AABB TESTS
// ============================================================================

describe('AABB', () => {
  describe('construction', () => {
    it('should create from min/max', () => {
      const aabb = AABB.fromMinMaxVec(
        new Vec3(-1, -2, -3),
        new Vec3(1, 2, 3)
      );
      expect(aabb.min.x).toBe(-1);
      expect(aabb.max.z).toBe(3);
    });

    it('should create from center and extents', () => {
      const aabb = AABB.fromCenterExtentsVec(
        new Vec3(0, 0, 0),
        new Vec3(5, 5, 5)
      );
      expect(aabb.min.x).toBe(-5);
      expect(aabb.max.x).toBe(5);
    });

    it('should create from min/max values', () => {
      const aabb = AABB.fromMinMax(-5, -5, -5, 5, 5, 5);
      expect(aabb.min.x).toBe(-5);
      expect(aabb.max.x).toBe(5);
    });

    it('should create empty AABB', () => {
      const aabb = AABB.empty();
      expect(aabb.isEmpty()).toBe(true);
    });
  });

  describe('properties', () => {
    it('should calculate center', () => {
      const aabb = AABB.fromMinMax(-10, -10, -10, 10, 10, 10);
      const center = aabb.getCenter();
      expect(center.x).toBe(0);
      expect(center.y).toBe(0);
      expect(center.z).toBe(0);
    });

    it('should calculate size', () => {
      const aabb = AABB.fromMinMax(0, 0, 0, 5, 10, 15);
      const size = aabb.getSize();
      expect(size.x).toBe(5);
      expect(size.y).toBe(10);
      expect(size.z).toBe(15);
    });

    it('should calculate extents', () => {
      const aabb = AABB.fromMinMax(-2, -4, -6, 2, 4, 6);
      const extents = aabb.getExtents();
      expect(extents.x).toBe(2);
      expect(extents.y).toBe(4);
      expect(extents.z).toBe(6);
    });

    it('should calculate volume', () => {
      const aabb = AABB.fromMinMax(0, 0, 0, 2, 3, 4);
      expect(aabb.getVolume()).toBe(24);
    });

    it('should calculate surface area', () => {
      const aabb = AABB.fromMinMax(0, 0, 0, 2, 3, 4);
      // 2 * (2*3 + 2*4 + 3*4) = 2 * (6 + 8 + 12) = 52
      expect(aabb.getSurfaceArea()).toBe(52);
    });
  });

  describe('containment', () => {
    it('should contain point inside', () => {
      const aabb = AABB.fromMinMax(-1, -1, -1, 1, 1, 1);
      expect(aabb.containsPoint(0, 0, 0)).toBe(true);
      expect(aabb.containsPoint(0.5, 0.5, 0.5)).toBe(true);
    });

    it('should not contain point outside', () => {
      const aabb = AABB.fromMinMax(-1, -1, -1, 1, 1, 1);
      expect(aabb.containsPoint(2, 0, 0)).toBe(false);
      expect(aabb.containsPoint(0, -2, 0)).toBe(false);
    });

    it('should contain another AABB', () => {
      const outer = AABB.fromMinMax(-10, -10, -10, 10, 10, 10);
      const inner = AABB.fromMinMax(-1, -1, -1, 1, 1, 1);
      expect(outer.containsAABB(inner)).toBe(true);
      expect(inner.containsAABB(outer)).toBe(false);
    });
  });

  describe('intersection', () => {
    it('should detect AABB intersection', () => {
      const a = AABB.fromMinMax(0, 0, 0, 2, 2, 2);
      const b = AABB.fromMinMax(1, 1, 1, 3, 3, 3);
      expect(a.intersectsAABB(b)).toBe(true);
    });

    it('should detect no intersection', () => {
      const a = AABB.fromMinMax(0, 0, 0, 1, 1, 1);
      const b = AABB.fromMinMax(5, 5, 5, 6, 6, 6);
      expect(a.intersectsAABB(b)).toBe(false);
    });
  });

  describe('operations', () => {
    it('should expand by point', () => {
      const aabb = AABB.fromMinMax(0, 0, 0, 1, 1, 1);
      aabb.expandByPoint(5, -2, 3);

      expect(aabb.min.y).toBe(-2);
      expect(aabb.max.x).toBe(5);
      expect(aabb.max.z).toBe(3);
    });

    it('should union AABBs', () => {
      const a = AABB.fromMinMax(-1, -1, -1, 0, 0, 0);
      const b = AABB.fromMinMax(0, 0, 0, 1, 1, 1);
      const merged = AABB.union(a, b);

      expect(merged.min.x).toBe(-1);
      expect(merged.max.x).toBe(1);
    });

    it('should clamp point', () => {
      const aabb = AABB.fromMinMax(-1, -1, -1, 1, 1, 1);

      // Point outside
      const closest = aabb.clampPoint(5, 0, 0);
      expect(closest.x).toBe(1);
      expect(closest.y).toBe(0);
      expect(closest.z).toBe(0);

      // Point inside stays same
      const insideClosest = aabb.clampPoint(0.5, 0.5, 0.5);
      expect(insideClosest.x).toBe(0.5);
    });

    it('should calculate distance to point', () => {
      const aabb = AABB.fromMinMax(0, 0, 0, 1, 1, 1);

      expect(aabb.distanceToPoint(0.5, 0.5, 0.5)).toBe(0);
      expect(aabb.distanceToPoint(2, 0.5, 0.5)).toBeCloseTo(1, 5);
    });
  });
});

describe('Ray', () => {
  describe('construction', () => {
    it('should create ray from vectors', () => {
      const ray = Ray.fromVecs(
        new Vec3(0, 0, 0),
        new Vec3(1, 0, 0)
      );
      expect(ray.origin.x).toBe(0);
      expect(ray.direction.x).toBe(1);
    });

    it('should normalize direction', () => {
      const ray = Ray.fromVecs(
        new Vec3(0, 0, 0),
        new Vec3(2, 0, 0) // Not normalized
      );
      expect(ray.direction.length()).toBeCloseTo(1, 5);
    });

    it('should create from coordinates', () => {
      const ray = Ray.create(1, 2, 3, 0, 1, 0);
      expect(ray.origin.y).toBe(2);
      expect(ray.direction.y).toBe(1);
    });
  });

  describe('point at distance', () => {
    it('should calculate point at t', () => {
      const ray = Ray.fromVecs(
        new Vec3(0, 0, 0),
        new Vec3(1, 0, 0)
      );
      const p = ray.getPoint(5);
      expect(p.x).toBe(5);
      expect(p.y).toBe(0);
      expect(p.z).toBe(0);
    });
  });

  describe('AABB intersection', () => {
    it('should intersect AABB', () => {
      const ray = Ray.fromVecs(
        new Vec3(-5, 0, 0),
        new Vec3(1, 0, 0)
      );
      const aabb = AABB.fromMinMax(-1, -1, -1, 1, 1, 1);
      
      const t = ray.intersectAABB(aabb);
      expect(t).toBeGreaterThanOrEqual(0);
      expect(t).toBeCloseTo(4, 5); // -5 + 4 = -1 (entry point)
    });

    it('should miss AABB', () => {
      const ray = Ray.fromVecs(
        new Vec3(-5, 5, 0),
        new Vec3(1, 0, 0)
      );
      const aabb = AABB.fromMinMax(-1, -1, -1, 1, 1, 1);
      
      const t = ray.intersectAABB(aabb);
      expect(t).toBe(-1);
    });

    it('should handle ray inside AABB', () => {
      const ray = Ray.fromVecs(
        new Vec3(0, 0, 0),
        new Vec3(1, 0, 0)
      );
      const aabb = AABB.fromMinMax(-1, -1, -1, 1, 1, 1);
      
      const t = ray.intersectAABB(aabb);
      expect(t).toBeGreaterThanOrEqual(0);
    });
  });

  describe('sphere intersection', () => {
    it('should intersect sphere', () => {
      const ray = Ray.fromVecs(
        new Vec3(-5, 0, 0),
        new Vec3(1, 0, 0)
      );
      
      const t = ray.intersectSphere(0, 0, 0, 1);
      expect(t).toBeGreaterThanOrEqual(0);
      expect(t).toBeCloseTo(4, 5); // Entry at x = -1
    });

    it('should miss sphere', () => {
      const ray = Ray.fromVecs(
        new Vec3(-5, 5, 0),
        new Vec3(1, 0, 0)
      );
      
      const t = ray.intersectSphere(0, 0, 0, 1);
      expect(t).toBe(-1);
    });

    it('should handle ray inside sphere', () => {
      const ray = Ray.fromVecs(
        new Vec3(0, 0, 0),
        new Vec3(1, 0, 0)
      );
      
      const t = ray.intersectSphere(0, 0, 0, 5);
      expect(t).toBeGreaterThanOrEqual(0);
    });
  });

  describe('plane intersection', () => {
    it('should intersect plane', () => {
      const ray = Ray.fromVecs(
        new Vec3(0, 5, 0),
        new Vec3(0, -1, 0)
      );
      
      const t = ray.intersectPlane(0, 1, 0, 0);
      expect(t).toBeGreaterThanOrEqual(0);
      expect(t).toBeCloseTo(5, 5);
    });

    it('should handle parallel ray', () => {
      const ray = Ray.fromVecs(
        new Vec3(0, 5, 0),
        new Vec3(1, 0, 0)
      );
      
      const t = ray.intersectPlane(0, 1, 0, 0);
      expect(t).toBe(-1);
    });

    it('should handle ray pointing away', () => {
      const ray = Ray.fromVecs(
        new Vec3(0, 5, 0),
        new Vec3(0, 1, 0) // Pointing away from plane
      );
      
      const t = ray.intersectPlane(0, 1, 0, 0);
      expect(t).toBe(-1);
    });
  });

  describe('triangle intersection', () => {
    it('should intersect triangle', () => {
      const ray = Ray.fromVecs(
        new Vec3(0, 0, -5),
        new Vec3(0, 0, 1)
      );
      const v0 = new Vec3(-1, -1, 0);
      const v1 = new Vec3(1, -1, 0);
      const v2 = new Vec3(0, 1, 0);
      
      const t = ray.intersectTriangle(v0, v1, v2);
      expect(t).toBeGreaterThanOrEqual(0);
      expect(t).toBeCloseTo(5, 5);
    });

    it('should miss triangle', () => {
      const ray = Ray.fromVecs(
        new Vec3(5, 5, -5), // Off to the side
        new Vec3(0, 0, 1)
      );
      const v0 = new Vec3(-1, -1, 0);
      const v1 = new Vec3(1, -1, 0);
      const v2 = new Vec3(0, 1, 0);
      
      const t = ray.intersectTriangle(v0, v1, v2);
      expect(t).toBe(-1);
    });
  });

  describe('closest point', () => {
    it('should find closest point on ray', () => {
      const ray = Ray.fromVecs(
        new Vec3(0, 0, 0),
        new Vec3(1, 0, 0)
      );
      
      const closest = ray.closestPointToPoint(5, 3, 0);
      expect(closest.x).toBe(5);
      expect(closest.y).toBe(0);
      expect(closest.z).toBe(0);
    });

    it('should clamp to origin for negative projection', () => {
      const ray = Ray.fromVecs(
        new Vec3(0, 0, 0),
        new Vec3(1, 0, 0)
      );
      
      const closest = ray.closestPointToPoint(-5, 3, 0);
      expect(closest.x).toBe(0); // Clamped to origin
    });
  });
});
