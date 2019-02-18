
import commonjs from 'rollup-plugin-commonjs'
import resolve from "rollup-plugin-node-resolve"
import { doesNotThrow } from 'assert';

const path = require('path');
const fs = require('fs')

export default {
  input: 'build/index.js',
  output: {
    file: 'public/build/bundle.js',
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true
  },
  // production && uglify() // minify, but only in production
  plugins: [

    resolve({ jsnext: true }),
    resolveLocalOrVendor(path.resolve("./build")), // build the is a directory of tsc output.
    commonjs(),
  ],

  external: ['two'],
  globals: {
    'two': 'Two',
  },
}

function ensureExt(fn) {
  return fn.endsWith(".js") ? fn : fn + '.js';
}

function subDirs(dir) {
  return fs.readdirSync(dir)
    .filter(f => fs.statSync(path.join(dir, f)).isDirectory())
}

const srcSubDirs = subDirs('src') // ['math', 'phys', 'commons', 'scenes', 'vendor']

/**
 * Typescript (tsc) cannot transform imports into relative form, so...
 */
function resolveLocalOrVendor(basedir) {
  return {
    name: 'ResolveLocalOrVendor', // this name will show up in warnings and errors
    resolveId(importee) {
      if (srcSubDirs.some(r => importee.startsWith(r))) {
        return ensureExt(path.resolve(basedir, importee));
      }
    }
  }
}
