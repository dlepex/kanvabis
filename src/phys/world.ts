import { assert } from 'commons/error'
import { castMutable, int } from 'commons/prelude'
import { Random } from 'math/Random'
import { vec2 } from 'math/vec2'
import * as Vec from 'math/vec2'

import { Body, BodyResolverFn, CoordMods, CoordsModFn, ID, MoveParams, PhysProps, PointMass, VelModFn, _Movable } from './body'
import { InterLauncher, InteractFn, Interaction, interLauncher } from './interact'

type DeleteListener = (b: Body) => void

export class World {
  readonly bodies: Iterable<Body>
  readonly size: vec2
  readonly rng: Random = new Random()
  readonly get: BodyResolverFn

  coordsModifier: CoordsModFn = CoordMods.walls
  velModifier?: VelModFn
  massCoef = 1.0

  _idBodyMap: Map<ID, Body>
  _deleteListeners: DeleteListener[] = []
  _inters: InterRunnable[] = []
  _idCounter = 1
  _moveParams: MoveParams

  constructor(c: {
    size: vec2
  }) {
    this.size = Vec.clone(c.size)
    let bodiesMap = new Map()
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
    let v = Vec.create()
    v[0] = this.rng.number(dx, this.size[0] - dx)
    v[1] = this.rng.number(dy, this.size[1] - dy)
    return v
  }

  get step(): int { return this._moveParams.step }

  nextStep(dt: number) {
    let mp = this._moveParams
    mp.dt = dt
    mp.time += dt
    mp.step++
    mp.massCoef = this.massCoef

    // 1. apply bodies interactions (collisions/repulsions/attractions etc)
    for (let inter of this._inters) {
      inter._launch()
    }

    // 2. move bodies
    for (let b of this.bodies) {
      if (b.onBeforeMove !== undefined) b.onBeforeMove(mp)
      if (b.stationary) continue

      mp.coordsModifier = b.coordsModifier || this.coordsModifier
      mp.velModifier = b.velModifier || this.velModifier
      let movable: _Movable = b.phys as any
      movable._move(mp)
      Vec.set(b.phys.force, 0, 0)
    }
  }

  add(b: Body): Body {
    assert(b.phys.id === 0, 'body is already attached')
    let id: ID = this._idCounter++
    castMutable(b.phys).id = id
    this._idBodyMap.set(id, b)
    return b
  }

  delete(b: Body): boolean {
    if (b.phys.id === 0) return true // detached body.
    for (let dl of this._deleteListeners) {
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
    let s = new Set<Body>()
    this.addDeleteListener((b) => s.delete(b))
    return s
  }

  addInteraction(inter: Interaction) {
    assert(this._inters.every((i) => i !== inter), 'repeated interaction')
    let r = inter as InterRunnable
    r._launch = interLauncher(inter)
    this._inters.push(r)
  }

  deleteInteraction(inter: Interaction) {
    this._inters = this._inters.filter((i) => i !== inter)
  }
}

interface InterRunnable extends Interaction {
  _launch: () => void
}
