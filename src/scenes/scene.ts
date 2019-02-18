import { nonNull } from "commons/prelude"

class ExprEvaluator {
  _keys: string[]
  _values: any[]
  _cache = new Map<string, () => any>()

  constructor(private _ctx: { [k: string]: any }) {
    this._keys = Object.keys(_ctx)
    this._values = this._keys.map(k => _ctx[k])
  }

  eval(expr: string): any {
    let f = this._cache.get(expr)
    if (f == null) {
      f = this._exprToFn(expr)
      this._cache.set(expr, f)
    }
    return f()
  }

  _exprToFn(str: string): () => any {
    let facFn = new Function(...this._keys, `return () => (${str})`)
    return facFn.apply(undefined, this._values)
  }
}

let sceneExprEval: ExprEvaluator

export function setSceneExprEval(evalCtx: { [k: string]: any }) {
  sceneExprEval = new ExprEvaluator(evalCtx)
}

export function evalProp<V>(propValue: V): V {
  if (typeof propValue !== 'string') {
    return propValue
  }
  if (!propValue.startsWith('${') || !propValue.endsWith('}')) {
    return propValue
  }
  let expr = propValue.substr(2, propValue.length - 3)
  return sceneExprEval.eval(expr) as V
}
