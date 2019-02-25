import * as chroma from 'chroma-js'
import { ExprEvaluator } from "commons/ExprEvaluator"
import { Maybe, Undef, int, jsonStr, nonNull } from 'commons/prelude'
import * as _ from 'lodash-es'
import { Random } from "math/random"
import * as RR from "math/random"
import { RandomColor } from 'math/randomColor'

export abstract class SceneBase {
  readonly rng = new Random()
  readonly rngColor = new RandomColor(this.rng)
  _evalCtx = { rng: this.rng, rngColor: this.rngColor, chroma, Math }
  _eval = new ExprEvaluator(this._evalCtx)
  readonly ui: SceneUI

  constructor(readonly config: SceneConfig) {
    this.ui = SceneUI.obj
  }

  evalProp<V>(propValue: V): V {
    if (typeof propValue !== 'string') {
      return propValue
    }
    if (!propValue.startsWith('=')) {
      return propValue
    }
    let expr = propValue.substr(1)
    return this._eval.eval(expr) as V
  }

  abstract run(): void
}

interface SceneUIState {
  title: string
  actions?: { [key: string]: () => any } // btnTitle -> onlick handler.
}

export interface SceneConfig<P = object> {
  uiState: SceneUIState
  defaultProps: P
  presetProps?: { [key: string]: P }
}

export function runScene(sc: SceneBase) {
  SceneUI.obj.runScene(sc)
}

declare const JSONEditor: any

/**
 * Singleton.
 */
class SceneUI {

  static _obj: SceneUI
  _titleEl: HTMLElement
  _buttonsEl: HTMLElement
  _statLine: HTMLElement
  _editor: any // JSONEditor
  _scene: SceneBase

  static get obj() {
    return SceneUI._obj ? SceneUI._obj : (SceneUI._obj = new SceneUI())
  }

  constructor() {
    let el = (id: string) => nonNull(document.getElementById(id))
    this._titleEl = el('sceneTitle')
    this._buttonsEl = el('sceneButtons')
    this._statLine = el('sceneStatusLine')

    this._editor = new JSONEditor(el('jsonEditor'), {
      mode: 'form'
    })
    let ed = this._editor

    el('jsonMode').onclick = () => {
      if (ed.getMode() === 'form') ed.setMode('code')
      else ed.setMode('form')
    }

    el('jsonReload').onclick = () => {
      this._storeProps()
      window.location.reload(false)
    }
  }

  get props(): Maybe<object> {
    let j = this._editor.get()
    return !_.isEmpty(j) ? j : undefined
  }

  set props(p: Maybe<object>) {
    this._editor.set(p)
  }

  runScene(scene: SceneBase) {
    this.resetState(scene.config.uiState)
    this._scene = scene
    if (!this.props) {
      this.props = this._loadProps() || scene.config.defaultProps
    }
    scene.run()
  }

  resetState(state: SceneUIState) {
    if (this._buttonsEl.childNodes.length !== 0) {
      Array.from(this._buttonsEl.childNodes).forEach((child) => child.remove())
    }
    if (state.title) {
      this._titleEl.innerText = state.title
    }
    if (state.actions) {
      for (let [btnName, onclick] of Object.entries(state.actions)) {
        let btn = document.createElement('button')
        btn.innerText = btnName
        btn.id = `btn-${btn}`
        btn.onclick = onclick
        this._buttonsEl.appendChild(btn)
      }
    }
  }

  set statusLine(text: string) {
    this._statLine.innerText = text
  }

  _storeProps() {
    let k = this._scene.config.uiState.title
    window.sessionStorage.setItem(k, jsonStr(this.props))
  }

  _loadProps(): Undef<object> {
    let k = this._scene.config.uiState.title
    let str = window.sessionStorage.getItem(k)
    if (!str) return undefined
    let obj = JSON.parse(str)
    return !_.isEmpty(obj) ? obj : undefined
  }
}
