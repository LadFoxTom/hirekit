// This file runs before any other server code in Next.js
// It polyfills 'self' to prevent SSR errors from browser-only packages

// Execute polyfill immediately at module load time
if (typeof globalThis !== 'undefined' && typeof globalThis.self === 'undefined') {
  (globalThis as any).self = globalThis;
}

if (typeof global !== 'undefined' && typeof (global as any).self === 'undefined') {
  (global as any).self = global;
}

export async function register() {
  // Additional polyfill in register hook
  if (typeof globalThis.self === 'undefined') {
    (globalThis as any).self = globalThis;
  }
  if (typeof global !== 'undefined' && typeof (global as any).self === 'undefined') {
    (global as any).self = global;
  }
}
