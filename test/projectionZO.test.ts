/**
 * [0,1]-depth (WebGPU) projection variants — perspectiveZO / orthoZO.
 * GL-convention perspective/ortho map depth to [-1,1]; on WebGPU that clips
 * the near half of the frustum away. The ZO pair is the 3D path's projection.
 */

import { describe, expect, it } from 'bun:test';
import { Mat4 } from '../src';

/** clip = M * (0,0,z,1), returns ndc depth (clip.z / clip.w). */
function ndcDepth(m: Mat4, z: number): number {
  const clipZ = m.m02 * 0 + m.m06 * 0 + m.m10 * z + m.m14;
  const clipW = m.m03 * 0 + m.m07 * 0 + m.m11 * z + m.m15;
  return clipZ / clipW;
}

describe('perspectiveZO', () => {
  const near = 0.1;
  const far = 1000;
  const m = Mat4.perspectiveZO(Math.PI / 3, 16 / 9, near, far);

  it('maps the near plane to ndc depth 0', () => {
    expect(ndcDepth(m, -near)).toBeCloseTo(0, 10);
  });

  it('maps the far plane to ndc depth 1', () => {
    expect(ndcDepth(m, -far)).toBeCloseTo(1, 10);
  });

  it('mid-frustum depth stays inside [0, 1] (would be negative under GL convention)', () => {
    const gl = Mat4.perspective(Math.PI / 3, 16 / 9, near, far);
    const zMid = -(near + far) / 4;
    expect(ndcDepth(m, zMid)).toBeGreaterThan(0);
    expect(ndcDepth(m, zMid)).toBeLessThan(1);
    expect(ndcDepth(gl, -near)).toBeCloseTo(-1, 10); // sanity: GL near = -1 → WebGPU would clip it
  });
});

describe('orthoZO', () => {
  const m = Mat4.orthoZO(-10, 10, -5, 5, 0.5, 100);

  it('maps near → 0 and far → 1', () => {
    expect(ndcDepth(m, -0.5)).toBeCloseTo(0, 10);
    expect(ndcDepth(m, -100)).toBeCloseTo(1, 10);
  });

  it('xy mapping matches the GL ortho (only depth differs)', () => {
    const gl = Mat4.ortho(-10, 10, -5, 5, 0.5, 100);
    expect(m.m00).toBe(gl.m00);
    expect(m.m05).toBe(gl.m05);
    expect(m.m12).toBe(gl.m12);
    expect(m.m13).toBe(gl.m13);
  });
});
