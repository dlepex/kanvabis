import { vec2 } from "./vec2"

export type BoundaryBox = [number, number, number, number]


export function create(x1 = 0, y1 = 0, x2 = 0, y2 = 0): BoundaryBox {
  return [x1, y1, x2, y2]
}

export function set(out: BoundaryBox, x1: number, y1: number, x2: number, y2: number) {
  out[0] = x1; out[1] = y1; out[2] = x2; out[3] = y2;
}

export function area(a: BoundaryBox): number {
  return (a[2] - a[0]) * (a[3] - a[1])
}

export function intersect(a: BoundaryBox, b: BoundaryBox, out?: BoundaryBox): boolean {
  const x1 = Math.max(a[0], b[0])
  const y1 = Math.max(a[1], b[1])
  const x2 = Math.min(a[2], b[2])
  const y2 = Math.min(a[3], b[3])

  if (x1 > x2 || y1 > y2) return false
  if (out !== undefined) {
    set(out, x1, y1, x2, y2)
  }
  return true
}

export function setCenter(out: BoundaryBox, x: number, y: number, w: number, h: number) {
  w = w / 2
  h = h / 2
  set(out, x - w, y - h, x + w, y + h)
}

export function setCenterVec(out: BoundaryBox, c: vec2, size: vec2) {
  setCenter(out, c[0], c[1], size[0], size[1])
}








