const p = Symbol.for("@ts-pattern/matcher")
  , W = Symbol.for("@ts-pattern/isVariadic")
  , x = "@ts-pattern/anonymous-select-key"
  , B = e => !!(e && typeof e == "object")
  , S = e => e && !!e[p]
  , f = (e, t, r) => {
    if (S(e)) {
        const n = e[p]()
          , {matched: i, selections: s} = n.match(t);
        return i && s && Object.keys(s).forEach(u => r(u, s[u])),
        i
    }
    if (B(e)) {
        if (!B(t))
            return !1;
        if (Array.isArray(e)) {
            if (!Array.isArray(t))
                return !1;
            let n = []
              , i = []
              , s = [];
            for (const u of e.keys()) {
                const h = e[u];
                S(h) && h[W] ? s.push(h) : s.length ? i.push(h) : n.push(h)
            }
            if (s.length) {
                if (s.length > 1)
                    throw new Error("Pattern error: Using `...P.array(...)` several times in a single pattern is not allowed.");
                if (t.length < n.length + i.length)
                    return !1;
                const u = t.slice(0, n.length)
                  , h = i.length === 0 ? [] : t.slice(-i.length)
                  , K = t.slice(n.length, i.length === 0 ? 1 / 0 : -i.length);
                return n.every( (w, j) => f(w, u[j], r)) && i.every( (w, j) => f(w, h[j], r)) && (s.length === 0 || f(s[0], K, r))
            }
            return e.length === t.length && e.every( (u, h) => f(u, t[h], r))
        }
        return Reflect.ownKeys(e).every(n => {
            const i = e[n];
            return (n in t || S(s = i) && s[p]().matcherType === "optional") && f(i, t[n], r);
            var s
        }
        )
    }
    return Object.is(t, e)
}
  , b = e => {
    var t, r, n;
    return B(e) ? S(e) ? (t = (r = (n = e[p]()).getSelectionKeys) == null ? void 0 : r.call(n)) != null ? t : [] : Array.isArray(e) ? O(e, b) : O(Object.values(e), b) : []
}
  , O = (e, t) => e.reduce( (r, n) => r.concat(t(n)), []);
