import { Undef, int } from "./prelude"

export class IDSet<E, ID = any> implements Iterable<E> {
  constructor(private _id: (e: E) => ID, public map: Map<ID, E> = new Map()) {
  }
  get size(): int { return this.map.size }
  add(b: E): this {
    this.map.set(this._id(b), b)
    return this
  }
  delete(b: E): boolean { return this.map.delete(this._id(b)) }
  has(b: E): boolean { return this.map.has(this._id(b)) }
  get(id: ID): Undef<E> { return this.map.get(id) }
  clear() { this.map.clear() }
  [Symbol.iterator](): IterableIterator<E> { return this.map.values() }
}
