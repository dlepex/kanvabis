
import * as glMatrix from 'gl-matrix/src/gl-matrix/common'
import * as vec from 'gl-matrix/src/gl-matrix/vec2'

import { EPSILON } from './math'
import { Random } from './Random'

export type vec2 = [number, number]

interface Coords2 {
  x: number
  y: number
}
// INIT {{
glMatrix.setMatrixArrayType(Float64Array)
// }}

export function create(x = 0.0, y = 0.0): vec2 {
  return new Float64Array([x, y]) as any
}
export const mk = create
export const dot: (v1: vec2, v2: vec2) => number = vec.dot as any
export const dist: (v1: vec2, v2: vec2) => number = vec.dist as any
export const eq: (v1: vec2, v2: vec2) => boolean = vec.exactEquals as any
export const eqEps: (v1: vec2, v2: vec2) => boolean = vec.equals as any
export const sqrDist: (v1: vec2, v2: vec2) => number = vec.sqrDist as any
export const scale: (out: vec2, v: vec2, k: number) => vec2 = vec.scale as any
export const add: (out: vec2, a: vec2, b: vec2) => vec2 = vec.add as any
export const addScale: (out: vec2, a: vec2, b: vec2, k: number) => vec2 = vec.scaleAndAdd as any
export const subtract: (out: vec2, a: vec2, b: vec2) => vec2 = vec.subtract as any
export const negate: (out: vec2, a: vec2) => vec2 = vec.negate as any
export const normalize: (out: vec2, a: vec2) => vec2 = vec.normalize as any
export const neg = negate
export const len: (v: vec2) => number = vec.len as any
export const sqrLen: (v: vec2) => number = vec.sqrLen as any

export function fromCoords(out: Coords2): vec2 {
  return create(out.x, out.y)
}

export function set(out: vec2, x: number, y: number): vec2 {
  out[0] = x
  out[1] = y
  return out
}

export function copy(out: vec2, s: vec2): vec2 {
  out[0] = s[0]
  out[1] = s[1]
  return out
}

export function cloneOr0(s?: vec2): vec2 {
  const x = 12
  return copyIfExists(vec.create(), s)
}

export function clone(s: vec2): vec2 {
  return copy(vec.create(), s)
}

export function copyIfExists(out: vec2, s?: vec2): vec2 {
  if (s !== undefined) {
    out[0] = s[0]
    out[1] = s[1]
  }
  return out
}
export function inc(out: vec2, s: vec2): vec2 {
  out[0] += s[0]
  out[1] += s[1]
  return out
}

export function scaleBy(out: vec2, k: number): vec2 {
  out[0] *= k
  out[1] *= k
  return out
}

export function incScale(out: vec2, s: vec2, k: number): vec2 {
  out[0] += k * s[0]
  out[1] += k * s[1]
  return out
}

export function dec(out: vec2, s: vec2): vec2 {
  out[0] -= s[0]
  out[1] -= s[1]
  return out
}

export function decScale(out: vec2, s: vec2, k: number): vec2 {
  out[0] -= k * s[0]
  out[1] -= k * s[1]
  return out
}

export function isZeroEps(v: vec2, eps = EPSILON): boolean {
  return Math.abs(v[0]) < eps && Math.abs(v[1]) < eps
}

export function isZero(v: vec2): boolean {
  return v[0] === 0 && v[1] === 0
}

export function setLen(out: vec2, newlen = 1): boolean {
  const l = len(out)
  if (l === 0) return false
  const k = newlen / l
  out[0] *= k
  out[1] *= k
  return true
}

export function copyToCoords(out: Coords2, v: vec2): Coords2 {
  out.x = v[0]
  out.y = v[1]
  return out
}

export function toCoords(v: vec2): Coords2 {
  return { x: v[0], y: v[1] }
}

/** random vector of length = 1 */
export function setRand1(r: Random, out: vec2): vec2 {
  const phi = r.get() * (2 * Math.PI)
  out[0] = Math.cos(phi)
  out[1] = Math.sin(phi)
  return out
}

export function setRandLen(r: Random, out: vec2, minLen: number, maxLen: number): vec2 {
  return scaleBy(setRand1(r, out), r.num(minLen, maxLen))
}
