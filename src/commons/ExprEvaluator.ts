import { computeIfAbsent } from "./maps"

export class ExprEvaluator {
  _keys: string[]
  _values: any[]
  _cache = new Map<string, () => any>()

  constructor(ctx: { [k: string]: any }) {
    this._keys = Object.keys(ctx)
    this._values = this._keys.map(k => ctx[k])
  }

  eval(expr: string): any {
    let f = computeIfAbsent(this._cache, expr, e => this._exprToFn(e))
    console.log(f)
    return f()
  }

  _exprToFn(str: string): () => any {
    let factory = new Function(...this._keys, `return () => (${str})`)
    return factory.apply(undefined, this._values)
  }
}
