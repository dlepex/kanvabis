import { int } from "commons/prelude"

export function filterView<E>(it: Iterable<E>, filter: (b: E) => boolean): Iterable<E> {
  return new FilterView(it, filter)
}

export function filterViewCast<E, E1 extends E>(it: Iterable<E>, filter: (b: E) => boolean): Iterable<E1> {
  return (new FilterView(it, filter) as any) as Iterable<E1>
}

class FilterView<E> implements Iterable<E> {
  constructor(private it: Iterable<E>, private filter: (b: E) => boolean) { }
  *[Symbol.iterator](): Iterator<E> {
    let f = this.filter
    for (let e of this.it) {
      if (f(e)) yield e
    }
  }
}

export interface Bag<V> extends Iterable<V> {
  size: int
  add(v: V): Bag<V>
  delete(v: V): boolean
  has(v: V): boolean
}

export function isObjEmpty(o: object) {
  return Object.keys(o).length === 0
}
