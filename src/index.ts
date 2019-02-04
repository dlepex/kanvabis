

import { Random } from 'math/Random'
import { vec2 } from 'math/vec2';
import * as vec from 'math/vec2';
import { collisionScene } from 'scenes/collisions';
import { runSceneProximal } from 'scenes/proximal';
import Two from 'two'
import { Types as TwoTypes } from 'two'
import { assert } from 'commons/prelude';
import * as ui from 'scenes/ui'


window.addEventListener('DOMContentLoaded', function () {
  ui.runScene(collisionScene)
}, true);









