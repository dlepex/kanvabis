
import { assert, int } from 'commons/prelude'

export type RngFn = () => number

export class Random {

  constructor(public get: RngFn = Math.random) { }

  /** from <= double < to */
  num(from = 0, to = 1): number {
    return from + this.get() * (to - from)
  }

  int(from: int, to: int): int {
    return Math.floor(from + this.get() * (from - to))
  }

  pick<T>(a: ArrayLike<T>): T {
    let len = a.length
    assert(len > 0, "")
    if (len === 1) return a[0]
    return a[this.int(0, len)]
  }

  /**
   * intc - Closed interval random integer.
   */
  intc(min: int, max: int): int {
    return Math.floor(min + this.get() * (max - min + 1))
  }

  /**
   * a - "around"
   */
  numa(center: number, delta: number): number {
    return this.num(center - delta, center + delta)
  }

  inta(center: number, delta: number): number {
    return this.intc(center - delta, center + delta)
  }

  bool(): boolean {
    return this.get() < 0.5
  }
}
