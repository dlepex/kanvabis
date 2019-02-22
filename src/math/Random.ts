
import { int } from 'commons/prelude'

export type RngFn = () => number

export class Random {

  constructor(public get: RngFn = Math.random) { }

  /** from <= double < to */
  num(from = 0, to = 1): number {
    return from + this.get() * (to - from)
  }

  /** min <= integer <= max */
  int(min: int, max: int): int {
    return Math.floor(min + this.get() * (max - min + 1))
  }

  avg(center: number, delta: number): number {
    return this.num(center - delta, center + delta)
  }

  iavg(center: number, delta: number): number {
    return this.int(center - delta, center + delta)
  }

  bool(): boolean {
    return this.int(0, 1) === 1
  }

  colorRgb(): string {
    let f = this.get
    return 'rgb(' + (Math.floor(f() * 256)) + ',' + (Math.floor(f() * 256)) + ',' + (Math.floor(f() * 256)) + ')'
  }
}
