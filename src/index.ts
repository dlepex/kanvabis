

import { Random } from 'math/Random'
import { vec2 } from 'math/vec2';
import * as vec from 'math/vec2';
import { runSceneCollide } from 'scenes/collisions';
import { runSceneProximal } from 'scenes/proximal';
import Two from 'two'
import { Types as TwoTypes } from 'two'
import { assert } from 'commons/prelude';

window.addEventListener('DOMContentLoaded', function () {
  draw()
}, true);


function draw() {
  const elem = document.getElementById('scene_1')
  console.log('elem', elem)
  const width = 400, height = 400
  const bounds: vec2 = vec.mk(width, height)
  const two = new Two({ width, height, type: TwoTypes.svg }).appendTo(elem!)

  runSceneProximal(two, {
    bodies: 300,
    w: width, h: height
  })
}









