import { vec2 } from "math/vec2"

export function toPoint(v: vec2) {
  return new paper.Point(v[0], v[1])
}

export function toSize(v: vec2) {
  return new paper.Size(v[0], v[1])
}
