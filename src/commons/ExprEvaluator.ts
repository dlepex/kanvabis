import { computeIfAbsent } from "./maps"

export class ExprEvaluator {
  _keys: string[]
  _values: any[]
  _cache = new Map<string, () => any>()

  constructor(private _ctx: { [k: string]: any }) {
    this._keys = Object.keys(_ctx)
    this._values = this._keys.map(k => _ctx[k])
  }

  eval(expr: string): any {
    return computeIfAbsent(this._cache, expr, this._exprToFn)
  }

  _exprToFn(str: string): () => any {
    let factory = new Function(...this._keys, `return () => (${str})`)
    return factory.apply(undefined, this._values)
  }
}
