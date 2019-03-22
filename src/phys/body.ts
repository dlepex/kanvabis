import { IDSet } from 'commons/IdSet'
import { Undef, int } from 'commons/prelude'
import { Random } from 'math/random'
import { vec2 } from 'math/vec2'
import * as vec from 'math/vec2'
export type ID = int
export type CoordsModFn = (b: PointMass, p: MoveParams) => void
export type VelModFn = (b: PointMass, p: MoveParams) => void
export type BodyResolverFn = (id: ID) => Undef<Body>
/**
 * Body is the object that has "Physical Properties" phys, the rest is optional.
 */
export interface Body {
  phys: PhysProps
  coordsModifier?: CoordsModFn // different ways to interact with "walls" of the world
  velModifier?: VelModFn // to limit  or decay velocity
  stationary?: boolean // not moving body?
  /**
	  *  This method is called after interactions phase,
	  *  It is the place to apply "internal" body forces
	  */
  onBeforeMove?: (p: MoveParams) => void

}

export interface MoveParams {
  time: number
  dt: number
  step: int
  w: number
  h: number

  massCoef: number
  velModifier?: VelModFn
  coordsModifier: CoordsModFn
}

export interface PhysProps {
  readonly id: ID
  readonly coords: vec2
  readonly vel: vec2
  mass: number
  readonly force: vec2

  applyForce(f: vec2): void
}

// internal
export interface _Movable {
  _move(p: MoveParams): void
}

export interface PointMassConf {
  coords?: vec2
  vel?: vec2
  mass?: number
  force?: vec2
}

/**
 * Physical Properties of a PointMass/Particle
 */
export class PointMass implements PhysProps, _Movable {
  id = 0
  coords: vec2
  vel: vec2
  mass: number
  force: vec2
  constructor(p: PointMassConf) {
    this.coords = vec.cloneOr0(p.coords)
    this.vel = vec.cloneOr0(p.vel)
    this.force = vec.cloneOr0(p.force)
    this.mass = p.mass || 1
  }

  applyForce(f: vec2) { vec.inc(this.force, f) }

  get velScalar(): number { return vec.len(this.vel) }

  _move(p: MoveParams) {
    let moveFn = p.coordsModifier
    let f = this.force
    let v = this.vel

    // v = v + a*dt; where a = F/m, m = mass*world.massCoef
    if (!vec.isZero(f)) vec.inc(v, vec.scaleBy(f, p.dt / (p.massCoef * this.mass)))
    if (p.velModifier !== undefined) p.velModifier(this, p)
    if (vec.isZero(v)) return
    moveFn(this, p)
  }

}

export class CoordMods {

  static non(b: PointMass, p: MoveParams) {
    let pos = b.coords as vec2
    let v = b.vel
    vec.incScale(pos, v, p.dt)
  }

  static walls(b: PointMass, p: MoveParams) {
    let pos = b.coords
    let v = b.vel
    let x = pos[0]
    let y = pos[1]
    vec.incScale(pos, v, p.dt)
    let vx = v[0]
    let vy = v[1]
    if ((x < 0 && vx < 0) || (x > p.w && vx > 0)) { v[0] *= -1 }
    if ((y < 0 && vy < 0) || (y > p.h && vy > 0)) { v[1] *= -1 }
  }

  static modulo(b: PointMass, p: MoveParams) {
    let pos = b.coords
    let v = b.vel
    let w = p.w
    let h = p.h
    vec.incScale(pos, v, p.dt)
    pos[0] = (pos[0] + (w << 8)) % w
    pos[1] = (pos[1] + (h << 8)) % h
  }
}

export class VelMods {
  static limit(min: number, max: number, rng: Random): VelModFn {
    return (b: PointMass, p: MoveParams) => {
      let v = b.velScalar
      if (v < min) {
        if (v === 0) {
          vec.setRand1(rng, b.vel)
        }
        vec.setLen(b.vel, min)
        return
      }
      if (v > max) {
        vec.setLen(b.vel, max)
        return
      }
    }
  }

  static friction(threshold: number, coef: number): VelModFn {
    return (b: PointMass, p: MoveParams) => {
      if (b.velScalar > threshold) {
        vec.scaleBy(b.vel, 1 - coef)
      }
    }
  }

  static compose2(f1: VelModFn, f2: VelModFn): VelModFn {
    return (b: PointMass, p: MoveParams) => {
      f1(b, p)
      f2(b, p)
    }
  }

  static compose(...funcs: VelModFn[]): VelModFn {
    return (b: PointMass, p: MoveParams) => {
      for (let f of funcs) {
        f(b, p)
      }
    }
  }
}
