
declare module 'two' {

	enum Types {
		webgl,
		svg,
		canvas,
	}

	enum Events {
		play,
		pause,
		update,
		render,
		resize,
		change,
		remove,
		insert,
	}



	interface Vector {
		x: number
		y: number
		set(x: number, y: number): void
		copy(): Vector
	}

	class LogicalShape {
		translation: Vector
		rotation: number // radian
		scale: number

		visible: boolean
		linewidth: number
		parent: Group
		vertices: Collection
	}

	export class Shape extends LogicalShape {
		parent: Group

		stroke: string // color
		fill: string // color

		opacity: number // 0-1

		/** http://www.w3.org/TR/SVG/images/painting/linecap.svg */
		cap: string
		/** http://www.w3.org/TR/SVG/images/painting/linejoin.svg */
		join: string
		miter: number

		noStroke(): void
		noFill(): void
		subdivide(): void
	}

	class Polygon extends Shape {
		vertices: Collection
	}

	class Group extends LogicalShape {
		children: Array<any>
	}



	interface Collection extends Array<any> { }

	export interface TwoConstructionParams {
		type?: Types
		width?: number
		height?: number
		autostart?: boolean
		fullscreen?: boolean
	}


	export default class Two {
		type: Types

		width: number
		height: number

		frameCount: number
		timeDelta: number

		constructor(params?: TwoConstructionParams)
		appendTo(element: HTMLElement): Two

		makeLine(x1: number, y1: number, x2: number, y2: number): Shape
		makeRectangle(x: number, y: number, width: number, height: number): Shape
		makeCircle(x: number, y: number, radius: number): Shape
		makeEllipse(x: number, y: number, width: number, height: number): Shape

		makeCurve(x1: number, y1: number, open: boolean): Shape
		makeCurve(x1: number, y1: number, x2: number, y2: number, open: boolean): Shape
		makeCurve(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, open: boolean): Shape

		makePolygon(x1: number, y1: number, x2: number, y2: number, open: boolean): Polygon
		makeGroup(...objects: any[]): Group

		bind(event: Events, callback: (arg?: Array<any>) => void): Two
		unbind(event: Events, callback: (arg?: Array<any>) => void): Two

		play(): void
		pause(): void
		update(): void
		render(): void
		add(): void
		remove(): void
		clear(): void

	}

}

