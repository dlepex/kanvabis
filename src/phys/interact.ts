
import { assert, nonNull } from 'commons/error'
import { MultiMap } from 'commons/MultiMap'
import { Constructor, int } from 'commons/prelude'
import * as brect from 'math/bbox'
import { Random } from 'math/Random'
import { vec2 } from 'math/vec2'
import * as vec from 'math/vec2'
import KDBush from 'vendor/kdbush/index.js'

import { Body, ID, PhysProps } from './body'
export type InteractFn = (a: Body, b: Body) => void
export type InterLaunchFn = () => void
export type InterLauncher = (i: Interaction, f: InteractFn) => InterLaunchFn

export interface Interaction {
  id?: number | string
  omitSteps?: int // for interactions that do not run for each step,
  detect: InterDetector // dectects whether 2 bodies can potentially interact
  interact: InteractFn
  exclude?: InterGraph | InterGraph[]
  before?: () => void
}

export interface InterDetector {
  // noDedup = true means that no deduplcation of pairs of interacting bodies is required.
  noDedup?: boolean
  forEach(interact: InteractFn): void
}

type InterKey = number

/**
 * Undirected interactions graph, represented as edge set.
 */
export class InterGraph {

  static readonly keyMask = (1 << 26) - 1

  static key(a: ID, b: ID): InterKey {
    if (a > b) { let t = a; a = b; b = t }
    return (a as number << 25) + (b as number)
  }

  set: Set<InterKey> = new Set()

  clear() { this.set.clear() }
  hasKey(k: InterKey): boolean {
    return this.set.has(k)
  }

  delete(k: InterKey): boolean { return this.set.delete(k) }

  has(a: ID, b: ID): boolean { return this.set.has(InterGraph.key(a, b)) }

  /**
	 * @returns !has(k) before addition
	 */
  addKey(k: InterKey): boolean {
    let set = this.set
    if (!set.has(k)) {
      set.add(k)
      return true
    } else {
      return false
    }
  }

  add(a: ID, b: ID): boolean { return this.addKey(InterGraph.key(a, b)) }

  forEach(cb: (a: ID, b: ID, k: InterKey) => void) {
    this.set.forEach((key: number) => {
      let mask = (1 << 26) - 1
      let b = key & mask, a = (key >> 25) & mask
      cb(a, b, key)
    })
  }
}

export function interGraphAsProvider(ig: InterGraph, byID: (id: ID) => Body): InterDetector {
  return {
    noDedup: true,
    forEach(interact: InteractFn) {
      ig.forEach((aid, bid) => interact(byID(aid), byID(bid)))
    }
  }
}

let dedupGraph = new InterGraph()

function graphsHas(graphs: InterGraph[], key: InterKey) {
  return graphs.some((g) => g.hasKey(key))
}

export function interLauncher(c: Interaction): InterLaunchFn {
  let pr = c.detect
  let interact = c.interact
  let exclude: InterGraph[] | undefined
  let before = c.before
  if (c.exclude) {
    if (Array.isArray(c.exclude)) exclude = c.exclude
    else exclude = [c.exclude]
  }

  if (pr.noDedup) {
    return () => {
      if (before !== undefined) before()
      pr.forEach((a, b) => {
        let k = InterGraph.key(a.phys.id, b.phys.id)
        if (exclude === undefined || !graphsHas(exclude!!, k)) {
          interact(a, b)
        }
      })
    }
  } else {
    return () => {
      if (before !== undefined) before()
      dedupGraph.clear() // reusing global dedup graph!

      pr.forEach((a, b) => {
        let k = InterGraph.key(a.phys.id, b.phys.id)
        if ((exclude === undefined || !graphsHas(exclude, k)) && dedupGraph.addKey(k)) {
          interact(a, b)
        }
      })
    }
  }
}

export class MutualForce {
  a: Body
  b: Body
  dist = 0
  coordsDif: vec2 = vec.create()

  constructor(public rng: Random) { }

  init(a: Body, b: Body): this {
    this.a = a
    this.b = b
    vec.subtract(this.coordsDif, b.phys.coords, a.phys.coords)
    this.dist = vec.len(this.coordsDif)
    return this
  }

  /**
   * @param scalar if positive - mutual attraction, else - repulsion
   */
  apply(scalar: number) {
    if (scalar === 0) return
    let f = this.coordsDif
    let d = this.dist
    if (d !== 0) {
      vec.scaleBy(f, scalar / this.dist)
    } else {
      vec.scaleBy(vec.setRand1(this.rng, f), scalar)
    }
    this.a.phys.applyForce(f)
    vec.neg(f, f)
    this.b.phys.applyForce(f)
  }
}

export class ElasticCollideCalc {
  _n: vec2 = vec.create()
  dn: vec2 = vec.create()
  dv: vec2 = vec.create()
  constructor(public rng: Random) { }

  _normalToCollisionLine(a: PhysProps, b: PhysProps, n?: vec.vec2) {
    if (n == null) {
      n = vec.subtract(this._n, a.coords, b.coords) // normal to "collision line"
    } else {
      n = vec.copy(this._n, n)
    }
    if (!vec.isZero(n)) vec.normalize(n, n)
    else vec.setRand1(this.rng, n)
    return n
  }

  central(a: PhysProps, b: PhysProps, n?: vec.vec2) {
    n = this._normalToCollisionLine(a, b, n)

    let va = vec.len(a.vel), vb = vec.len(b.vel)
    let ma = a.mass, mb = b.mass, m = ma + mb, dm = ma - mb
    // result speeds after collision
    let ua = (va * dm + 2 * mb * vb) / m
    let ub = (-vb * dm + 2 * ma * va) / m

    vec.scale(a.vel, n, ua)
    vec.scale(b.vel, n, -ub)
  }

  nonCentral(a: PhysProps, b: PhysProps, n?: vec.vec2) {
    n = this._normalToCollisionLine(a, b, n)
    let ma = a.mass, mb = b.mass, m = ma + mb
    let v = a.vel
    let dv = vec.subtract(this.dv, a.vel, b.vel)
    let dn = vec.scale(this.dn, n, 2 * vec.dot(n, dv) * (mb / m))
    vec.subtract(v, v, dn)
    v = b.vel
    vec.neg(n, n)
    vec.neg(dv, dv)
    vec.subtract(v, v, vec.scale(dn, n, 2 * vec.dot(n, dv) * (ma / m)))
  }
}
