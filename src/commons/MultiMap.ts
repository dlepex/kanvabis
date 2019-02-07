import { Bag } from './collections'
import { Constructor } from './prelude'

export class MultiMap<K, V> {
  readonly map: Map<K, Bag<V>> = new Map()

  constructor(readonly bagFactory: () => Bag<V>) { }

  set(k: K, v: V): this {
    let bag = this.map.get(k)
    if (bag === undefined) { bag = this.bagFactory(); this.map.set(k, bag) }
    bag.add(v)
    return this
  }

  delete(k: K, v: V): boolean {
    let bag = this.map.get(k)
    if (bag === undefined) return false
    return bag.delete(v)
  }

  has(k: K, v: V): boolean {
    let bag = this.map.get(k)
    if (bag === undefined) return false
    return bag.has(v)
  }

  forEach(cb: (v: V, k: K) => void) {
    this.map.forEach((bag, k) => {
      for (let v of bag) {
        cb(v, k)
      }
    })
  }
}
