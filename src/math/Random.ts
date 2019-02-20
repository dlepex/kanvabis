
import { int } from 'commons/prelude'

export type RngFn = () => number

// "rich random"
export class Random {

  constructor(public random: RngFn = Math.random) { }

  /** from <= double < to */
  btw(from: number, to: number): number {
    return from + this.random() * (to - from)
  }

  /** min <= integer <= max */
  range(min: int, max: int): int {
    return Math.floor(min + this.random() * (max - min + 1))
  }

  avg(center: number, delta: number): number {
    return this.btw(center - delta, center + delta)
  }

  iavg(center: number, delta: number): number {
    return this.range(center - delta, center + delta)
  }

  bool(): boolean {
    return this.range(0, 1) === 1
  }

  colorRgb(): string {
    let f = this.random
    return 'rgb(' + (Math.floor(f() * 256)) + ',' + (Math.floor(f() * 256)) + ',' + (Math.floor(f() * 256)) + ')'
  }
}
