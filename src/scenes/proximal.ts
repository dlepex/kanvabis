import * as brect from "math/bbox"
import { Random } from 'math/Random'
import { ID, MoveParams, VelMods } from 'phys/body';
import { InterGraph, InteractFn, MutualForce } from 'phys/interact';
import { Body, CollideProps, CollidingBody, ElasticCollideCalc, PhysProps, PointMass, Proximity, RectCollisions, World } from 'phys/phys'
import Two from 'two'
import { Events, Shape } from 'two'

import { filterViewCast } from "commons/collections";
import { vec2 } from "math/vec2"
import * as Vec from "math/vec2"
import { EachWithEach } from "phys/detector";


class TheBody implements CollidingBody {
	id = 0
	collideSize: Vec.vec2
	collide: CollideProps
	phys: PhysProps
	shape: Shape
	w: World
	r: number

	red = false
	isNew = false


	constructor(w: World, radius?: number) {
		this.w = w
		const kind = "rect"
		const r = radius ? radius : w.rng.int(2, 8)
		this.red = r <= 5;
		// let r1 = w.rng.number(9, 15)
		this.r = r
		this.collideSize = [r, r]
		this.collide = new CollideProps(this)
		this.phys = new PointMass({
			coords: w.rngCoords(),
			vel: Vec.scaleBy(Vec.setRand1(w.rng, Vec.create()), 2),
			mass: r * r / 80
		})
	}

	shapeInit(two: Two) {
		const rng = this.w.rng
		const r = two.makeCircle(this.phys.coords[0], this.phys.coords[1], this.r * 0.7);

		// let r = two.makeRectangle(this.phys.coords[0], this.phys.coords[1], this.collide.size[0], this.collide.size[1])
		this.shape = r
		r.linewidth = rng.int(1, 2)
		r.noStroke()


		if (!this.red) r.fill = 'black'
		else r.fill = color(world.rng.number(0.85, 1), world.rng.number(0, 0.1), 0)
	}

	shapeUpdate(two: Two) {
		if (!this.shape) {
			this.shapeInit(two)
		}
		const t = this.shape.translation
		// console.log("PHYS", this.phys.coords, this.phys.vel)
		const [x, y] = this.phys.coords
		if (isNaN(x) || isNaN(y)) {
			console.log("NaN bode = ", this.id, this.phys.coords, this.phys.vel, this.phys.force)
		}
		t.set(this.phys.coords[0], this.phys.coords[1]);
	}

	onBeforeMove(p: MoveParams) {
		/*
		if (p.step % 60 === 0 && (this.id === 10)) {
			this.phys.mass = 100
			this.phys.applyForce(vec.setRandLen(this.w.rng, vec.create(), 40, 50))
		}*/

	}
}

const collideSet = new Set<ID>()
let world: World
export function runSceneProximal(two: Two, opts: {
	bodies?: number, w: number, h: number,
}) {
	const N = 1500

	const w = new World({
		size: [opts.w, opts.h]
	})
	world = w
	w.massCoef = 0.2
	w.velModifier = VelMods.compose(VelMods.friction(0, 0.0001), VelMods.friction(1, 0.1))
	for (let i = 0; i < N; i++) {
		const b = new TheBody(w)
		w.add(b)
		b.shapeInit(two)
	}

	const nonCollidingBodies: Iterable<TheBody> = filterViewCast(w.bodies, b => !collideSet.has(b.phys.id))

	w.addInteraction({
		before() {
			collideSet.clear()
		},
		detect: new RectCollisions(w, w.bodies),
		interact: impulseCollide(w.rng)
	})

	w.addInteraction({
		detect: new Proximity(20, nonCollidingBodies), //new Proximity(30, nonCollidingBodies),
		interact: vanDerVaals(w.rng),
	})

	two.bind('update' as any, () => {

		const dt = 0.07

		for (let s = 0; s < 1; s++) {
			w.nextStep(dt)
		}

		for (const _b of w.bodies) {
			const b: TheBody = _b as any
			b.shapeUpdate(two)
		}
	}).play()

}

function vanDerVaals(rng: Random): InteractFn {
	const mf = new MutualForce(rng)
	return function (a: TheBody, b: TheBody) {
		if (a.red !== b.red) {
			mf.init(a, b)
			const d = mf.dist
			mf.apply(-1)  // -04
		}
	}
}

const distVec = Vec.create()
function impulseCollide(rng: Random): InteractFn {
	const r = brect.create()
	const mf = new MutualForce(rng)
	const collide = new ElasticCollideCalc(rng)
	return function (a: TheBody, b: TheBody) {
		const ok = brect.intersect(a.collide.box, b.collide.box, r)

		Vec.subtract(distVec, a.phys.coords, b.phys.coords)
		const d = (a.r + b.r) - Vec.len(distVec)

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
