import * as chroma from 'chroma-js'
import { ExprEvaluator } from "commons/ExprEvaluator"
import { nonNull } from "commons/prelude"
import { Random } from "math/Random"
import * as RR from "math/Random"

export const rng = new Random()
let w: any = window
w["CC"] = chroma
w["RR"] = RR

export const sceneEvalCtx = { rng, chr: chroma, math: Math }
let sceneExprEval: ExprEvaluator = new ExprEvaluator(sceneEvalCtx)

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
