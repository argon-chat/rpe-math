/**
 * @engine/math - Camera-relative rebase helper (CAMERA-RELATIVE-DESIGN §3.7)
 *
 * The ONE seam every 3D geometry writer (mesh-instance builder, 3D light
 * collector, 3D shadow collector, debug/VFX writers) calls to rebase an
 * absolute world position around the active origin. Nobody subtracts the
 * origin by hand — when floating-origin lands, its compound offset feeds the
 * `origin` argument here and every call site keeps working unchanged.
 *
 * All math is f64 (plain JS numbers); the f32 narrow happens later, at the
 * GPU upload seam (`Mat4.toFloat32Array` / typed-array stores) — never here.
 */

interface Vec3Like {
  x: number;
  y: number;
  z: number;
}

/**
 * out = pos − origin, computed in f64.
 *
 * `origin` is the active rebase origin — in T1 exactly the camera's absolute
 * world position (`Camera3D.cameraWorldPos`); later possibly a compound
 * floating-origin offset. Passing it explicitly (instead of reading ambient
 * per-frame state) keeps the helper pure and testable — resolved open-Q §8.1.
 */
export function worldToCameraRelative(pos: Vec3Like, origin: Vec3Like, out: Vec3Like): void {
  out.x = pos.x - origin.x;
  out.y = pos.y - origin.y;
  out.z = pos.z - origin.z;
}
