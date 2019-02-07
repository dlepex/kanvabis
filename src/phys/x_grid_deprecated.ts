import { int } from 'commons/prelude'

export class GridCell<BodyID, Body extends { id: BodyID }> {
  bodies: Map<BodyID, Body> = new Map()
  _shape: any
}

// i1, i2, j1, j2
export type GridRect = [int, int, int, int]

export function gridRectEq(a: GridRect, b: GridRect): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3]
}

function cellIdx(x: number, max: int, cellSize: int) {
  return Math.min(Math.max(0, Math.floor(x / cellSize)), max)
}

export class Grid<BodyID, Body extends { id: BodyID }> {
  cells: Array<GridCell<BodyID, Body>>

  constructor(public rows: int, public cols: int, public cellSize: number) {
    this.cells = new Array(rows * cols)
    for (let i = 0; i < this.cells.length; i++) this.cells[i] = new GridCell()
  }

  cellAt(i: int, j: int): GridCell<BodyID, Body> {
    return this.cells[i * this.cols + j]
  }

  setGridRect(g: GridRect, r: GridRect) {
    // tslint:disable-next-line:one-variable-per-declaration
    const imax = this.rows - 1, jmax = this.cols - 1, c = this.cellSize
    g[0] = cellIdx(r[1], imax, c)
    g[1] = cellIdx(r[1] + r[3], imax, c)
    g[2] = cellIdx(r[0], jmax, c)
    g[3] = cellIdx(r[0] + r[2], jmax, c)
  }

  forCells(g: GridRect, fn: (c: GridCell<BodyID, Body>, i: number, j: number) => void) {
    for (let i = g[0]; i <= g[1]; i++) {
      for (let j = g[2]; j <= g[3]; j++) {
        fn(this.cellAt(i, j), i, j)
      }
    }
  }

  forAllCells(fn: (c: GridCell<BodyID, Body>, i: number, j: number) => void) {
    this.forCells([0, this.rows - 1, 0, this.cols - 1], fn)
  }

  add(b: Body, r: GridRect) {
    this.forCells(r, (c) => c.bodies.set(b.id, b))
  }

  remove(b: Body, r: GridRect) {
    this.forCells(r, (c) => c.bodies.delete(b.id))
  }

  collisions(b: Body, r: GridRect, m: Map<BodyID, Body>) {
    this.forCells(r, (c) => {
      c.bodies.forEach((o, id) => {
        if (id !== b.id) { m.set(id, o) }
      })
    })
  }
}
