
import { int } from 'commons/prelude'

export type RngFn = () => number

// "rich random"
export class Random {

  constructor(public rfn: RngFn = Math.random) { }

  /** from <= result < to */
  number(from: int, to: int): int {
    return from + this.rfn() * (to - from)
  }

  /** from <= result < to */
  int(from: int, to: int): int {
    return Math.floor(from + this.rfn() * (to - from))
  }

  colorRgb(): string {
    const f = this.rfn
    return 'rgb(' + (Math.floor(f() * 256)) + ',' + (Math.floor(f() * 256)) + ',' + (Math.floor(f() * 256)) + ')'
  }
}



