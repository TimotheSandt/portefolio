export function map(n: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return ((n - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
