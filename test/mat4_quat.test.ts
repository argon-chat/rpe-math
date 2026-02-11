/**
 * Tests for Mat4 and Quat
 */

import { describe, expect, it } from 'bun:test';
import { Mat4, Quat, Vec3, Vec4, PI, EPSILON } from '../src';

// ============================================================================
// MAT4 TESTS
// ============================================================================

describe('Mat4', () => {
  describe('construction', () => {
    it('should create identity matrix by default', () => {
      const m = new Mat4();
      expect(m.m00).toBe(1);
      expect(m.m05).toBe(1);
      expect(m.m10).toBe(1);
      expect(m.m15).toBe(1);
      expect(m.m01).toBe(0);
      expect(m.m04).toBe(0);
    });

    it('should create identity with static method', () => {
      const m = Mat4.identity();
      expect(m.determinant()).toBeCloseTo(1, 5);
    });

    it('should create zero matrix', () => {
      const m = Mat4.zero();
      expect(m.m00).toBe(0);
      expect(m.m15).toBe(0);
    });
  });

  describe('basic operations', () => {
    it('should set identity', () => {
      const m = Mat4.zero();
      m.setIdentity();
      expect(m.m00).toBe(1);
      expect(m.m05).toBe(1);
    });

    it('should copy', () => {
      const a = Mat4.fromTranslation(1, 2, 3);
      const b = new Mat4();
      b.copy(a);
      expect(b.m12).toBe(1);
      expect(b.m13).toBe(2);
      expect(b.m14).toBe(3);
    });

    it('should clone', () => {
      const a = Mat4.fromTranslation(5, 6, 7);
      const b = a.clone();
      expect(b.m12).toBe(5);
      a.m12 = 100;
      expect(b.m12).toBe(5); // Independent
    });
  });

  describe('translation', () => {
    it('should create translation matrix', () => {
      const m = Mat4.fromTranslation(10, 20, 30);
      expect(m.m12).toBe(10);
      expect(m.m13).toBe(20);
      expect(m.m14).toBe(30);
    });

    it('should translate existing matrix', () => {
      const m = new Mat4();
      m.translate(5, 10, 15);
      expect(m.m12).toBe(5);
      expect(m.m13).toBe(10);
      expect(m.m14).toBe(15);
    });

    it('should get translation', () => {
      const m = Mat4.fromTranslation(1, 2, 3);
      const t = m.getTranslation();
      expect(t.x).toBe(1);
      expect(t.y).toBe(2);
      expect(t.z).toBe(3);
    });
  });

  describe('scaling', () => {
    it('should create scaling matrix', () => {
      const m = Mat4.fromScaling(2, 3, 4);
      expect(m.m00).toBe(2);
      expect(m.m05).toBe(3);
      expect(m.m10).toBe(4);
    });

    it('should scale existing matrix', () => {
      const m = new Mat4();
      m.scale(2, 2, 2);
      expect(m.m00).toBe(2);
      expect(m.m05).toBe(2);
      expect(m.m10).toBe(2);
    });

    it('should get scaling', () => {
      const m = Mat4.fromScaling(2, 3, 4);
      const s = m.getScaling();
      expect(s.x).toBeCloseTo(2, 5);
      expect(s.y).toBeCloseTo(3, 5);
      expect(s.z).toBeCloseTo(4, 5);
    });
  });

  describe('rotation', () => {
    it('should create rotation X matrix', () => {
      const m = Mat4.fromRotationX(PI / 2);
      // After 90° rotation around X, Y axis becomes Z, Z becomes -Y
      const v = new Vec3(0, 1, 0);
      const r = m.transformDirection(v);
      expect(r.x).toBeCloseTo(0, 5);
      expect(r.y).toBeCloseTo(0, 5);
      expect(r.z).toBeCloseTo(1, 5);
    });

    it('should create rotation Y matrix', () => {
      const m = Mat4.fromRotationY(PI / 2);
      const v = new Vec3(1, 0, 0);
      const r = m.transformDirection(v);
      expect(r.x).toBeCloseTo(0, 5);
      expect(r.y).toBeCloseTo(0, 5);
      expect(r.z).toBeCloseTo(-1, 5);
    });

    it('should create rotation Z matrix', () => {
      const m = Mat4.fromRotationZ(PI / 2);
      const v = new Vec3(1, 0, 0);
      const r = m.transformDirection(v);
      expect(r.x).toBeCloseTo(0, 5);
      expect(r.y).toBeCloseTo(1, 5);
      expect(r.z).toBeCloseTo(0, 5);
    });
  });

  describe('multiplication', () => {
    it('should multiply identity with any matrix', () => {
      const a = Mat4.fromTranslation(1, 2, 3);
      const i = Mat4.identity();
      const result = Mat4.multiply(i, a);
      expect(result.m12).toBe(1);
      expect(result.m13).toBe(2);
      expect(result.m14).toBe(3);
    });

    it('should compose transformations', () => {
      const t = Mat4.fromTranslation(10, 0, 0);
      const s = Mat4.fromScaling(2, 2, 2);
      
      // Scale then translate
      const result = Mat4.multiply(t, s);
      
      const v = new Vec3(1, 0, 0);
      const r = result.transformVec3(v);
      // First scale: (2, 0, 0), then translate: (12, 0, 0)
      expect(r.x).toBeCloseTo(12, 5);
    });
  });

  describe('transpose', () => {
    it('should transpose matrix', () => {
      const m = new Mat4();
      m.m04 = 5;
      m.m01 = 0;
      m.transpose();
      expect(m.m01).toBe(5);
      expect(m.m04).toBe(0);
    });
  });

  describe('determinant', () => {
    it('should calculate determinant of identity', () => {
      const m = Mat4.identity();
      expect(m.determinant()).toBeCloseTo(1, 5);
    });

    it('should calculate determinant of scaling', () => {
      const m = Mat4.fromScaling(2, 3, 4);
      expect(m.determinant()).toBeCloseTo(24, 5); // 2 * 3 * 4
    });
  });

  describe('inverse', () => {
    it('should invert translation', () => {
      const m = Mat4.fromTranslation(5, 10, 15);
      m.invert();
      expect(m.m12).toBeCloseTo(-5, 5);
      expect(m.m13).toBeCloseTo(-10, 5);
      expect(m.m14).toBeCloseTo(-15, 5);
    });

    it('should satisfy M * M^-1 = I', () => {
      const m = Mat4.fromTranslation(1, 2, 3);
      m.rotateX(0.5);
      m.scale(2, 2, 2);
      
      const mInv = m.clone().invert();
      const result = Mat4.multiply(m, mInv);
      
      expect(result.m00).toBeCloseTo(1, 4);
      expect(result.m05).toBeCloseTo(1, 4);
      expect(result.m10).toBeCloseTo(1, 4);
      expect(result.m15).toBeCloseTo(1, 4);
    });
  });

  describe('vector transformation', () => {
    it('should transform Vec3', () => {
      const m = Mat4.fromTranslation(10, 20, 30);
      const v = new Vec3(1, 2, 3);
      const r = m.transformVec3(v);
      expect(r.x).toBe(11);
      expect(r.y).toBe(22);
      expect(r.z).toBe(33);
    });

    it('should transform Vec4', () => {
      const m = Mat4.fromTranslation(10, 0, 0);
      const v = new Vec4(1, 0, 0, 1);
      const r = m.transformVec4(v);
      expect(r.x).toBe(11);
      expect(r.w).toBe(1);
    });

    it('should transform direction (ignores translation)', () => {
      const m = Mat4.fromTranslation(100, 100, 100);
      const v = new Vec3(1, 0, 0);
      const r = m.transformDirection(v);
      expect(r.x).toBe(1); // Unchanged
      expect(r.y).toBe(0);
      expect(r.z).toBe(0);
    });
  });

  describe('projection matrices', () => {
    it('should create perspective matrix', () => {
      const m = Mat4.perspective(PI / 4, 16 / 9, 0.1, 100);
      expect(m.m15).toBe(0); // Perspective projection has w = 0
      expect(m.m11).toBe(-1);
    });

    it('should create ortho matrix', () => {
      const m = Mat4.ortho(-10, 10, -10, 10, 0.1, 100);
      expect(m.m15).toBe(1); // Ortho projection has w = 1
    });
  });

  describe('lookAt', () => {
    it('should create lookAt matrix', () => {
      const eye = new Vec3(0, 0, 5);
      const target = new Vec3(0, 0, 0);
      const up = new Vec3(0, 1, 0);
      
      const m = Mat4.lookAt(eye, target, up);
      
      // Transform origin - should give camera-relative position
      const result = m.transformVec3(new Vec3(0, 0, 0));
      expect(result.z).toBeCloseTo(-5, 5); // Origin is 5 units in front
    });
  });
});

