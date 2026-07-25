/**
 * worldToCameraRelative (PREQ-2 / 3D-CAM.1) — the single rebase seam.
 */

import { describe, expect, it } from 'bun:test';
import { Vec3, worldToCameraRelative } from '../src';

describe('worldToCameraRelative', () => {
  it('subtracts the origin in f64', () => {
    const out = new Vec3();
    worldToCameraRelative({ x: 105, y: -3, z: 42 }, { x: 100, y: 1, z: 40 }, out);
    expect(out.x).toBe(5);
    expect(out.y).toBe(-4);
    expect(out.z).toBe(2);
  });

  it('differences of rebased positions are origin-invariant', () => {
    const a = { x: 1_000_000.25, y: 5, z: -7 };
    const b = { x: 1_000_003.75, y: 9, z: -1 };
    const origin = { x: 1_000_000, y: 0, z: 0 };
    const ra = new Vec3();
    const rb = new Vec3();
    worldToCameraRelative(a, origin, ra);
    worldToCameraRelative(b, origin, rb);
    // (a−O) − (b−O) = a − b, exactly, in f64
    expect(rb.x - ra.x).toBe(b.x - a.x);
    expect(rb.y - ra.y).toBe(b.y - a.y);
    expect(rb.z - ra.z).toBe(b.z - a.z);
  });

  it('preserves sub-f32 detail far from origin (the whole point)', () => {
    // 0.125 offset at 16M: f32 spacing at 2^24 is 2.0 — an f32-absolute store
    // would destroy the offset entirely. The f64 rebase keeps it exact.
    const origin = { x: 16_777_216, y: 0, z: 0 };
    const p = { x: 16_777_216.125, y: 0, z: 0 };
    const out = new Vec3();
    worldToCameraRelative(p, origin, out);
    expect(out.x).toBe(0.125);
    expect(Math.fround(p.x)).not.toBe(p.x); // sanity: f32 can't hold the absolute
    expect(Math.fround(out.x)).toBe(out.x); // but holds the relative exactly
  });

  it('near the origin, rebase is identity', () => {
    const out = new Vec3();
    worldToCameraRelative({ x: 3, y: 4, z: 5 }, { x: 0, y: 0, z: 0 }, out);
    expect(out.x).toBe(3);
    expect(out.y).toBe(4);
    expect(out.z).toBe(5);
  });
});
