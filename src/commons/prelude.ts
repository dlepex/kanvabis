// Most common utilities.

/** for return values only or nested generics. */
export type Undef<T> = T | undefined
export type Maybe<T> = T | undefined | null

export type Mutable<T> = { -readonly [P in keyof T]-?: T[P] }

export function castMutable<T extends {}>(o: T) { return (o as Mutable<T>) }

/** for extra clarity */
export type int = number

export interface Constructor<T> extends Function { new(...args: any[]): T }

export type LoggerFn = (...rest: any[]) => void

export function assert(cond: boolean, msg: string | (() => string), ...args: any[]) {
	if (!cond) {
		const m = (typeof msg === 'function') ? msg() : msg
		console.error(m, args)
		throw StdErr.assertFail(m)
	}
}
export function nonNull<T>(value: T | undefined | null, valueName: string): T {
	if (value == null) {
		let m = `Value ${valueName} is _undefined_ or _null_`
		console.error("")
		throw StdErr.assertFail(m)
	}
	return value!!
}


export const jsonStr = JSON.stringify
export const isArray = Array.isArray

export class StdErr {

	static badArg(arg: string, expectedValueMsg: string, gotValue?: any): Error {
		let m = `arg '${arg}': ${expectedValueMsg}`
		if (gotValue !== undefined) {
			m += `. got: ${gotValue}`
		}
		return { name: 'BadArgError', message: m }
	}

	static assertFail(msg: string): Error {
		return { name: 'AssertFailError', message: msg }
	}
}

export function toInt32(v: string | number | boolean): int {
	return v as any >> 0
}

//
// logging helpers:
//
declare var UtilStdLoggerTrace: { [key: string]: boolean } | undefined

function getTrace(name: string): LoggerFn | undefined {
	if (!UtilStdLoggerTrace) {
		return undefined
	}
	const f = UtilStdLoggerTrace[name]
	if (!f) {
		return undefined
	}
	return console.log
}

const emptyLoggerFn: LoggerFn = () => { }

export function getLogger(name: string): { trace: LoggerFn, isTraceOn: boolean } {
	const trace = getTrace(name)
	return { trace: trace || emptyLoggerFn, isTraceOn: !!trace }
}
