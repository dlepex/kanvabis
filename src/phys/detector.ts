import { int, nonNull } from "commons/prelude";
import * as brect from "math/bbox"
import { Random } from "math/Random";
import { Vec2 } from "math/vec2";
import * as vec from "math/vec2";
import KDBush from 'vendor/kdbush/index.js'
import { rbush } from 'vendor/rbush/index.js'

import { Body, ID, PhysProps } from "./body"
import { InterDetector, InteractFn } from "./interact";
import { World } from "./world";


export class Proximity implements InterDetector {
	maxRadius?: number
	maxRadiusFn?: ((b: Body) => number)
	private points: Vec2[] = []
	private indexMap: Map<int, Body> = new Map()
	constructor(maxRadius: number | ((b: Body) => number),
		private bodies: Iterable<Body>,
		private srcBodies: Iterable<Body> = bodies
	) {
		if (typeof (maxRadius) === 'number') this.maxRadius = maxRadius
		else this.maxRadiusFn = maxRadius
	}

	forEach(interFn: InteractFn) {
		const points = this.points
		points.length = 0

		const indexMap = this.indexMap

		indexMap.clear()
		let idx = 0
		for (const b of this.bodies) {
			indexMap.set(idx, b)
			idx++
			points.push(b.phys.coords)
		}
		const tree = new KDBush(points)
		let r = this.maxRadius
		const rfn = this.maxRadiusFn
		const result: int[] = []
		for (const b of this.srcBodies) {
			result.length = 0
			const pt = b.phys.coords
			if (rfn !== undefined) r = rfn(b)
			tree.within(pt[0], pt[1], r, result)
			if (result.length !== 0) {
				for (const idx of result) {
					const other = nonNull(indexMap.get(idx), "body by index")
					if (other !== b) interFn(b, other)
				}
			}
		}
	}
}

export interface CollidingBody extends Body {
	collideSize?: vec.Vec2Immut
	collide: CollideProps
}

export class CollideProps {
	box: brect.BoundaryBox = brect.create()
	_step = 0
	minX = 0; minY = 0; maxX = 0; maxY = 0

	constructor(public _b: CollidingBody) { }

	_calcBox(step: int) {
		if (step === this._step) return this
		this._step = step
		const b = this._b
		const sz = b.collideSize
		if (sz !== undefined) {
			const r = this.box
			brect.setCenterVec(r, b.phys.coords, sz)
			this.minX = r[0]; this.minY = r[1]; this.maxX = r[2]; this.maxY = r[3]
		}
		return this
	}
}


export class RectCollisions implements InterDetector {
	items: CollideProps[] = []
	constructor(private world: World,
		private bodies: Iterable<Body>,
		private srcBodies: Iterable<Body> = bodies) { }

	forEach(interact: InteractFn) {
		const tree = new rbush()
		const items = this.items
		items.length = 0
		const step = this.world.step
		for (const b of this.bodies) {
			const p = (b as CollidingBody).collide
			if (p === undefined) continue
			items.push(p._calcBox(step))
		}
		if (items.length === 0) return
		tree.load(items)
		const found: CollideProps[] = []
		for (const b of this.srcBodies) {
			const p = (b as CollidingBody).collide
			if (p === undefined) continue
			found.length = 0
			tree.search(p._calcBox(step), found)
			for (const f of found) {
				if (f._b === b) continue
				interact(b, f._b)
			}
		}
	}
}
/**
 * Inefficient/quadratic "detector". Prefer "Proximity" if possible.
 */
export class EachWithEach implements InterDetector {
	noDedup = true

	set: Set<ID> = new Set()

	constructor(private bodies: Iterable<Body>, private srcBodies = bodies) { }

	forEach(interact: InteractFn): void {
		const set = this.set
		set.clear()
		for (const src of this.srcBodies) {
			for (const b of this.bodies) {
				if (src !== b && !set.has(b.phys.id)) {
					interact(src, b)
				}
			}
			set.add(src.phys.id)
		}
	}
}
