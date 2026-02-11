/**
 * Test setup - initialize runtime polyfills before any tests run
 * This file is imported before any test files via bunfig.toml
 */

// Runtime polyfill for @inline decorator (no-op in TypeScript)
// In AssemblyScript, @inline is a built-in decorator
// Must be set BEFORE any module using @inline is imported
(globalThis as any).inline = function inline<T>(
  _target: Object,
  _propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> {
  return descriptor;
};
