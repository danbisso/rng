export function getRandom() {
  return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
}

export function getOne() {
  return 1;
}