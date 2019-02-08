import { Maybe, Undef, jsonStr, nonNull, int } from 'commons/prelude'
import * as _ from 'lodash-es'

interface SceneUIState {
  title: string
  actions?: { [key: string]: () => any } // btnTitle -> onlick handler.
}

export interface Scene<P = object> {
  uiState: SceneUIState
  defaultProps: P
  presets?: { [key: string]: P }
  run(): void
}

export interface CanvasProps {
  width: int
  heigh: int
}

export function runScene(sc: Scene) {
  SceneUI.obj.runScene(sc)
}


declare const JSONEditor: any
/**
 * Singleton.
 */
export class SceneUI {

  static _obj: SceneUI
  _titleEl: HTMLElement
  _buttonsEl: HTMLElement
  _statLine: HTMLElement
  _editor: any // JSONEditor
  _scene: Scene

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

  runScene(scene: Scene) {
    this.resetState(scene.uiState)
    this._scene = scene
    if (!this.props) {
      this.props = this._loadProps() || scene.defaultProps
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
    let k = this._scene.uiState.title
    window.sessionStorage.setItem(k, jsonStr(this.props))
  }

  _loadProps(): Undef<object> {
    let k = this._scene.uiState.title
    let str = window.sessionStorage.getItem(k)
    if (!str) return undefined
    let obj = JSON.parse(str)
    return !_.isEmpty(obj) ? obj : undefined
  }
}
