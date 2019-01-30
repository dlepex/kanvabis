import { int, castMutable } from "commons/prelude"
import { Random } from "math/Random"
import { vec2 } from "math/vec2"
import * as vec from "math/vec2"

import { Body, BodyResolverFn, CoordsModFn, CoordMods, ID, MoveParams, PhysProps, PointMass, VelModFn, _Movable } from "./body"
import { InterLauncher, InteractFn, Interaction, interLauncher } from "./interact"
import { assert } from "commons/error";


export interface WorldConf {
  size: vec.vec2
}

type DeleteListener = (b: Body) => void

export class World {
  private _idBodyMap: Map<ID, Body>
  readonly bodies: Iterable<Body>
  private _deleteListeners: DeleteListener[] = []
  private _inters: InterRunnable[] = []
  private _idCounter = 1
  readonly size: vec2
  readonly rng: Random = new Random()
  private _moveParams: MoveParams

  coordsModifier: CoordsModFn = CoordMods.walls
  velModifier?: VelModFn
  massCoef = 1.0
  readonly get: BodyResolverFn

  constructor(c: WorldConf) {
    this.size = vec.clone(c.size)
    const bodiesMap = new Map()
    this._idBodyMap = bodiesMap
    this.get = (id) => bodiesMap.get(id)
    this.bodies = {
      [Symbol.iterator]() { return bodiesMap.values() }
    }
    this._moveParams = {
      w: this.size[0],
      h: this.size[1],
      time: 0,
      dt: 0,
      step: -1,
      massCoef: this.massCoef,
      coordsModifier: this.coordsModifier
    }
  }

  rngCoords(dx?: number, dy?: number): vec2 {
    dx = dx || this.size[0] / 10
    dy = dy || this.size[1] / 10
    const v = vec.create()
    v[0] = this.rng.number(dx, this.size[0] - dx)
    v[1] = this.rng.number(dy, this.size[1] - dy)
    return v
  }

  get step(): int { return this._moveParams.step }

  nextStep(dt: number) {
    const mp = this._moveParams
    mp.dt = dt
    mp.time += dt
    mp.step++
    mp.massCoef = this.massCoef

    // 1. apply bodies interactions (collisions/repulsions/attractions etc)
    for (const inter of this._inters) {
      inter._launch()
    }
    const coc = 11

    // 2. move bodies
    for (const b of this.bodies) {
      if (b.onBeforeMove !== undefined) b.onBeforeMove(mp)
      if (b.stationary) continue

      mp.coordsModifier = b.coordsModifier || this.coordsModifier
      mp.velModifier = b.velModifier || this.velModifier
      const movable: _Movable = b.phys as any
      movable._move(mp)
      vec.set(b.phys.force, 0, 0)
    }
  }

  add(b: Body): Body {
    assert(b.phys.id === 0, "body is already attached")
    const id: ID = this._idCounter++
    castMutable(b.phys).id = id
    this._idBodyMap.set(id, b)
    return b
  }

  delete(b: Body): boolean {
    if (b.phys.id === 0) return true // detached body.
    for (const dl of this._deleteListeners) {
      dl(b)
    }
    this._idBodyMap.delete(b.phys.id)
    castMutable(b.phys).id = 0
    return true
  }

  addDeleteListener(listener: DeleteListener) {

    this._deleteListeners.push(listener)
  }

  newBodySet(): Set<Body> {
    const s = new Set<Body>()
    this.addDeleteListener((b) => s.delete(b))
    return s
  }

  addInteraction(inter: Interaction) {
    assert(this._inters.every(i => i !== inter), "repeated interaction")
    const r = inter as InterRunnable
    r._launch = interLauncher(inter)
    this._inters.push(r)
  }

  deleteInteraction(inter: Interaction) {
    this._inters = this._inters.filter(i => i !== inter)
  }
}

interface InterRunnable extends Interaction {
  _launch: () => void
}

