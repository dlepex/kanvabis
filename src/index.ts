
import { assert } from 'commons/prelude'
import { Random } from 'math/Random'
import { vec2 } from 'math/vec2'
import * as vec from 'math/vec2'
import { collisionScene } from 'scenes/collisions'
import { scene as proximalScene } from 'scenes/proximal'
import * as ui from 'scenes/ui'
import Two from 'two'
import { Types as TwoTypes } from 'two'

window.addEventListener('DOMContentLoaded', () => {
  ui.runScene(proximalScene)

}, true)
