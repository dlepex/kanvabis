import * as chroma from 'chroma-js'

import { Random } from "./Random"

export class RandomColor {
  constructor(public rng: Random) { }

  any(): string {
    let rng = this.rng
    return chroma.rgb(rng.intc(0, 255), rng.intc(0, 255), rng.intc(0, 255)).name()
  }

  scale(...colors: string[]): string {
    return chroma.scale(colors)(this.rng.get()).name()
  }
}