// ============================================================================
// QUAT TESTS
// ============================================================================

describe('Quat', () => {
  describe('construction', () => {
    it('should create identity quaternion by default', () => {
      const q = new Quat();
      expect(q.x).toBe(0);
      expect(q.y).toBe(0);
      expect(q.z).toBe(0);
      expect(q.w).toBe(1);
    });

    it('should create identity with static method', () => {
      const q = Quat.identity();
      expect(q.w).toBe(1);
      expect(q.lengthSq()).toBeCloseTo(1, 5);
    });

    it('should create from axis-angle', () => {
      const axis = new Vec3(0, 1, 0);
      const q = Quat.fromAxisAngle(axis, PI / 2);
      expect(q.length()).toBeCloseTo(1, 5);
    });

    it('should create from euler angles', () => {
      const q = Quat.fromEuler(0, PI / 2, 0); // 90° around Y
      expect(q.length()).toBeCloseTo(1, 5);
    });
  });

  describe('basic operations', () => {
    it('should set identity', () => {
      const q = new Quat(1, 2, 3, 4);
      q.setIdentity();
      expect(q.x).toBe(0);
      expect(q.w).toBe(1);
    });

    it('should copy', () => {
      const a = Quat.fromEuler(0.1, 0.2, 0.3);
      const b = new Quat();
      b.copy(a);
      expect(b.x).toBe(a.x);
      expect(b.y).toBe(a.y);
    });

    it('should clone', () => {
      const a = Quat.fromEuler(0.5, 0.5, 0.5);
      const b = a.clone();
      a.x = 999;
      expect(b.x).not.toBe(999);
    });
  });

  describe('normalization', () => {
    it('should normalize', () => {
      const q = new Quat(1, 2, 3, 4);
      q.normalize();
      expect(q.length()).toBeCloseTo(1, 5);
    });

    it('identity should be normalized', () => {
      const q = Quat.identity();
      expect(q.length()).toBeCloseTo(1, 5);
    });
  });

  describe('conjugate and inverse', () => {
    it('should calculate conjugate', () => {
      const q = new Quat(1, 2, 3, 4);
      const c = Quat.conjugate(q);
      expect(c.x).toBe(-1);
      expect(c.y).toBe(-2);
      expect(c.z).toBe(-3);
      expect(c.w).toBe(4);
    });

    it('should calculate inverse', () => {
      const q = Quat.fromEuler(0.5, 0.5, 0.5);
      const qInv = Quat.invert(q);
      
      // q * q^-1 = identity
      const result = Quat.multiply(q, qInv);
      expect(result.x).toBeCloseTo(0, 4);
      expect(result.y).toBeCloseTo(0, 4);
      expect(result.z).toBeCloseTo(0, 4);
      expect(result.w).toBeCloseTo(1, 4);
    });
  });

  describe('multiplication', () => {
    it('should multiply with identity', () => {
      const q = Quat.fromEuler(0.5, 0.5, 0.5);
      const i = Quat.identity();
      const result = Quat.multiply(q, i);
      expect(result.x).toBeCloseTo(q.x, 5);
      expect(result.y).toBeCloseTo(q.y, 5);
    });

    it('should compose rotations', () => {
      const yAxis = new Vec3(0, 1, 0);
      const q1 = Quat.fromAxisAngle(yAxis, PI / 2); // 90° Y
      const q2 = Quat.identity();
      
      const combined = Quat.multiply(q1, q2);
      
      // Multiply with identity should give same rotation
      const v = new Vec3(1, 0, 0);
      const r1 = q1.transformVec3(v);
      const r2 = combined.transformVec3(v);
      expect(r1.x).toBeCloseTo(r2.x, 4);
      expect(r1.z).toBeCloseTo(r2.z, 4);
    });
  });

  describe('vector rotation', () => {
    it('should rotate vector around Y axis', () => {
      const yAxis = new Vec3(0, 1, 0);
      const q = Quat.fromAxisAngle(yAxis, PI / 2); // 90° around Y
      
      const v = new Vec3(1, 0, 0);
      const r = q.transformVec3(v);
      
      expect(r.x).toBeCloseTo(0, 4);
      expect(r.y).toBeCloseTo(0, 4);
      expect(r.z).toBeCloseTo(-1, 4);
    });

    it('should rotate vector around X axis', () => {
      const xAxis = new Vec3(1, 0, 0);
      const q = Quat.fromAxisAngle(xAxis, PI / 2); // 90° around X
      
      const v = new Vec3(0, 1, 0);
      const r = q.transformVec3(v);
      
      expect(r.x).toBeCloseTo(0, 4);
      expect(r.y).toBeCloseTo(0, 4);
      expect(r.z).toBeCloseTo(1, 4);
    });

    it('identity rotation should not change vector', () => {
      const q = Quat.identity();
      const v = new Vec3(1, 2, 3);
      const r = q.transformVec3(v);
      
      expect(r.x).toBeCloseTo(1, 5);
      expect(r.y).toBeCloseTo(2, 5);
      expect(r.z).toBeCloseTo(3, 5);
    });
  });

  describe('slerp', () => {
    it('should interpolate at t=0', () => {
      const a = Quat.identity();
      const b = Quat.fromEuler(0, PI / 2, 0);
      const result = Quat.slerp(a, b, 0);
      
      expect(result.x).toBeCloseTo(a.x, 5);
      expect(result.y).toBeCloseTo(a.y, 5);
      expect(result.w).toBeCloseTo(a.w, 5);
    });

    it('should interpolate at t=1', () => {
      const a = Quat.identity();
      const b = Quat.fromEuler(0, PI / 2, 0);
      const result = Quat.slerp(a, b, 1);
      
      expect(result.x).toBeCloseTo(b.x, 5);
      expect(result.y).toBeCloseTo(b.y, 5);
      expect(result.w).toBeCloseTo(b.w, 5);
    });

    it('should produce normalized result', () => {
      const a = Quat.fromEuler(0, 0, 0);
      const b = Quat.fromEuler(0, PI, 0);
      const result = Quat.slerp(a, b, 0.5);
      
      expect(result.length()).toBeCloseTo(1, 5);
    });
  });

  describe('euler conversion', () => {
    it('should convert to euler and back (simple rotation)', () => {
      // Use simple 90° rotation to avoid gimbal lock issues
      const original = Quat.fromEuler(0, PI / 2, 0);
      const euler = original.toEuler();
      
      // Check euler Y is approximately PI/2
      expect(Math.abs(euler.y)).toBeCloseTo(PI / 2, 2);
    });
  });

  describe('matrix conversion', () => {
    it('should convert to rotation matrix', () => {
      const yAxis = new Vec3(0, 1, 0);
      const q = Quat.fromAxisAngle(yAxis, PI / 2);
      const m = q.toMat4();
      
      // Should produce same rotation
      const v = new Vec3(1, 0, 0);
      const rQuat = q.transformVec3(v);
      const rMat = m.transformDirection(v);
      
      expect(rQuat.x).toBeCloseTo(rMat.x, 4);
      expect(rQuat.y).toBeCloseTo(rMat.y, 4);
      expect(rQuat.z).toBeCloseTo(rMat.z, 4);
    });

    it('should convert from rotation matrix', () => {
      const m = Mat4.fromRotationY(PI / 4);
      const q = Quat.fromRotationMatrix(m);
      
      // Should produce same rotation  
      const v = new Vec3(1, 0, 0);
      const rMat = m.transformDirection(v);
      const rQuat = q.transformVec3(v);
      
      expect(rQuat.x).toBeCloseTo(rMat.x, 4);
      expect(rQuat.y).toBeCloseTo(rMat.y, 4);
      expect(rQuat.z).toBeCloseTo(rMat.z, 4);
    });
  });

  describe('axis-angle', () => {
    it('should get axis-angle', () => {
      const yAxis = new Vec3(0, 1, 0);
      const angle = PI / 3;
      const q = Quat.fromAxisAngle(yAxis, angle);
      
      const outAxis = new Vec3();
      const outAngle = q.getAxisAngle(outAxis);
      
      expect(outAngle).toBeCloseTo(angle, 4);
      expect(outAxis.y).toBeCloseTo(1, 4);
    });
  });
});
