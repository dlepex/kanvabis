// Most common utilities.

/** for return values only or nested generics. */
export type Undef<T> = T | undefined
export type Maybe<T> = T | undefined | null

export type Mutable<T> = { -readonly [P in keyof T]-?: T[P] }

export function castMutable<T extends {}>(o: T) { return (o as Mutable<T>) }

/** for extra clarity */
export type int = number

export type Constructor<T> = new (...args: any[]) => T

export function toInt32(v: string | number | boolean): int {
  return v as any >> 0
}
export const jsonStr = JSON.stringify
export const isArray = Array.isArray

export function assert(cond: boolean, msg: string | (() => string), ...args: any[]) {
  if (!cond) {
    let m = (typeof msg === 'function') ? msg() : msg
    throw assertFailed(m)
  }
}
export function nonNull<T>(value: T | undefined | null, valueName?: string): T {
  if (value == null) {
    let m = `Value ${valueName} is _undefined_ or _null_`
    throw assertFailed(m)
  }
  return value!!
}

export function invalidArg(arg: string, expectedValueMsg: string, gotValue?: any): Error {
  let m = `Invalid argument '${arg}': ${expectedValueMsg}`
  if (gotValue !== undefined) {
    m += `. got: ${gotValue}`
  }
  return new Error(m)
}

export function assertFailed(msg: string): Error {
  return new Error(`Assert failed ${msg}`)
}
