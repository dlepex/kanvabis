import * as brect from 'math/bbox'
import { Random } from 'math/Random'
import { ID, MoveParams, VelMods } from 'phys/body'
import { InterGraph, InteractFn, MutualForce } from 'phys/interact'
import { Body, CollideProps, CollidingBody, ElasticCollideCalc, PhysProps, PointMass, Proximity, RectCollisions, World } from 'phys/phys'
import Two from 'two'
import { Events, Shape } from 'two'

import { filterViewCast } from 'commons/collections'
import { vec2 } from 'math/vec2'
import * as Vec from 'math/vec2'
import { EachWithEach } from 'phys/detector'
import { Scene, SceneUI } from './ui';
import { int } from 'commons/types';
import { head } from 'lodash-es';

interface Props {
  world: {
    size: vec2
    dt: number
    steps: int
    massCoef: number
  }
  particles: {
    count?: int
    color: string
    r?: int
    rd?: int
  }[]
  particlesTotal?: int
  rfCoef: number
  rfSelfCoef: number
}

const commonProps = {
  world: {
    size: [500, 500] as vec2,
    dt: 0.07,
    steps: 1,
    massCoef: 0.1
  },
  particlesTotal: 2000,
  rfCoef: 1.2,
  rfSelfCoef: 0.07,
}

export const scene: Scene<Props> = {
  uiState: {
    title: 'Repulsion Patterns',
    actions: {
      'Stop': () => {

      }
    }
  },
  defaultProps: {
    ...commonProps,
    particles: [{ color: 'red' }, { color: 'black' }, { color: 'lightgray' }]
  },
  presets: {
    'Two Sorts': {
      ...commonProps,
      particles: [{ color: 'red' }, { color: 'black' }]
    }
  },
  run() {

  }
}



class TheBody implements CollidingBody {
  id = 0
  collideSize: Vec.vec2
  collide: CollideProps
  phys: PhysProps
  shape: Shape
  w: World
  r: number

  color = 0
  isNew = false

  constructor(w: World, radius?: number) {
    this.w = w
    let kind = 'rect'
    let r = radius ? radius : w.rng.int(3, 6)
    this.color = w.rng.int(0, 3)
    // let r1 = w.rng.number(9, 15)
    this.r = r
    this.collide = new CollideProps(this, [r, r])
    this.phys = new PointMass({
      coords: w.rngCoords(),
      vel: Vec.scaleBy(Vec.setRand1(w.rng, Vec.create()), 2),
      mass: r * r / 80
    })
  }

  shapeInit(two: Two) {
    let rng = this.w.rng
    let r = two.makeCircle(this.phys.coords[0], this.phys.coords[1], this.r * 0.7)

    // let r = two.makeRectangle(this.phys.coords[0], this.phys.coords[1], this.collide.size[0], this.collide.size[1])
    this.shape = r
    r.linewidth = rng.int(1, 2)
    r.noStroke()

    switch (this.color) {
      case 0: r.fill = 'black'; break
      case 1: r.fill = 'red'; break
      case 2: r.fill = 'gray'; break
    }
  }

  shapeUpdate(two: Two) {
    if (!this.shape) {
      this.shapeInit(two)
    }
    let t = this.shape.translation
    // console.log("PHYS", this.phys.coords, this.phys.vel)
    let [x, y] = this.phys.coords
    if (isNaN(x) || isNaN(y)) {
      console.log('NaN bode = ', this.id, this.phys.coords, this.phys.vel, this.phys.force)
    }
    t.set(this.phys.coords[0], this.phys.coords[1])
  }

  onBeforeMove(p: MoveParams) {
  }
}

let collideSet = new Set<ID>()
let world: World
export function runSceneProximal(two: Two, opts: {
  bodies?: number, w: number, h: number,
}) {
  let N = 1800

  let w = new World({
    size: [opts.w, opts.h]
  })
  world = w
  w.massCoef = 0.1
  w.velModifier = VelMods.compose(VelMods.friction(0, 0.0001), VelMods.friction(1, 0.1))
  for (let i = 0; i < N; i++) {
    let b = new TheBody(w)
    w.add(b)
    b.shapeInit(two)
  }

  let nonCollidingBodies: Iterable<TheBody> = filterViewCast(w.bodies, (b) => !collideSet.has(b.phys.id))

  w.addInteraction({
    before() {
      collideSet.clear()
    },
    detect: new RectCollisions(w, w.bodies),
    interact: impulseCollide(w.rng)
  })

  w.addInteraction({
    detect: new Proximity(23, nonCollidingBodies), //new Proximity(30, nonCollidingBodies),
    interact: vanDerVaals(w.rng),
  })

  two.bind('update' as any, () => {

    let dt = 0.07

    for (let s = 0; s < 1; s++) {
      w.nextStep(dt)
    }

    for (let _b of w.bodies) {
      let b: TheBody = _b as any
      b.shapeUpdate(two)
    }
  }).play()

}

function vanDerVaals(rng: Random): InteractFn {
  let mf = new MutualForce(rng)
  return (a: TheBody, b: TheBody) => {
    mf.init(a, b)
    let d = mf.dist
    if (a.color !== b.color) {

      mf.apply(-1.2)  // -04
    } else if (d < 5) {
      mf.apply(-0.015)
    }
  }
}

let distVec = Vec.create()
function impulseCollide(rng: Random): InteractFn {
  let r = brect.create()
  let mf = new MutualForce(rng)
  let collide = new ElasticCollideCalc(rng)
  return (a: TheBody, b: TheBody) => {
    let ok = brect.intersect(a.collide.box, b.collide.box, r)

    Vec.subtract(distVec, a.phys.coords, b.phys.coords)
    let d = (a.r + b.r) - Vec.len(distVec)

    if (d < -0.2) {
      return
    }
    if (d < 0.5) {
      collide.nonCentral(a.phys, b.phys)
    } else {
      collideSet.add(a.id).add(b.id)
      collide.central(a.phys, b.phys)
      mf.init(a, b)
      mf.apply(-0.5)

      //collide.central(a.phys, b.phys)
    }
    //g.add(a.id, b.id)
  }
}

function color(r: number, g: number, b: number): string {
  return 'rgb(' + (Math.floor(r * 256)) + ',' + (Math.floor(g * 256)) + ',' + (Math.floor(b * 256)) + ')'
}
