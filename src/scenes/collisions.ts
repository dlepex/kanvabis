import * as brect from 'math/bbox'
import { Random } from 'math/Random'
import { MoveParams, VelMods } from 'phys/body'
import { InteractFn, MutualForce } from 'phys/phys'
import { Body, CollideProps, CollidingBody, ElasticCollideCalc, PhysProps, PointMass, RectCollisions, World } from 'phys/phys'
import Two from 'two'
import { Types as TwoTypes } from 'two'
import { Events, Shape } from 'two'

import { loggers } from 'commons/logger'
import { newPerfTimer, newPerfTimerDisabled } from 'commons/perftimer'
import { vec2 } from 'math/vec2'
import * as vec from 'math/vec2'
import * as ui from 'scenes/ui'

const [trace, isTrace] = loggers().get('')

class RectBody implements CollidingBody {
  collideSize: vec.vec2
  collide: CollideProps
  phys: PhysProps
  shape: Shape
  w: World

  constructor(w: World) {
    this.w = w
    let kind = 'rect'
    let r = w.rng.number(10, 40)
    let r1 = w.rng.number(10, 40)
    this.collideSize = [r, r1]
    this.collide = new CollideProps(this)
    this.phys = new PointMass({
      coords: w.rngCoords(),
      mass: r * r1 / 80,
      vel: [1, 0]
    })
  }

  shapeInit(two: Two) {
    let rng = this.w.rng
    //let r = two.makeCircle(this.phys.coords[0], this.phys.coords[1], this.collide.size[0]);

    let r = two.makeRectangle(this.phys.coords[0], this.phys.coords[1], this.collideSize[0], this.collideSize[1])
    this.shape = r
    r.linewidth = rng.int(1, 2)
    r.noStroke()
    r.fill = rng.colorRgb()
  }

  shapeUpdate(two: Two) {
    let t = this.shape.translation
    //console.log("PHYS", this.phys.coords, this.phys.vel)
    let [x, y] = this.phys.coords
    if (isNaN(x) || isNaN(y)) {
      //console.log("NaN bode = ", this.id, this.phys.coords, this.phys.vel, this.phys.force)
    }
    t.set(this.phys.coords[0], this.phys.coords[1])
  }

  onBeforeMove(p: MoveParams) {

  }
}

export let collisionScene: ui.Scene = {
  defaultProps: {
    x: 1, y: 2
  },
  uiState: {
    title: 'Rectangles collide',
    actions: {
      fuck() { console.log('say fuck') }
    }
  },
  run() {
    let elem = document.getElementById('sceneDrawingContainer')
    console.log('elem', elem)
    let width = 400, height = 400
    let two = new Two({ width, height, type: TwoTypes.canvas }).appendTo(elem!)
    runSceneCollide(two, {
      bodies: 300,
      w: width, h: height
    })
  }
}

function runSceneCollide(two: Two, opts: {
  bodies?: number,
  w: number, h: number
}) {

  let N = 200
  let w = new World({
    size: [opts.w, opts.h]
  })
  w.massCoef = 5
  w.velModifier = VelMods.compose(VelMods.friction(0.4, 0.01), VelMods.limit(0, 5, w.rng))
  for (let i = 0; i < N; i++) {
    let b = new RectBody(w)
    w.add(b)
    b.shapeInit(two)
  }

  w.addInteraction({
    interact: impulseCollide(w.rng),
    detect: new RectCollisions(w, w.bodies)
  })
  let tStep = newPerfTimer('step'), tDraw = newPerfTimer('draw')

  two.bind('update' as any, () => {

    let dt = (two.timeDelta || 16.0) / 16

    tStep.start()
    w.nextStep(dt)
    tStep.stop()
    tDraw.start()
    for (let _b of w.bodies) {
      let b: RectBody = _b as any
      b.shapeUpdate(two)
    }
    tDraw.stop()
    if (w.step % 10 === 0) {
      trace(tStep, tDraw)
    }
  }).play()
}

function impulseCollide(rng: Random, coef = 1): InteractFn {
  let r = brect.create()
  let mf = new MutualForce(rng)
  let collide = new ElasticCollideCalc(rng)
  return (a: CollidingBody, b: CollidingBody) => {
    let ok = brect.intersect(a.collide.box, b.collide.box, r)
    if (!ok) {
      console.log('rects do not intersect', a.phys.id, b.phys.id)
      return
    }

    let s = brect.area(r)
    let skmax = 0.005
    if (s / brect.area(a.collide.box) < skmax && s / brect.area(b.collide.box) < skmax) {
      collide.central(a.phys, b.phys)
    } else {
      collide.central(a.phys, b.phys)
    }
  }
}
