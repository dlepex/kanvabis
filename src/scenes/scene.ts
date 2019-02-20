import { ExprEvaluator } from "commons/ExprEvaluator"
import { nonNull } from "commons/prelude"

let sceneExprEval: ExprEvaluator

export function setSceneExprEval(evalCtx: { [k: string]: any }) {
  sceneExprEval = new ExprEvaluator(evalCtx)
}

export function evalProp<V>(propValue: V): V {
  if (typeof propValue !== 'string') {
    return propValue
  }
  if (!propValue.startsWith('=')) {
    return propValue
  }
  let expr = propValue.substr(1)
  return sceneExprEval.eval(expr) as V
}