function c(e) {
    return Object.assign(e, {
        optional: () => k(e),
        and: t => a(e, t),
        or: t => N(e, t),
        select: t => t === void 0 ? T(e) : T(t, e)
    })
}
function k(e) {
    return c({
        [p]: () => ({
            match: t => {
                let r = {};
                const n = (i, s) => {
                    r[i] = s
                }
                ;
                return t === void 0 ? (b(e).forEach(i => n(i, void 0)),
                {
                    matched: !0,
                    selections: r
                }) : {
                    matched: f(e, t, n),
                    selections: r
                }
            }
            ,
            getSelectionKeys: () => b(e),
            matcherType: "optional"
        })
    })
}
function a(...e) {
    return c({
        [p]: () => ({
            match: t => {
                let r = {};
                const n = (i, s) => {
                    r[i] = s
                }
                ;
                return {
                    matched: e.every(i => f(i, t, n)),
                    selections: r
                }
            }
            ,
            getSelectionKeys: () => O(e, b),
            matcherType: "and"
        })
    })
}
function N(...e) {
    return c({
        [p]: () => ({
            match: t => {
                let r = {};
                const n = (i, s) => {
                    r[i] = s
                }
                ;
                return O(e, b).forEach(i => n(i, void 0)),
                {
                    matched: e.some(i => f(i, t, n)),
                    selections: r
                }
            }
            ,
            getSelectionKeys: () => O(e, b),
            matcherType: "or"
        })
    })
}
function o(e) {
    return {
        [p]: () => ({
            match: t => ({
                matched: !!e(t)
            })
        })
    }
}
function T(...e) {
    const t = typeof e[0] == "string" ? e[0] : void 0
      , r = e.length === 2 ? e[1] : typeof e[0] == "string" ? void 0 : e[0];
    return c({
        [p]: () => ({
            match: n => {
                let i = {
                    [t ?? x]: n
                };
                return {
                    matched: r === void 0 || f(r, n, (s, u) => {
                        i[s] = u
                    }
                    ),
                    selections: i
                }
            }
            ,
            getSelectionKeys: () => [t ?? x].concat(r === void 0 ? [] : b(r))
        })
    })
}
function l(e) {
    return typeof e == "number"
}
function y(e) {
    return typeof e == "string"
}
function m(e) {
    return typeof e == "bigint"
}
c(o(function(e) {
    return !0
}));
const v = e => Object.assign(c(e), {
    startsWith: t => {
        return v(a(e, (r = t,
        o(n => y(n) && n.startsWith(r)))));
        var r
    }
    ,
    endsWith: t => {
        return v(a(e, (r = t,
        o(n => y(n) && n.endsWith(r)))));
        var r
    }
    ,
    minLength: t => v(a(e, (r => o(n => y(n) && n.length >= r))(t))),
    length: t => v(a(e, (r => o(n => y(n) && n.length === r))(t))),
    maxLength: t => v(a(e, (r => o(n => y(n) && n.length <= r))(t))),
    includes: t => {
        return v(a(e, (r = t,
        o(n => y(n) && n.includes(r)))));
        var r
    }
    ,
    regex: t => {
        return v(a(e, (r = t,
        o(n => y(n) && !!n.match(r)))));
        var r
    }
});
v(o(y));
const g = e => Object.assign(c(e), {
    between: (t, r) => g(a(e, ( (n, i) => o(s => l(s) && n <= s && i >= s))(t, r))),
    lt: t => g(a(e, (r => o(n => l(n) && n < r))(t))),
    gt: t => g(a(e, (r => o(n => l(n) && n > r))(t))),
    lte: t => g(a(e, (r => o(n => l(n) && n <= r))(t))),
    gte: t => g(a(e, (r => o(n => l(n) && n >= r))(t))),
    int: () => g(a(e, o(t => l(t) && Number.isInteger(t)))),
    finite: () => g(a(e, o(t => l(t) && Number.isFinite(t)))),
    positive: () => g(a(e, o(t => l(t) && t > 0))),
    negative: () => g(a(e, o(t => l(t) && t < 0)))
});
g(o(l));
const d = e => Object.assign(c(e), {
    between: (t, r) => d(a(e, ( (n, i) => o(s => m(s) && n <= s && i >= s))(t, r))),
    lt: t => d(a(e, (r => o(n => m(n) && n < r))(t))),
    gt: t => d(a(e, (r => o(n => m(n) && n > r))(t))),
    lte: t => d(a(e, (r => o(n => m(n) && n <= r))(t))),
    gte: t => d(a(e, (r => o(n => m(n) && n >= r))(t))),
    positive: () => d(a(e, o(t => m(t) && t > 0))),
    negative: () => d(a(e, o(t => m(t) && t < 0)))
});
d(o(m));
c(o(function(e) {
    return typeof e == "boolean"
}));
c(o(function(e) {
    return typeof e == "symbol"
}));
c(o(function(e) {
    return e == null
}));
c(o(function(e) {
    return e != null
}));
class P extends Error {
    constructor(t) {
        let r;
        try {
            r = JSON.stringify(t)
        } catch {
            r = t
        }
        super(`Pattern matching error: no pattern matches value ${r}`),
        this.input = void 0,
        this.input = t
    }
}
const E = {
    matched: !1,
    value: void 0
};
function L(e) {
    return new A(e,E)
}
class A {
    constructor(t, r) {
        this.input = void 0,
        this.state = void 0,
        this.input = t,
        this.state = r
    }
    with(...t) {
        if (this.state.matched)
            return this;
        const r = t[t.length - 1]
          , n = [t[0]];
        let i;
        t.length === 3 && typeof t[1] == "function" ? i = t[1] : t.length > 2 && n.push(...t.slice(1, t.length - 1));
        let s = !1
          , u = {};
        const h = (w, j) => {
            s = !0,
            u[w] = j
        }
          , K = !n.some(w => f(w, this.input, h)) || i && !i(this.input) ? E : {
            matched: !0,
            value: r(s ? x in u ? u[x] : u : this.input, this.input)
        };
        return new A(this.input,K)
    }
    when(t, r) {
        if (this.state.matched)
            return this;
        const n = !!t(this.input);
        return new A(this.input,n ? {
            matched: !0,
            value: r(this.input, this.input)
        } : E)
    }
    otherwise(t) {
        return this.state.matched ? this.state.value : t(this.input)
    }
    exhaustive() {
        if (this.state.matched)
            return this.state.value;
        throw new P(this.input)
    }
    run() {
        return this.exhaustive()
    }
    returnType() {
        return this
    }
}
export {L as z};
