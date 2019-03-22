import { loggers } from 'commons/logger'
import { newPerfTimer, newPerfTimerDisabled } from 'commons/perfTimer'
import * as Paper from 'draw/paperUtils'
import * as brect from 'math/bbox'
import { Random } from 'math/random'
import { vec2 } from 'math/vec2'
import * as vec from 'math/vec2'
import * as paper from 'paper'
import { MoveParams, VelMods } from 'phys/body'
import { InteractFn, MutualForce } from 'phys/phys'
import { Body, CollideProps, CollidingBody, ElasticCollideCalc, PhysProps, PointMass, RectCollisions, World } from 'phys/phys'
import * as ui from 'scenes/scene'

const [trace, isTrace] = loggers().get('')

class RectBody implements CollidingBody {
  collide: CollideProps
  phys: PhysProps
  shape: paper.Path.Rectangle

  constructor(private w: World, private scene: ui.SceneBase) {
    this.w = w
    let kind = 'rect'
    let r = w.rng.num(10, 40)
    let r1 = w.rng.num(10, 40)
    this.collide = new CollideProps(this, [r, r1])
    this.phys = new PointMass({
      coords: w.rngCoords(),
      mass: r * r1 / 80,
      vel: [1, 0]
    })

    let corner = vec.subtract(vec.create(), this.phys.coords, [r / 2, r1 / 2])
    this.shape = new paper.Path.Rectangle(Paper.toPoint(corner), Paper.toSize(this.collide.size))
    this.shape.fillColor = this.scene.rngColor.any()
  }

  shapeUpdate() {

    //console.log("PHYS", this.phys.coords, this.phys.vel)
    let [x, y] = this.phys.coords
    if (isNaN(x) || isNaN(y)) {
      //console.log("NaN bode = ", this.id, this.phys.coords, this.phys.vel, this.phys.force)
    }
    this.shape.position = Paper.toPoint(this.phys.coords)
  }

  onBeforeMove(p: MoveParams) {

  }
}

export class CollideScene extends ui.SceneBase<ui.BaseSceneProps> {
  w: World
  constructor() {
    super({
      defaultProps: {
        canvas: {
          w: 300,
          h: 600,
        }
      },
      uiState: {
        title: 'Rectangles collide',
        actions: {
          Stop() {
            this.stopOnFrame()
          }
        }
      }
    })
  }
  onFrame() {
    console.log(this.w.bodies)
    for (let b of this.w.bodies) {
      (b as RectBody).shapeUpdate()
    }
  }

  onStart() {
    let w = this.w = new World({
      size: [this.props.canvas.w, this.props.canvas.h]
    })
    console.log(this.props)
    let N = 100
    w.massCoef = 0.1
    w.velModifier = VelMods.compose(VelMods.friction(0.4, 0.01), VelMods.limit(0, 5, w.rng))
    for (let i = 0; i < N; i++) {
      let b = new RectBody(w, this)
      w.add(b)
    }
    w.addInteraction({
      interact: impulseCollide(w.rng),
      detect: new RectCollisions(w, w.bodies)
    })
  }
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
