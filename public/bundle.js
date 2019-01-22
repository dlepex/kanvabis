(function (Two) {
    'use strict';

    var Two__default = 'default' in Two ? Two['default'] : Two;

    // "rich random"
    class Random {
        constructor(rfn = Math.random) {
            this.rfn = rfn;
        }
        /** from <= result < to */
        number(from, to) {
            return from + this.rfn() * (to - from);
        }
        /** from <= result < to */
        int(from, to) {
            return Math.floor(from + this.rfn() * (to - from));
        }
        color() {
            const f = this.rfn;
            return 'rgb(' + (Math.floor(f() * 256)) + ',' + (Math.floor(f() * 256)) + ',' + (Math.floor(f() * 256)) + ')';
        }
    }
    //# sourceMappingURL=Random.js.map

    /**
     * Common utilities
     * @module glMatrix
     */
    let ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;

    /**
     * Sets the type of array used when creating new vectors and matrices
     *
     * @param {Type} type Array type, such as Float32Array or Array
     */
    function setMatrixArrayType(type) {
      ARRAY_TYPE = type;
    }

    const degree = Math.PI / 180;

    /**
     * 2 Dimensional Vector
     * @module vec2
     */

    /**
     * Creates a new, empty vec2
     *
     * @returns {vec2} a new 2D vector
     */
    function create() {
      let out = new ARRAY_TYPE(2);
      if(ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
      }
      return out;
    }

    /**
     * Subtracts vector b from vector a
     *
     * @param {vec2} out the receiving vector
     * @param {vec2} a the first operand
     * @param {vec2} b the second operand
     * @returns {vec2} out
     */
    function subtract(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      return out;
    }

    /**
     * Scales a vec2 by a scalar number
     *
     * @param {vec2} out the receiving vector
     * @param {vec2} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {vec2} out
     */
    function scale(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      return out;
    }

    /**
     * Calculates the length of a vec2
     *
     * @param {vec2} a vector to calculate length of
     * @returns {Number} length of a
     */
    function length(a) {
      var x = a[0],
        y = a[1];
      return Math.sqrt(x*x + y*y);
    }

    /**
     * Negates the components of a vec2
     *
     * @param {vec2} out the receiving vector
     * @param {vec2} a vector to negate
     * @returns {vec2} out
     */
    function negate(out, a) {
      out[0] = -a[0];
      out[1] = -a[1];
      return out;
    }

    /**
     * Normalize a vec2
     *
     * @param {vec2} out the receiving vector
     * @param {vec2} a vector to normalize
     * @returns {vec2} out
     */
    function normalize(out, a) {
      var x = a[0],
        y = a[1];
      var len = x*x + y*y;
      if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
      }
      return out;
    }

    /**
     * Calculates the dot product of two vec2's
     *
     * @param {vec2} a the first operand
     * @param {vec2} b the second operand
     * @returns {Number} dot product of a and b
     */
    function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1];
    }

    /**
     * Alias for {@link vec2.length}
     * @function
     */
    const len = length;

    /**
     * Perform some operation over an array of vec2s.
     *
     * @param {Array} a the array of vectors to iterate over
     * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
     * @param {Number} offset Number of elements to skip at the beginning of the array
     * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
     * @param {Function} fn Function to call for each vector in the array
     * @param {Object} [arg] additional argument to pass to fn
     * @returns {Array} a
     * @function
     */
    const forEach = (function() {
      let vec = create();

      return function(a, stride, offset, count, fn, arg) {
        let i, l;
        if(!stride) {
          stride = 2;
        }

        if(!offset) {
          offset = 0;
        }

        if(count) {
          l = Math.min((count * stride) + offset, a.length);
        } else {
          l = a.length;
        }

        for(i = offset; i < l; i += stride) {
          vec[0] = a[i]; vec[1] = a[i+1];
          fn(vec, vec, arg);
          a[i] = vec[0]; a[i+1] = vec[1];
        }

        return a;
      };
    })();

    const degree$1 = Math.PI / 180;
    //# sourceMappingURL=math.js.map

    // INIT {{
    setMatrixArrayType(Float64Array);
    // }}
    function create$1(x = 0.0, y = 0.0) {
        return new Float64Array([x, y]);
    }
    const dot$1 = dot;
    const scale$1 = scale;
    const subtract$1 = subtract;
    const negate$1 = negate;
    const normalize$1 = normalize;
    const neg = negate$1;
    const len$1 = len;
    function set$1(out, x, y) {
        out[0] = x;
        out[1] = y;
        return out;
    }
    function copy$1(out, s) {
        out[0] = s[0];
        out[1] = s[1];
        return out;
    }
    function cloneOr0(s) {
        return copyIfExists(create(), s);
    }
    function clone$1(s) {
        return copy$1(create(), s);
    }
    function copyIfExists(out, s) {
        if (s !== undefined) {
            out[0] = s[0];
            out[1] = s[1];
        }
        return out;
    }
    function inc(out, s) {
        out[0] += s[0];
        out[1] += s[1];
        return out;
    }
    function scaleBy(out, k) {
        out[0] *= k;
        out[1] *= k;
        return out;
    }
    function incScale(out, s, k) {
        out[0] += k * s[0];
        out[1] += k * s[1];
        return out;
    }
    function isZero(v) {
        return v[0] === 0 && v[1] === 0;
    }
    function setLen(out, newlen = 1) {
        const l = len$1(out);
        if (l === 0)
            return false;
        const k = newlen / l;
        out[0] *= k;
        out[1] *= k;
        return true;
    }
    /** random vector of length = 1 */
    function setRand1(r, out) {
        const phi = r.rfn() * (2 * Math.PI);
        out[0] = Math.cos(phi);
        out[1] = Math.sin(phi);
        return out;
    }
    //# sourceMappingURL=vec2.js.map

    function create$2(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
        return [x1, y1, x2, y2];
    }
    function set$2(out, x1, y1, x2, y2) {
        out[0] = x1;
        out[1] = y1;
        out[2] = x2;
        out[3] = y2;
    }
    function intersect(a, b, out) {
        const x1 = Math.max(a[0], b[0]);
        const y1 = Math.max(a[1], b[1]);
        const x2 = Math.min(a[2], b[2]);
        const y2 = Math.min(a[3], b[3]);
        if (x1 > x2 || y1 > y2)
            return false;
        if (out !== undefined) {
            set$2(out, x1, y1, x2, y2);
        }
        return true;
    }
    function setCenter(out, x, y, w, h) {
        w = w / 2;
        h = h / 2;
        set$2(out, x - w, y - h, x + w, y + h);
    }
    function setCenterVec(out, c, size) {
        setCenter(out, c[0], c[1], size[0], size[1]);
    }
    //# sourceMappingURL=bbox.js.map

    /**
     * Physical Properties of a PointMass/Particle
     */
    class PointMass {
        constructor(p) {
            this.id = 0;
            this.coords = cloneOr0(p.coords);
            this.vel = cloneOr0(p.vel);
            this.force = cloneOr0(p.force);
            this.mass = p.mass || 1;
        }
        applyForce(f) { inc(this.force, f); }
        get velScalar() { return len$1(this.vel); }
        _move(p) {
            const moveFn = p.coordsModifier;
            const f = this.force;
            const v = this.vel;
            // v = v + a*dt; where a = F/m, m = mass*world.massCoef
            if (!isZero(f))
                inc(v, scaleBy(f, p.dt / (p.massCoef * this.mass)));
            if (p.velModifier !== undefined)
                p.velModifier(this, p);
            if (isZero(v))
                return;
            moveFn(this, p);
        }
    }
    class CoordMods {
        static non(b, p) {
            const pos = b.coords, v = b.vel, w = p.w, h = p.h;
            incScale(pos, v, p.dt);
        }
        static walls(b, p) {
            const pos = b.coords, v = b.vel, x = pos[0], y = pos[1];
            incScale(pos, v, p.dt);
            const vx = v[0], vy = v[1];
            if ((x < 0 && vx < 0) || (x > p.w && vx > 0)) {
                v[0] *= -1;
            }
            if ((y < 0 && vy < 0) || (y > p.h && vy > 0)) {
                v[1] *= -1;
            }
        }
        static modulo(b, p) {
            const pos = b.coords, v = b.vel, w = p.w, h = p.h;
            incScale(pos, v, p.dt);
            pos[0] = (pos[0] + (w << 8)) % w;
            pos[1] = (pos[1] + (h << 8)) % h;
        }
    }
    class VelMods {
        static limit(min, max, rng) {
            return function (b, p) {
                const v = b.velScalar;
                if (v < min) {
                    if (v === 0) {
                        setRand1(rng, b.vel);
                    }
                    setLen(b.vel, min);
                    return;
                }
                if (v > max) {
                    setLen(b.vel, max);
                    return;
                }
            };
        }
        static friction(threshold, coef) {
            return function (b, p) {
                if (b.velScalar > threshold) {
                    scaleBy(b.vel, 1 - coef);
                }
            };
        }
        static compose2(f1, f2) {
            return function (b, p) {
                f1(b, p);
                f2(b, p);
            };
        }
        static compose(...funcs) {
            return function (b, p) {
                for (const f of funcs) {
                    f(b, p);
                }
            };
        }
    }
    //# sourceMappingURL=body.js.map

    /**
     * Undirected interactions graph, represented as edge set.
     */
    class InterGraph {
        constructor() {
            this.set = new Set();
        }
        clear() { this.set.clear(); }
        static key(a, b) {
            if (a > b) {
                const t = a;
                a = b;
                b = t;
            }
            return (a << 25) + b;
        }
        hasKey(k) {
            return this.set.has(k);
        }
        delete(k) { return this.set.delete(k); }
        has(a, b) { return this.set.has(InterGraph.key(a, b)); }
        /**
         * @returns !has(k) before addition
         */
        addKey(k) {
            const set = this.set;
            if (!set.has(k)) {
                set.add(k);
                return true;
            }
            else {
                return false;
            }
        }
        add(a, b) { return this.addKey(InterGraph.key(a, b)); }
        forEach(cb) {
            this.set.forEach((key) => {
                const mask = (1 << 26) - 1;
                const b = key & mask, a = (key >> 25) & mask;
                cb(a, b, key);
            });
        }
    }
    InterGraph.keyMask = (1 << 26) - 1;
    const dedupGraph = new InterGraph();
    function graphsHas(graphs, key) {
        return graphs.some(g => g.hasKey(key));
    }
    function interLauncher(c) {
        const pr = c.detect;
        const interact = c.interact;
        let exclude;
        const before = c.before;
        if (c.exclude) {
            if (Array.isArray(c.exclude))
                exclude = c.exclude;
            else
                exclude = [c.exclude];
        }
        if (pr.noDedup) {
            return () => {
                if (before !== undefined)
                    before();
                pr.forEach((a, b) => {
                    const k = InterGraph.key(a.phys.id, b.phys.id);
                    if (exclude === undefined || !graphsHas(exclude, k)) {
                        interact(a, b);
                    }
                });
            };
        }
        else {
            return () => {
                if (before !== undefined)
                    before();
                dedupGraph.clear(); // reusing global dedup graph!
                pr.forEach((a, b) => {
                    const k = InterGraph.key(a.phys.id, b.phys.id);
                    if ((exclude === undefined || !graphsHas(exclude, k)) && dedupGraph.addKey(k)) {
                        interact(a, b);
                    }
                });
            };
        }
    }
    class MutualForce {
        constructor(rng) {
            this.rng = rng;
            this.dist = 0;
            this.coordsDif = create$1();
        }
        init(a, b) {
            this.a = a;
            this.b = b;
            subtract$1(this.coordsDif, b.phys.coords, a.phys.coords);
            this.dist = len$1(this.coordsDif);
            return this;
        }
        /**
         * @param scalar if positive - mutual attraction, else - repulsion
         */
        apply(scalar) {
            if (scalar === 0)
                return;
            const f = this.coordsDif;
            const d = this.dist;
            if (d !== 0) {
                scaleBy(f, scalar / this.dist);
            }
            else {
                scaleBy(setRand1(this.rng, f), scalar);
            }
            this.a.phys.applyForce(f);
            neg(f, f);
            this.b.phys.applyForce(f);
        }
    }
    class ElasticCollideCalc {
        constructor(rng) {
            this.rng = rng;
            this.n = create$1();
            this.dn = create$1();
            this.dv = create$1();
        }
        _normalToCollisionLine(a, b, n) {
            if (n === undefined) {
                n = subtract$1(this.n, a.coords, b.coords); // normal to "collision line"
            }
            else {
                n = copy$1(this.n, n);
            }
            if (!isZero(n))
                normalize$1(n, n);
            else
                setRand1(this.rng, n);
            return n;
        }
        central(a, b, n) {
            n = this._normalToCollisionLine(a, b, n);
            const va = len$1(a.vel), vb = len$1(b.vel);
            const ma = a.mass, mb = b.mass, m = ma + mb, dm = ma - mb;
            // result speeds after collision
            const ua = (va * dm + 2 * mb * vb) / m;
            const ub = (-vb * dm + 2 * ma * va) / m;
            scale$1(a.vel, n, ua);
            scale$1(b.vel, n, -ub);
        }
        nonCentral(a, b, n) {
            n = this._normalToCollisionLine(a, b, n);
            const ma = a.mass, mb = b.mass, m = ma + mb;
            let v = a.vel;
            const dv = subtract$1(this.dv, a.vel, b.vel);
            const dn = scale$1(this.dn, n, 2 * dot$1(n, dv) * (mb / m));
            subtract$1(v, v, dn);
            v = b.vel;
            neg(n, n);
            neg(dv, dv);
            subtract$1(v, v, scale$1(dn, n, 2 * dot$1(n, dv) * (ma / m)));
        }
    }
    //# sourceMappingURL=interact.js.map

    // Most common utilities.
    function castMutable(o) { return o; }
    function assert(cond, msg, ...args) {
        if (!cond) {
            const m = (typeof msg === 'function') ? msg() : msg;
            console.error(m, args);
            throw StdErr.assertFail(m);
        }
    }
    function nonNull(value, valueName) {
        if (value == null) {
            let m = `Value ${valueName} is _undefined_ or _null_`;
            console.error("");
            throw StdErr.assertFail(m);
        }
        return value;
    }
    const jsonStr = JSON.stringify;
    class StdErr {
        static badArg(arg, expectedValueMsg, gotValue) {
            let m = `arg '${arg}': ${expectedValueMsg}`;
            if (gotValue !== undefined) {
                m += `. got: ${gotValue}`;
            }
            return { name: 'BadArgError', message: m };
        }
        static assertFail(msg) {
            return { name: 'AssertFailError', message: msg };
        }
    }
    //# sourceMappingURL=prelude.js.map

    class World {
        constructor(c) {
            this._deleteListeners = [];
            this._inters = [];
            this._idCounter = 1;
            this.rng = new Random();
            this.coordsModifier = CoordMods.walls;
            this.massCoef = 1.0;
            this.size = clone$1(c.size);
            const bodiesMap = new Map();
            this._idBodyMap = bodiesMap;
            this.get = (id) => bodiesMap.get(id);
            this.bodies = {
                [Symbol.iterator]() { return bodiesMap.values(); }
            };
            this._moveParams = {
                w: this.size[0],
                h: this.size[1],
                time: 0,
                dt: 0,
                step: -1,
                massCoef: this.massCoef,
                coordsModifier: this.coordsModifier
            };
        }
        rngCoords(dx, dy) {
            dx = dx || this.size[0] / 10;
            dy = dy || this.size[1] / 10;
            const v = create$1();
            v[0] = this.rng.number(dx, this.size[0] - dx);
            v[1] = this.rng.number(dy, this.size[1] - dy);
            return v;
        }
        get step() { return this._moveParams.step; }
        nextStep(dt) {
            const mp = this._moveParams;
            mp.dt = dt;
            mp.time += dt;
            mp.step++;
            mp.massCoef = this.massCoef;
            // 1. apply bodies interactions (collisions/repulsions/attractions etc)
            for (const inter of this._inters) {
                inter._launch();
            }
            // 2. move bodies
            for (const b of this.bodies) {
                if (b.onBeforeMove !== undefined)
                    b.onBeforeMove(mp);
                if (b.stationary)
                    continue;
                mp.coordsModifier = b.coordsModifier || this.coordsModifier;
                mp.velModifier = b.velModifier || this.velModifier;
                const movable = b.phys;
                movable._move(mp);
                set$1(b.phys.force, 0, 0);
            }
        }
        add(b) {
            assert(b.phys.id === 0, "body is already attached");
            const id = this._idCounter++;
            castMutable(b.phys).id = id;
            this._idBodyMap.set(id, b);
            return b;
        }
        delete(b) {
            if (b.phys.id === 0)
                return true; // detached body.
            for (const dl of this._deleteListeners) {
                dl(b);
            }
            this._idBodyMap.delete(b.phys.id);
            castMutable(b.phys).id = 0;
            return true;
        }
        addDeleteListener(listener) {
            this._deleteListeners.push(listener);
        }
        newBodySet() {
            const s = new Set();
            this.addDeleteListener((b) => s.delete(b));
            return s;
        }
        addInteraction(inter) {
            assert(this._inters.every(i => i !== inter), "repeated interaction");
            const r = inter;
            r._launch = interLauncher(inter);
            this._inters.push(r);
        }
        deleteInteraction(inter) {
            this._inters = this._inters.filter(i => i !== inter);
        }
    }

    function sortKD(ids, coords, nodeSize, left, right, axis) {
        if (right - left <= nodeSize)
            return;
        const m = (left + right) >> 1; // middle index
        // sort ids and coords around the middle index so that the halves lie
        // either left/right or top/bottom correspondingly (taking turns)
        select(ids, coords, m, left, right, axis);
        // recursively kd-sort first half and second half on the opposite axis
        sortKD(ids, coords, nodeSize, left, m - 1, 1 - axis);
        sortKD(ids, coords, nodeSize, m + 1, right, 1 - axis);
    }
    // custom Floyd-Rivest selection algorithm: sort ids and coords so that
    // [left..k-1] items are smaller than k-th item (on either x or y axis)
    function select(ids, coords, k, left, right, axis) {
        while (right > left) {
            if (right - left > 600) {
                const n = right - left + 1;
                const m = k - left + 1;
                const z = Math.log(n);
                const s = 0.5 * Math.exp(2 * z / 3);
                const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
                const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
                const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
                select(ids, coords, k, newLeft, newRight, axis);
            }
            const t = coords[2 * k + axis];
            let i = left;
            let j = right;
            swapItem(ids, coords, left, k);
            if (coords[2 * right + axis] > t)
                swapItem(ids, coords, left, right);
            while (i < j) {
                swapItem(ids, coords, i, j);
                i++;
                j--;
                while (coords[2 * i + axis] < t)
                    i++;
                while (coords[2 * j + axis] > t)
                    j--;
            }
            if (coords[2 * left + axis] === t)
                swapItem(ids, coords, left, j);
            else {
                j++;
                swapItem(ids, coords, j, right);
            }
            if (j <= k)
                left = j + 1;
            if (k <= j)
                right = j - 1;
        }
    }
    function swapItem(ids, coords, i, j) {
        swap(ids, i, j);
        swap(coords, 2 * i, 2 * j);
        swap(coords, 2 * i + 1, 2 * j + 1);
    }
    function swap(arr, i, j) {
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    //# sourceMappingURL=sort.js.map

    function range(ids, coords, minX, minY, maxX, maxY, nodeSize, result = []) {
        const stack = [0, ids.length - 1, 0];
        // recursively search for items in range in the kd-sorted arrays
        while (stack.length) {
            const axis = stack.pop();
            const right = stack.pop();
            const left = stack.pop();
            // if we reached "tree node", search linearly
            if (right - left <= nodeSize) {
                for (let i = left; i <= right; i++) {
                    const x = coords[2 * i];
                    const y = coords[2 * i + 1];
                    if (x >= minX && x <= maxX && y >= minY && y <= maxY)
                        result.push(ids[i]);
                }
                continue;
            }
            // otherwise find the middle index
            const m = (left + right) >> 1;
            // include the middle item if it's in range
            const x = coords[2 * m];
            const y = coords[2 * m + 1];
            if (x >= minX && x <= maxX && y >= minY && y <= maxY)
                result.push(ids[m]);
            // queue search in halves that intersect the query
            if (axis === 0 ? minX <= x : minY <= y) {
                stack.push(left);
                stack.push(m - 1);
                stack.push(1 - axis);
            }
            if (axis === 0 ? maxX >= x : maxY >= y) {
                stack.push(m + 1);
                stack.push(right);
                stack.push(1 - axis);
            }
        }
        return result;
    }
    //# sourceMappingURL=range.js.map

    function within(ids, coords, qx, qy, r, nodeSize, result = []) {
        const stack = [0, ids.length - 1, 0];
        const r2 = r * r;
        // recursively search for items within radius in the kd-sorted arrays
        while (stack.length) {
            const axis = stack.pop();
            const right = stack.pop();
            const left = stack.pop();
            // if we reached "tree node", search linearly
            if (right - left <= nodeSize) {
                for (let i = left; i <= right; i++) {
                    if (sqDist(coords[2 * i], coords[2 * i + 1], qx, qy) <= r2)
                        result.push(ids[i]);
                }
                continue;
            }
            // otherwise find the middle index
            const m = (left + right) >> 1;
            // include the middle item if it's in range
            const x = coords[2 * m];
            const y = coords[2 * m + 1];
            if (sqDist(x, y, qx, qy) <= r2)
                result.push(ids[m]);
            // queue search in halves that intersect the query
            if (axis === 0 ? qx - r <= x : qy - r <= y) {
                stack.push(left);
                stack.push(m - 1);
                stack.push(1 - axis);
            }
            if (axis === 0 ? qx + r >= x : qy + r >= y) {
                stack.push(m + 1);
                stack.push(right);
                stack.push(1 - axis);
            }
        }
        return result;
    }
    function sqDist(ax, ay, bx, by) {
        const dx = ax - bx;
        const dy = ay - by;
        return dx * dx + dy * dy;
    }
    //# sourceMappingURL=within.js.map

    const defaultGetX = p => p[0];
    const defaultGetY = p => p[1];
    class KDBush {
        constructor(points, getX = defaultGetX, getY = defaultGetY, nodeSize = 64, ArrayType = Float64Array) {
            this.nodeSize = nodeSize;
            this.points = points;
            const IndexArrayType = points.length < 65536 ? Uint16Array : Uint32Array;
            // store indices to the input array and coordinates in separate typed arrays
            const ids = this.ids = new IndexArrayType(points.length);
            const coords = this.coords = new ArrayType(points.length * 2);
            for (let i = 0; i < points.length; i++) {
                ids[i] = i;
                coords[2 * i] = getX(points[i]);
                coords[2 * i + 1] = getY(points[i]);
            }
            // kd-sort both arrays for efficient search (see comments in sort.js)
            sortKD(ids, coords, nodeSize, 0, ids.length - 1, 0);
        }
        range(minX, minY, maxX, maxY, result = []) {
            return range(this.ids, this.coords, minX, minY, maxX, maxY, this.nodeSize, result);
        }
        within(x, y, r, result = []) {
            return within(this.ids, this.coords, x, y, r, this.nodeSize, result);
        }
    }
    //# sourceMappingURL=index.js.map

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var quickselect = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
    	module.exports = factory();
    }(commonjsGlobal, (function () {
    function quickselect(arr, k, left, right, compare) {
        quickselectStep(arr, k, left || 0, right || (arr.length - 1), compare || defaultCompare);
    }

    function quickselectStep(arr, k, left, right, compare) {

        while (right > left) {
            if (right - left > 600) {
                var n = right - left + 1;
                var m = k - left + 1;
                var z = Math.log(n);
                var s = 0.5 * Math.exp(2 * z / 3);
                var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
                var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
                var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
                quickselectStep(arr, k, newLeft, newRight, compare);
            }

            var t = arr[k];
            var i = left;
            var j = right;

            swap(arr, left, k);
            if (compare(arr[right], t) > 0) swap(arr, left, right);

            while (i < j) {
                swap(arr, i, j);
                i++;
                j--;
                while (compare(arr[i], t) < 0) i++;
                while (compare(arr[j], t) > 0) j--;
            }

            if (compare(arr[left], t) === 0) swap(arr, left, j);
            else {
                j++;
                swap(arr, j, right);
            }

            if (j <= k) left = j + 1;
            if (k <= j) right = j - 1;
        }
    }

    function swap(arr, i, j) {
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    function defaultCompare(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }

    return quickselect;

    })));
    });

    function rbush(maxEntries, format) {
        if (!(this instanceof rbush))
            return new rbush(maxEntries, format);
        // max entries in a node is 9 by default; min node fill is 40% for best performance
        this._maxEntries = Math.max(4, maxEntries || 9);
        this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));
        if (format) {
            this._initFormat(format);
        }
        this.clear();
    }
    rbush.prototype = {
        all: function () {
            return this._all(this.data, []);
        },
        search: function (bbox, result = []) {
            var node = this.data, toBBox = this.toBBox;
            if (!intersects(bbox, node))
                return result;
            var nodesToSearch = [], i, len, child, childBBox;
            while (node) {
                for (i = 0, len = node.children.length; i < len; i++) {
                    child = node.children[i];
                    childBBox = node.leaf ? toBBox(child) : child;
                    if (intersects(bbox, childBBox)) {
                        if (node.leaf)
                            result.push(child);
                        else if (contains(bbox, childBBox))
                            this._all(child, result);
                        else
                            nodesToSearch.push(child);
                    }
                }
                node = nodesToSearch.pop();
            }
            return result;
        },
        collides: function (bbox) {
            var node = this.data, toBBox = this.toBBox;
            if (!intersects(bbox, node))
                return false;
            var nodesToSearch = [], i, len, child, childBBox;
            while (node) {
                for (i = 0, len = node.children.length; i < len; i++) {
                    child = node.children[i];
                    childBBox = node.leaf ? toBBox(child) : child;
                    if (intersects(bbox, childBBox)) {
                        if (node.leaf || contains(bbox, childBBox))
                            return true;
                        nodesToSearch.push(child);
                    }
                }
                node = nodesToSearch.pop();
            }
            return false;
        },
        load: function (data) {
            if (!(data && data.length))
                return this;
            if (data.length < this._minEntries) {
                for (var i = 0, len = data.length; i < len; i++) {
                    this.insert(data[i]);
                }
                return this;
            }
            // recursively build the tree with the given data from scratch using OMT algorithm
            var node = this._build(data.slice(), 0, data.length - 1, 0);
            if (!this.data.children.length) {
                // save as is if tree is empty
                this.data = node;
            }
            else if (this.data.height === node.height) {
                // split root if trees have the same height
                this._splitRoot(this.data, node);
            }
            else {
                if (this.data.height < node.height) {
                    // swap trees if inserted one is bigger
                    var tmpNode = this.data;
                    this.data = node;
                    node = tmpNode;
                }
                // insert the small tree into the large tree at appropriate level
                this._insert(node, this.data.height - node.height - 1, true);
            }
            return this;
        },
        insert: function (item) {
            if (item)
                this._insert(item, this.data.height - 1);
            return this;
        },
        clear: function () {
            this.data = createNode([]);
            return this;
        },
        remove: function (item, equalsFn) {
            if (!item)
                return this;
            var node = this.data, bbox = this.toBBox(item), path = [], indexes = [], i, parent, index, goingUp;
            // depth-first iterative tree traversal
            while (node || path.length) {
                if (!node) { // go up
                    node = path.pop();
                    parent = path[path.length - 1];
                    i = indexes.pop();
                    goingUp = true;
                }
                if (node.leaf) { // check current node
                    index = findItem(item, node.children, equalsFn);
                    if (index !== -1) {
                        // item found, remove the item and condense tree upwards
                        node.children.splice(index, 1);
                        path.push(node);
                        this._condense(path);
                        return this;
                    }
                }
                if (!goingUp && !node.leaf && contains(node, bbox)) { // go down
                    path.push(node);
                    indexes.push(i);
                    i = 0;
                    parent = node;
                    node = node.children[0];
                }
                else if (parent) { // go right
                    i++;
                    node = parent.children[i];
                    goingUp = false;
                }
                else
                    node = null; // nothing found
            }
            return this;
        },
        toBBox: function (item) { return item; },
        compareMinX: compareNodeMinX,
        compareMinY: compareNodeMinY,
        toJSON: function () { return this.data; },
        fromJSON: function (data) {
            this.data = data;
            return this;
        },
        _all: function (node, result) {
            var nodesToSearch = [];
            while (node) {
                if (node.leaf)
                    result.push.apply(result, node.children);
                else
                    nodesToSearch.push.apply(nodesToSearch, node.children);
                node = nodesToSearch.pop();
            }
            return result;
        },
        _build: function (items, left, right, height) {
            var N = right - left + 1, M = this._maxEntries, node;
            if (N <= M) {
                // reached leaf level; return leaf
                node = createNode(items.slice(left, right + 1));
                calcBBox(node, this.toBBox);
                return node;
            }
            if (!height) {
                // target height of the bulk-loaded tree
                height = Math.ceil(Math.log(N) / Math.log(M));
                // target number of root entries to maximize storage utilization
                M = Math.ceil(N / Math.pow(M, height - 1));
            }
            node = createNode([]);
            node.leaf = false;
            node.height = height;
            // split the items into M mostly square tiles
            var N2 = Math.ceil(N / M), N1 = N2 * Math.ceil(Math.sqrt(M)), i, j, right2, right3;
            multiSelect(items, left, right, N1, this.compareMinX);
            for (i = left; i <= right; i += N1) {
                right2 = Math.min(i + N1 - 1, right);
                multiSelect(items, i, right2, N2, this.compareMinY);
                for (j = i; j <= right2; j += N2) {
                    right3 = Math.min(j + N2 - 1, right2);
                    // pack each entry recursively
                    node.children.push(this._build(items, j, right3, height - 1));
                }
            }
            calcBBox(node, this.toBBox);
            return node;
        },
        _chooseSubtree: function (bbox, node, level, path) {
            var i, len, child, targetNode, area, enlargement, minArea, minEnlargement;
            while (true) {
                path.push(node);
                if (node.leaf || path.length - 1 === level)
                    break;
                minArea = minEnlargement = Infinity;
                for (i = 0, len = node.children.length; i < len; i++) {
                    child = node.children[i];
                    area = bboxArea(child);
                    enlargement = enlargedArea(bbox, child) - area;
                    // choose entry with the least area enlargement
                    if (enlargement < minEnlargement) {
                        minEnlargement = enlargement;
                        minArea = area < minArea ? area : minArea;
                        targetNode = child;
                    }
                    else if (enlargement === minEnlargement) {
                        // otherwise choose one with the smallest area
                        if (area < minArea) {
                            minArea = area;
                            targetNode = child;
                        }
                    }
                }
                node = targetNode || node.children[0];
            }
            return node;
        },
        _insert: function (item, level, isNode) {
            var toBBox = this.toBBox, bbox = isNode ? item : toBBox(item), insertPath = [];
            // find the best node for accommodating the item, saving all nodes along the path too
            var node = this._chooseSubtree(bbox, this.data, level, insertPath);
            // put the item into the node
            node.children.push(item);
            extend(node, bbox);
            // split on node overflow; propagate upwards if necessary
            while (level >= 0) {
                if (insertPath[level].children.length > this._maxEntries) {
                    this._split(insertPath, level);
                    level--;
                }
                else
                    break;
            }
            // adjust bboxes along the insertion path
            this._adjustParentBBoxes(bbox, insertPath, level);
        },
        // split overflowed node into two
        _split: function (insertPath, level) {
            var node = insertPath[level], M = node.children.length, m = this._minEntries;
            this._chooseSplitAxis(node, m, M);
            var splitIndex = this._chooseSplitIndex(node, m, M);
            var newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
            newNode.height = node.height;
            newNode.leaf = node.leaf;
            calcBBox(node, this.toBBox);
            calcBBox(newNode, this.toBBox);
            if (level)
                insertPath[level - 1].children.push(newNode);
            else
                this._splitRoot(node, newNode);
        },
        _splitRoot: function (node, newNode) {
            // split root node
            this.data = createNode([node, newNode]);
            this.data.height = node.height + 1;
            this.data.leaf = false;
            calcBBox(this.data, this.toBBox);
        },
        _chooseSplitIndex: function (node, m, M) {
            var i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;
            minOverlap = minArea = Infinity;
            for (i = m; i <= M - m; i++) {
                bbox1 = distBBox(node, 0, i, this.toBBox);
                bbox2 = distBBox(node, i, M, this.toBBox);
                overlap = intersectionArea(bbox1, bbox2);
                area = bboxArea(bbox1) + bboxArea(bbox2);
                // choose distribution with minimum overlap
                if (overlap < minOverlap) {
                    minOverlap = overlap;
                    index = i;
                    minArea = area < minArea ? area : minArea;
                }
                else if (overlap === minOverlap) {
                    // otherwise choose distribution with minimum area
                    if (area < minArea) {
                        minArea = area;
                        index = i;
                    }
                }
            }
            return index;
        },
        // sorts node children by the best axis for split
        _chooseSplitAxis: function (node, m, M) {
            var compareMinX = node.leaf ? this.compareMinX : compareNodeMinX, compareMinY = node.leaf ? this.compareMinY : compareNodeMinY, xMargin = this._allDistMargin(node, m, M, compareMinX), yMargin = this._allDistMargin(node, m, M, compareMinY);
            // if total distributions margin value is minimal for x, sort by minX,
            // otherwise it's already sorted by minY
            if (xMargin < yMargin)
                node.children.sort(compareMinX);
        },
        // total margin of all possible split distributions where each node is at least m full
        _allDistMargin: function (node, m, M, compare) {
            node.children.sort(compare);
            var toBBox = this.toBBox, leftBBox = distBBox(node, 0, m, toBBox), rightBBox = distBBox(node, M - m, M, toBBox), margin = bboxMargin(leftBBox) + bboxMargin(rightBBox), i, child;
            for (i = m; i < M - m; i++) {
                child = node.children[i];
                extend(leftBBox, node.leaf ? toBBox(child) : child);
                margin += bboxMargin(leftBBox);
            }
            for (i = M - m - 1; i >= m; i--) {
                child = node.children[i];
                extend(rightBBox, node.leaf ? toBBox(child) : child);
                margin += bboxMargin(rightBBox);
            }
            return margin;
        },
        _adjustParentBBoxes: function (bbox, path, level) {
            // adjust bboxes along the given tree path
            for (var i = level; i >= 0; i--) {
                extend(path[i], bbox);
            }
        },
        _condense: function (path) {
            // go through the path, removing empty nodes and updating bboxes
            for (var i = path.length - 1, siblings; i >= 0; i--) {
                if (path[i].children.length === 0) {
                    if (i > 0) {
                        siblings = path[i - 1].children;
                        siblings.splice(siblings.indexOf(path[i]), 1);
                    }
                    else
                        this.clear();
                }
                else
                    calcBBox(path[i], this.toBBox);
            }
        },
        _initFormat: function (format) {
            // data format (minX, minY, maxX, maxY accessors)
            // uses eval-type function compilation instead of just accepting a toBBox function
            // because the algorithms are very sensitive to sorting functions performance,
            // so they should be dead simple and without inner calls
            var compareArr = ['return a', ' - b', ';'];
            this.compareMinX = new Function('a', 'b', compareArr.join(format[0]));
            this.compareMinY = new Function('a', 'b', compareArr.join(format[1]));
            this.toBBox = new Function('a', 'return {minX: a' + format[0] +
                ', minY: a' + format[1] +
                ', maxX: a' + format[2] +
                ', maxY: a' + format[3] + '};');
        }
    };
    function findItem(item, items, equalsFn) {
        if (!equalsFn)
            return items.indexOf(item);
        for (var i = 0; i < items.length; i++) {
            if (equalsFn(item, items[i]))
                return i;
        }
        return -1;
    }
    // calculate node's bbox from bboxes of its children
    function calcBBox(node, toBBox) {
        distBBox(node, 0, node.children.length, toBBox, node);
    }
    // min bounding rectangle of node children from k to p-1
    function distBBox(node, k, p, toBBox, destNode) {
        if (!destNode)
            destNode = createNode(null);
        destNode.minX = Infinity;
        destNode.minY = Infinity;
        destNode.maxX = -Infinity;
        destNode.maxY = -Infinity;
        for (var i = k, child; i < p; i++) {
            child = node.children[i];
            extend(destNode, node.leaf ? toBBox(child) : child);
        }
        return destNode;
    }
    function extend(a, b) {
        a.minX = Math.min(a.minX, b.minX);
        a.minY = Math.min(a.minY, b.minY);
        a.maxX = Math.max(a.maxX, b.maxX);
        a.maxY = Math.max(a.maxY, b.maxY);
        return a;
    }
    function compareNodeMinX(a, b) { return a.minX - b.minX; }
    function compareNodeMinY(a, b) { return a.minY - b.minY; }
    function bboxArea(a) { return (a.maxX - a.minX) * (a.maxY - a.minY); }
    function bboxMargin(a) { return (a.maxX - a.minX) + (a.maxY - a.minY); }
    function enlargedArea(a, b) {
        return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) *
            (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
    }
    function intersectionArea(a, b) {
        var minX = Math.max(a.minX, b.minX), minY = Math.max(a.minY, b.minY), maxX = Math.min(a.maxX, b.maxX), maxY = Math.min(a.maxY, b.maxY);
        return Math.max(0, maxX - minX) *
            Math.max(0, maxY - minY);
    }
    function contains(a, b) {
        return a.minX <= b.minX &&
            a.minY <= b.minY &&
            b.maxX <= a.maxX &&
            b.maxY <= a.maxY;
    }
    function intersects(a, b) {
        return b.minX <= a.maxX &&
            b.minY <= a.maxY &&
            b.maxX >= a.minX &&
            b.maxY >= a.minY;
    }
    function createNode(children) {
        return {
            children: children,
            height: 1,
            leaf: true,
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity
        };
    }
    // sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
    // combines selection algorithm with binary divide & conquer approach
    function multiSelect(arr, left, right, n, compare) {
        var stack = [left, right], mid;
        while (stack.length) {
            right = stack.pop();
            left = stack.pop();
            if (right - left <= n)
                continue;
            mid = left + Math.ceil((right - left) / n / 2) * n;
            quickselect(arr, mid, left, right, compare);
            stack.push(left, mid, mid, right);
        }
    }
    //# sourceMappingURL=index.js.map

    class Proximity {
        constructor(maxRadius, bodies, srcBodies = bodies) {
            this.bodies = bodies;
            this.srcBodies = srcBodies;
            this.points = [];
            this.indexMap = new Map();
            if (typeof (maxRadius) === 'number')
                this.maxRadius = maxRadius;
            else
                this.maxRadiusFn = maxRadius;
        }
        forEach(interFn) {
            const points = this.points;
            points.length = 0;
            const indexMap = this.indexMap;
            indexMap.clear();
            let idx = 0;
            for (const b of this.bodies) {
                indexMap.set(idx, b);
                idx++;
                points.push(b.phys.coords);
            }
            const tree = new KDBush(points);
            let r = this.maxRadius;
            const rfn = this.maxRadiusFn;
            const result = [];
            for (const b of this.srcBodies) {
                result.length = 0;
                const pt = b.phys.coords;
                if (rfn !== undefined)
                    r = rfn(b);
                tree.within(pt[0], pt[1], r, result);
                if (result.length !== 0) {
                    for (const idx of result) {
                        const other = nonNull(indexMap.get(idx), "body by index");
                        if (other !== b)
                            interFn(b, other);
                    }
                }
            }
        }
    }
    class CollideProps {
        constructor(_b) {
            this._b = _b;
            this.box = create$2();
            this._step = 0;
            this.minX = 0;
            this.minY = 0;
            this.maxX = 0;
            this.maxY = 0;
        }
        _calcBox(step) {
            if (step === this._step)
                return this;
            this._step = step;
            const b = this._b;
            const sz = b.collideSize;
            if (sz !== undefined) {
                const r = this.box;
                setCenterVec(r, b.phys.coords, sz);
                this.minX = r[0];
                this.minY = r[1];
                this.maxX = r[2];
                this.maxY = r[3];
            }
            return this;
        }
    }
    class RectCollisions {
        constructor(world, bodies, srcBodies = bodies) {
            this.world = world;
            this.bodies = bodies;
            this.srcBodies = srcBodies;
            this.items = [];
        }
        forEach(interact) {
            const tree = new rbush();
            const items = this.items;
            items.length = 0;
            const step = this.world.step;
            for (const b of this.bodies) {
                const p = b.collide;
                if (p === undefined)
                    continue;
                items.push(p._calcBox(step));
            }
            if (items.length === 0)
                return;
            tree.load(items);
            const found = [];
            for (const b of this.srcBodies) {
                const p = b.collide;
                if (p === undefined)
                    continue;
                found.length = 0;
                tree.search(p._calcBox(step), found);
                for (const f of found) {
                    if (f._b === b)
                        continue;
                    interact(b, f._b);
                }
            }
        }
    }
    //# sourceMappingURL=detector.js.map

    //# sourceMappingURL=phys.js.map

    function filterViewCast(it, filter) {
        return new FilterView(it, filter);
    }
    class FilterView {
        constructor(it, filter) {
            this.it = it;
            this.filter = filter;
        }
        *[Symbol.iterator]() {
            const f = this.filter;
            for (let e of this.it) {
                if (f(e))
                    yield e;
            }
        }
    }
    //# sourceMappingURL=collections.js.map

    class TheBody {
        constructor(w, radius) {
            this.id = 0;
            this.red = false;
            this.isNew = false;
            this.w = w;
            const r = radius ? radius : w.rng.int(2, 8);
            this.red = r <= 5;
            // let r1 = w.rng.number(9, 15)
            this.r = r;
            this.collideSize = [r, r];
            this.collide = new CollideProps(this);
            this.phys = new PointMass({
                coords: w.rngCoords(),
                vel: scaleBy(setRand1(w.rng, create$1()), 2),
                mass: r * r / 80
            });
        }
        shapeInit(two) {
            const rng = this.w.rng;
            const r = two.makeCircle(this.phys.coords[0], this.phys.coords[1], this.r * 0.7);
            // let r = two.makeRectangle(this.phys.coords[0], this.phys.coords[1], this.collide.size[0], this.collide.size[1])
            this.shape = r;
            r.linewidth = rng.int(1, 2);
            r.noStroke();
            if (!this.red)
                r.fill = 'black';
            else
                r.fill = color(world.rng.number(0.85, 1), world.rng.number(0, 0.1), 0);
        }
        shapeUpdate(two) {
            if (!this.shape) {
                this.shapeInit(two);
            }
            const t = this.shape.translation;
            // console.log("PHYS", this.phys.coords, this.phys.vel)
            const [x, y] = this.phys.coords;
            if (isNaN(x) || isNaN(y)) {
                console.log("NaN bode = ", this.id, this.phys.coords, this.phys.vel, this.phys.force);
            }
            t.set(this.phys.coords[0], this.phys.coords[1]);
        }
        onBeforeMove(p) {
            /*
            if (p.step % 60 === 0 && (this.id === 10)) {
                this.phys.mass = 100
                this.phys.applyForce(vec.setRandLen(this.w.rng, vec.create(), 40, 50))
            }*/
        }
    }
    const collideSet = new Set();
    let world;
    function runSceneProximal(two, opts) {
        const N = 1500;
        const w = new World({
            size: [opts.w, opts.h]
        });
        world = w;
        w.massCoef = 0.2;
        w.velModifier = VelMods.compose(VelMods.friction(0, 0.0001), VelMods.friction(1, 0.1));
        for (let i = 0; i < N; i++) {
            const b = new TheBody(w);
            w.add(b);
            b.shapeInit(two);
        }
        const nonCollidingBodies = filterViewCast(w.bodies, b => !collideSet.has(b.phys.id));
        w.addInteraction({
            before() {
                collideSet.clear();
            },
            detect: new RectCollisions(w, w.bodies),
            interact: impulseCollide(w.rng)
        });
        w.addInteraction({
            detect: new Proximity(20, nonCollidingBodies),
            interact: vanDerVaals(w.rng),
        });
        two.bind('update', () => {
            const dt = 0.07;
            for (let s = 0; s < 1; s++) {
                w.nextStep(dt);
            }
            for (const _b of w.bodies) {
                const b = _b;
                b.shapeUpdate(two);
            }
        }).play();
    }
    function vanDerVaals(rng) {
        const mf = new MutualForce(rng);
        return function (a, b) {
            if (a.red !== b.red) {
                mf.init(a, b);
                mf.apply(-1); // -04
            }
        };
    }
    const distVec = create$1();
    function impulseCollide(rng) {
        const r = create$2();
        const mf = new MutualForce(rng);
        const collide = new ElasticCollideCalc(rng);
        return function (a, b) {
            const ok = intersect(a.collide.box, b.collide.box, r);
            if (!ok) {
                console.log("rects do not intersect", a.collide.box, b.collide.box);
                return;
            }
            subtract$1(distVec, a.phys.coords, b.phys.coords);
            const d = (a.r + b.r) - len$1(distVec);
            if (d < -0.2) {
                return;
            }
            if (d < 0.5) {
                collide.nonCentral(a.phys, b.phys);
            }
            else {
                collideSet.add(a.id).add(b.id);
                collide.central(a.phys, b.phys);
                mf.init(a, b);
                mf.apply(-0.5);
                //collide.central(a.phys, b.phys)
            }
            //g.add(a.id, b.id)
        };
    }
    function color(r, g, b) {
        return 'rgb(' + (Math.floor(r * 256)) + ',' + (Math.floor(g * 256)) + ',' + (Math.floor(b * 256)) + ')';
    }
    //# sourceMappingURL=proximal.js.map

    window.addEventListener('DOMContentLoaded', function () {
        draw();
    }, true);
    function draw() {
        const elem = document.getElementById('scene_1');
        console.log('elem', elem);
        const width = 400, height = 400;
        const two = new Two__default({ width, height, type: Two.Types.svg }).appendTo(elem);
        runSceneProximal(two, {
            bodies: 300,
            w: width, h: height
        });
    }
    //# sourceMappingURL=index.js.map

}(Two));
//# sourceMappingURL=bundle.js.map
