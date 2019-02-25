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
