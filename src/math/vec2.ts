
import * as glMatrix from "gl-matrix/src/gl-matrix/common"
import * as vec from "gl-matrix/src/gl-matrix/vec2"

import { EPSILON } from './math'
import { Random } from './Random';

export type Vec2 = [number, number]
export type Vec2Immut = Readonly<[number, number]>

interface Coords2 {
	x: number
	y: number
}
// INIT {{
glMatrix.setMatrixArrayType(Float64Array)
// }}


export function create(x = 0.0, y = 0.0): Vec2 {
	return new Float64Array([x, y]) as any
}
export const mk = create
export const dot: (v1: Vec2Immut, v2: Vec2Immut) => number = vec.dot as any
export const dist: (v1: Vec2Immut, v2: Vec2Immut) => number = vec.dist as any
export const eq: (v1: Vec2Immut, v2: Vec2Immut) => boolean = vec.exactEquals as any
export const eqEps: (v1: Vec2Immut, v2: Vec2Immut) => boolean = vec.equals as any
export const sqrDist: (v1: Vec2Immut, v2: Vec2Immut) => number = vec.sqrDist as any
export const scale: (out: Vec2, v: Vec2Immut, k: number) => Vec2 = vec.scale as any
export const add: (out: Vec2, a: Vec2Immut, b: Vec2Immut) => Vec2 = vec.add as any
export const addScale: (out: Vec2, a: Vec2Immut, b: Vec2Immut, k: number) => Vec2 = vec.scaleAndAdd as any
export const subtract: (out: Vec2, a: Vec2Immut, b: Vec2Immut) => Vec2 = vec.subtract as any
export const negate: (out: Vec2Immut, a: Vec2Immut) => Vec2 = vec.negate as any
export const normalize: (out: Vec2Immut, a: Vec2Immut) => Vec2 = vec.normalize as any
export const neg = negate
export const len: (v: Vec2Immut) => number = vec.len as any
export const sqrLen: (v: Vec2Immut) => number = vec.sqrLen as any

export function fromCoords(out: Coords2): Vec2 {
	return create(out.x, out.y)
}

export function set(out: Vec2, x: number, y: number): Vec2 {
	out[0] = x
	out[1] = y
	return out
}

export function copy(out: Vec2, s: Vec2Immut): Vec2 {
	out[0] = s[0]
	out[1] = s[1]
	return out
}

export function cloneOr0(s?: Vec2Immut): Vec2 {
	return copyIfExists(vec.create(), s)
}

export function clone(s: Vec2Immut): Vec2 {
	return copy(vec.create(), s)
}

export function copyIfExists(out: Vec2, s?: Vec2Immut): Vec2 {
	if (s !== undefined) {
		out[0] = s[0]
		out[1] = s[1]
	}
	return out
}
export function inc(out: Vec2, s: Vec2Immut): Vec2 {
	out[0] += s[0]
	out[1] += s[1]
	return out
}

export function scaleBy(out: Vec2, k: number): Vec2 {
	out[0] *= k
	out[1] *= k
	return out
}

export function incScale(out: Vec2, s: Vec2Immut, k: number): Vec2 {
	out[0] += k * s[0]
	out[1] += k * s[1]
	return out
}

export function dec(out: Vec2, s: Vec2Immut): Vec2 {
	out[0] -= s[0]
	out[1] -= s[1]
	return out
}

export function decScale(out: Vec2, s: Vec2Immut, k: number): Vec2 {
	out[0] -= k * s[0]
	out[1] -= k * s[1]
	return out
}

export function isZeroEps(v: Vec2Immut, eps = EPSILON): boolean {
	return Math.abs(v[0]) < eps && Math.abs(v[1]) < eps
}

export function isZero(v: Vec2Immut): boolean {
	return v[0] === 0 && v[1] === 0
}

export function setLen(out: Vec2, newlen = 1): boolean {
	const l = len(out)
	if (l === 0) return false
	const k = newlen / l
	out[0] *= k;
	out[1] *= k;
	return true;
}

export function copyToCoords(out: Coords2, v: Vec2Immut): Coords2 {
	out.x = v[0]
	out.y = v[1]
	return out
}

export function toCoords(v: Vec2Immut): Coords2 {
	return { x: v[0], y: v[1] }
}

/** random vector of length = 1 */
export function setRand1(r: Random, out: Vec2): Vec2 {
	const phi = r.rfn() * (2 * Math.PI)
	out[0] = Math.cos(phi)
	out[1] = Math.sin(phi)
	return out
}

export function setRandLen(r: Random, out: Vec2, minLen: number, maxLen: number): Vec2 {
	return scaleBy(setRand1(r, out), r.number(minLen, maxLen))
}
