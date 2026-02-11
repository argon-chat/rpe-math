/**
 * @engine/math - Runtime Polyfills
 * 
 * Sets up global decorators and types for TypeScript runtime.
 * In AssemblyScript these are built-in, but in TS we need polyfills.
 * 
 * MUST be imported BEFORE any module that uses @inline decorator.
 */

// Runtime polyfill for @inline decorator (no-op in TypeScript)
// In AssemblyScript, @inline is a built-in decorator that hints
// the compiler to inline the function for better performance.
if (typeof globalThis.inline !== 'function') {
  (globalThis as any).inline = function inline<T>(
    _target: Object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    return descriptor;
  };
}
