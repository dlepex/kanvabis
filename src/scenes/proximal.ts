import * as chroma from 'chroma-js'
import { filterViewCast } from 'commons/collections'
import { int, toInt32 } from 'commons/prelude'
import { dot } from 'gl-matrix/src/gl-matrix/quat'
import { groupBy, head } from 'lodash-es'
import * as brect from 'math/bbox'
import { Random } from 'math/random'
import { vec2 } from 'math/vec2'
import * as Vec from 'math/vec2'
import { ID, MoveParams, VelMods } from 'phys/body'
import { EachWithEach } from 'phys/detector'
import { InterGraph, InteractFn, MutualForce } from 'phys/interact'
import { Body, CollideProps, CollidingBody, ElasticCollideCalc, PhysProps, PointMass, Proximity, RectCollisions, World } from 'phys/phys'
import Two from 'two'
import { Types as TwoTypes } from 'two'
import { Events, Shape } from 'two'

import { SceneBase } from './scene'

interface Props {
  canvas: {
    w: int,
    h: int,
  },
  world: {
    dt: number
    steps: int
    massCoef: number
  }
  dots: Array<{
    count?: int
    color: string
    r?: int
  }>
  dotsDef: {
    total?: int
    r?: int
  }
  rfCoef: number
  rfSelfCoef: number
  proximity: number
}

const commonProps = {
  canvas: { w: 500, h: 500 },
  world: {
    dt: 0.07,
    steps: 1,
    massCoef: 0.1
  },
  dotsDef: {
    total: 1400,
    r: 4
  },
  rfCoef: 1.2,
  rfSelfCoef: 0.015,
  proximity: 23
}

export class Scene extends SceneBase {
  config = {
    uiState: {
      title: 'Repulsion Patterns',
      actions: {
        Stop: () => {
        }
      }
    },
    defaultProps: {
      ...commonProps,
      dots: [{ color: 'red' }, { color: 'black' }, { color: 'lightgray' }]
    },
    presetProps: {
      'Two Sorts': {
        ...commonProps,
        dots: [{ color: 'red' }, { color: 'black' }]
      }
    }
  }
  constructor() {
    super()
  }
  onStart() {
    let props: Props = this.ui.props as any
    let elem = document.getElementById('sceneDrawingContainer')
    console.log('elem', elem)
    let [width, height] = [props.canvas.w, props.canvas.h]
    let two = new Two({ width, height, type: TwoTypes.canvas }).appendTo(elem!)
    this.runSceneProximal(two, props)
  }

  runSceneProximal(two: Two, props: Props) {
    let w = new World({
      size: [props.canvas.w, props.canvas.h]
    })
    world = w
    w.massCoef = props.world.massCoef
    w.velModifier = VelMods.compose(VelMods.friction(0, 0.0001), VelMods.friction(1, 0.1))

    let nonCollidingBodies: Iterable<Dot> = filterViewCast(w.bodies, (b) => !collideSet.has(b.phys.id))

    props.dots.forEach((d, group) => {
      let n = toInt32(d.count || (props.dotsDef.total!! / props.dots.length))
      console.log("dots group: ", n, d)
      while (n-- > 0) {
        let b = new Dot({
          group,
          color: this.evalProp(d.color),
          radius: this.evalProp(props.dotsDef.r) || d.r!!
        })
        w.add(b)
        b.shapeInit(two)
      }
    })
    w.addInteraction({
      before() {
        collideSet.clear()
      },
      detect: new RectCollisions(w, w.bodies),
      interact: impulseCollide(w.rng)
    })
    w.addInteraction({
      detect: new Proximity(props.proximity, nonCollidingBodies), //new Proximity(30, nonCollidingBodies),
      interact: vanDerVaals(w.rng, props),
    })

    two.bind('update' as any, () => {
      let dt = props.world.dt
      for (let s = 0; s < 1; s++) {
        w.nextStep(dt)
      }

      for (let _b of w.bodies) {
        let b: Dot = _b as any
        b.shapeUpdate(two)
      }
    }).play()
  }
}

class Dot implements CollidingBody {
  id = 0
  collideSize: Vec.vec2
  collide: CollideProps
  phys: PhysProps
  shape: Shape
  r: number

  color: string
  group: int
  isNew = false

  constructor(opts: { color: string, radius: int, group: int }) {
    this.color = opts.color
    this.group = opts.group
    let r = this.r = opts.radius
    this.collide = new CollideProps(this, [r, r])
    this.phys = new PointMass({
      coords: world.rngCoords(),
      vel: Vec.scaleBy(Vec.setRand1(world.rng, Vec.create()), 2),
      mass: r * r / 80
    })
  }

  shapeInit(two: Two) {
    let r = two.makeCircle(this.phys.coords[0], this.phys.coords[1], this.r)
    // let r = two.makeRectangle(this.phys.coords[0], this.phys.coords[1], this.collide.size[0], this.collide.size[1])
    this.shape = r
    r.noStroke()
    r.fill = this.color
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

function vanDerVaals(rng: Random, props: Props): InteractFn {
  let mf = new MutualForce(rng)
  let rf = -props.rfCoef
  let rfSefl = -props.rfSelfCoef
  return (a: Dot, b: Dot) => {
    mf.init(a, b)
    let d = mf.dist
    if (a.group !== b.group) {
      mf.apply(rf)  // -04
    } else {
      mf.apply(rfSefl)
    }
  }
}
let distVec = Vec.create()
function impulseCollide(rng: Random): InteractFn {
  let r = brect.create()
  let mf = new MutualForce(rng)
  let collide = new ElasticCollideCalc(rng)
  return (a: Dot, b: Dot) => {
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
