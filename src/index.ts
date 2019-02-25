
import { assert } from 'commons/prelude'
import { Random } from 'math/random'
import { vec2 } from 'math/vec2'
import * as vec from 'math/vec2'
import { CollideScene } from 'scenes/collisions'
import * as ui from 'scenes/scene'
import Two from 'two'
import { Types as TwoTypes } from 'two'

window.addEventListener('DOMContentLoaded', () => {
  ui.runScene(new CollideScene())
}, true)
