const { deserialize, serialize } = require('node:v8');

if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (val) => deserialize(serialize(val));
}
