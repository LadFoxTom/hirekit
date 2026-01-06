// Self polyfill for server-side Node.js environment
// This provides a 'self' global that points to globalThis

module.exports = typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : global);
