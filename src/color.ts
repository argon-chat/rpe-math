/**
 * @engine/math - Color transfer functions
 *
 * The canonical CPU-side sRGB EOTF/OETF pair (piecewise, matches the shader
 * `engine.color` Slang module). Authored colors are display sRGB; the render
 * pipeline is linear — every color INPUT decodes through srgbToLinear before
 * it reaches the GPU, the tonemap applies linearToSrgb once on OUTPUT.
 */

/** sRGB → linear (EOTF). Monotonic for HDR inputs > 1. */
export function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** linear → sRGB (OETF). Inverse of {@link srgbToLinear}. */
export function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}
