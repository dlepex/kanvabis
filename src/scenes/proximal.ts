import { filterViewCast } from 'commons/collections'
import { int, toInt32 } from 'commons/types'
import { dot } from 'gl-matrix/src/gl-matrix/quat'
import { head } from 'lodash-es'
import * as brect from 'math/bbox'
import { Random } from 'math/Random'
import { vec2 } from 'math/vec2'
import * as Vec from 'math/vec2'
import { ID, MoveParams, VelMods } from 'phys/body'
import { EachWithEach } from 'phys/detector'
import { InterGraph, InteractFn, MutualForce } from 'phys/interact'
import { Body, CollideProps, CollidingBody, ElasticCollideCalc, PhysProps, PointMass, Proximity, RectCollisions, World } from 'phys/phys'
import Two from 'two'
import { Types as TwoTypes } from 'two'
import { Events, Shape } from 'two'

import { evalProp, setSceneExprEval } from './scene'
import { Scene, SceneUI } from './ui'

interface Props {
  world: {
    size: vec2
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
  world: {
    size: [500, 500] as vec2,
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

export const scene: Scene<Props> = {
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
  },
  run() {
    let props: Props = SceneUI.obj.props as any
    let elem = document.getElementById('sceneDrawingContainer')
    console.log('elem', elem)
    let [width, height] = props.world.size
    let two = new Two({ width, height, type: TwoTypes.canvas }).appendTo(elem!)
    runSceneProximal(two, props)
  }
}

class TheBody implements CollidingBody {
  id = 0
  collideSize: Vec.vec2
  collide: CollideProps
  phys: PhysProps
  shape: Shape
  r: number

  color: string
  isNew = false

  constructor(opts: { color: string, radius: int }) {
    this.color = opts.color
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

export function runSceneProximal(two: Two, props: Props) {

  let w = new World({
    size: props.world.size
  })
  setSceneExprEval({
    rng: w.rng,
    math: Math
  })
  world = w
  w.massCoef = props.world.massCoef
  w.velModifier = VelMods.compose(VelMods.friction(0, 0.0001), VelMods.friction(1, 0.1))

  let nonCollidingBodies: Iterable<TheBody> = filterViewCast(w.bodies, (b) => !collideSet.has(b.phys.id))

  for (let d of props.dots) {
    let n = toInt32(d.count || (props.dotsDef.total!! / props.dots.length))
    console.log("dots group: ", n, d)
    while (n-- > 0) {
      let b = new TheBody({
        color: evalProp(d.color),
        radius: evalProp(props.dotsDef.r) || d.r!!
      })
      w.add(b)
      b.shapeInit(two)
    }
  }

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
      let b: TheBody = _b as any
      b.shapeUpdate(two)
    }
  }).play()

}

function vanDerVaals(rng: Random, props: Props): InteractFn {
  let mf = new MutualForce(rng)
  let rf = -props.rfCoef
  let rfSefl = -props.rfSelfCoef
  return (a: TheBody, b: TheBody) => {
    mf.init(a, b)
    let d = mf.dist
    if (a.color !== b.color) {
      mf.apply(rf)  // -04
    } else if (d < 5) {
      mf.apply(rfSefl)
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
