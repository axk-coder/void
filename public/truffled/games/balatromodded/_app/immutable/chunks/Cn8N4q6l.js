import { $ as e, B as t, D as n, F as r, M as i, N as a, O as o, Q as s, T as c, V as l, W as u, Z as d, _t as f, at as p, b as m, gt as h, l as g, mt as _, o as ee, p as v, pt as y, s as b, wt as te, xt as ne, yt as re } from "./C1veogOm.js";

import "./VmbG3J7e.js";

import "./xihTtKlq.js";

var x = e => e;

function S(e) {
    let t = e - 1;
    return t * t * t + 1;
}

function C(e) {
    return e < .5 ? 4 * e * e * e : .5 * (2 * e - 2) ** 3 + 1;
}

function w(e) {
    let t = typeof e == `string` && e.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
    return t ? [ parseFloat(t[1]), t[2] || `px` ] : [ e, `px` ];
}

function T(e, {delay: t = 0, duration: n = 400, easing: r = C, amount: i = 5, opacity: a = 0} = {}) {
    let o = getComputedStyle(e), s = +o.opacity, c = o.filter === `none` ? `` : o.filter, l = s * (1 - a), [u, d] = w(i);
    return {
        delay: t,
        duration: n,
        easing: r,
        css: (e, t) => `opacity: ${s - l * t}; filter: ${c} blur(${t * u}${d});`
    };
}

function ie(e, {delay: t = 0, duration: n = 400, easing: r = x} = {}) {
    let i = +getComputedStyle(e).opacity;
    return {
        delay: t,
        duration: n,
        easing: r,
        css: e => `opacity: ${e * i}`
    };
}

function E(e, {delay: t = 0, duration: n = 400, easing: r = S, x: i = 0, y: a = 0, opacity: o = 0} = {}) {
    let s = getComputedStyle(e), c = +s.opacity, l = s.transform === `none` ? `` : s.transform, u = c * (1 - o), [d, f] = w(i), [p, m] = w(a);
    return {
        delay: t,
        duration: n,
        easing: r,
        css: (e, t) => `\n\t\t\ttransform: ${l} translate(${(1 - e) * d}${f}, ${(1 - e) * p}${m});\n\t\t\topacity: ${c - u * t}`
    };
}

function D(e, {delay: t = 0, duration: n = 400, easing: r = S, axis: i = `y`} = {}) {
    let a = getComputedStyle(e), o = +a.opacity, s = i === `y` ? `height` : `width`, c = parseFloat(a[s]), l = i === `y` ? [ `top`, `bottom` ] : [ `left`, `right` ], u = l.map(e => `${e[0].toUpperCase()}${e.slice(1)}`), d = parseFloat(a[`padding${u[0]}`]), f = parseFloat(a[`padding${u[1]}`]), p = parseFloat(a[`margin${u[0]}`]), m = parseFloat(a[`margin${u[1]}`]), h = parseFloat(a[`border${u[0]}Width`]), g = parseFloat(a[`border${u[1]}Width`]);
    return {
        delay: t,
        duration: n,
        easing: r,
        css: e => `overflow: hidden;opacity: ${Math.min(e * 20, 1) * o};${s}: ${e * c}px;padding-${l[0]}: ${e * d}px;padding-${l[1]}: ${e * f}px;margin-${l[0]}: ${e * p}px;margin-${l[1]}: ${e * m}px;border-${l[0]}-width: ${e * h}px;border-${l[1]}-width: ${e * g}px;min-${s}: 0`
    };
}

function ae(e, {delay: t = 0, duration: n = 400, easing: r = S, start: i = 0, opacity: a = 0} = {}) {
    let o = getComputedStyle(e), s = +o.opacity, c = o.transform === `none` ? `` : o.transform, l = 1 - i, u = s * (1 - a);
    return {
        delay: t,
        duration: n,
        easing: r,
        css: (e, t) => `\n\t\t\ttransform: ${c} scale(${1 - l * t});\n\t\t\topacity: ${s - u * t}\n\t\t`
    };
}

re();

var O = _([]), oe = (e, t) => {
    let n = Symbol();
    O.update(r => [ ...r, {
        text: e,
        type: t,
        id: n
    } ]), setTimeout(() => {
        O.update(e => e.filter(e => e.id !== n));
    }, 3e3);
}, se = .8, ce = 5242880;

function le() {
    if (typeof localStorage > `u`) return 0;
    let e = 0;
    try {
        for (let t of Object.keys(localStorage)) {
            let n = localStorage.getItem(t);
            n && (e += (t.length + n.length) * 2);
        }
    } catch {
        return 0;
    }
    return e;
}

function ue() {
    let e = le(), t = ce, n = e / t * 100;
    return {
        usedBytes: e,
        quotaBytes: t,
        percentUsed: n,
        isNearLimit: n > se * 100,
        isExceeded: n >= 100
    };
}

function de(e, t) {
    if (typeof localStorage > `u`) return !1;
    try {
        return localStorage.setItem(e, t), !0;
    } catch (t) {
        if (t instanceof DOMException && (t.name === `QuotaExceededError` || t.code === 22)) return console.warn(`LocalStorage quota exceeded when writing key: ${e}`), 
        !1;
        throw t;
    }
}

function fe() {
    if (typeof localStorage > `u`) return 0;
    let e = [ `thumbnails-cache`, `descriptions-cache` ], t = 0;
    for (let n of e) {
        let e = localStorage.getItem(n);
        if (e) {
            t += (n.length + e.length) * 2;
            try {
                localStorage.removeItem(n);
            } catch {}
        }
    }
    return console.info(`Cleared ${Math.round(t / 1024)}KB from low-priority caches`), 
    t;
}

function pe() {
    let e = ue();
    return e.isExceeded ? (console.warn(`LocalStorage quota exceeded (${Math.round(e.percentUsed)}% used). Clearing caches...`), 
    fe()) : e.isNearLimit && console.info(`LocalStorage approaching limit (${Math.round(e.percentUsed)}% used)`), 
    e;
}

var me = function(e) {
    return e.NameAsc = `name_asc`, e.NameDesc = `name_desc`, e.LastUpdatedAsc = `updated_asc`, 
    e.LastUpdatedDesc = `updated_desc`, e.DownloadsAsc = `downloads_asc`, e.DownloadsDesc = `downloads_desc`, 
    e;
}({}), he = _(!1), ge = _(me.DownloadsDesc), _e = _(``), ve = _({}), ye = _({}), k = _(new Set);

function be(e) {
    k.update(t => {
        let n = new Set(t);
        return n.has(e) ? n.delete(e) : n.add(e), n;
    });
}

function xe(e) {
    k.set(new Set(e));
}

function Se() {
    k.set(new Set);
}

function Ce(e) {
    ye.update(t => ({
        ...t,
        ...e
    }));
}

var we = _({
    show: !1,
    modName: ``,
    modPath: ``,
    dependents: []
}), Te = _(null), Ee = _([]), De = _(1), Oe = _(12), ke = _({
    startPage: 1,
    totalPages: 1,
    maxVisiblePages: 5
});

function Ae(e) {
    if (typeof window > `u`) return [];
    try {
        return JSON.parse(localStorage.getItem(e) || `[]`);
    } catch {
        return [];
    }
}

var je = _({
    steamodded: Ae(`version-cache-steamodded`),
    talisman: Ae(`version-cache-talisman`)
});

typeof window < `u` && je.subscribe(e => {
    try {
        localStorage.setItem(`version-cache-steamodded`, JSON.stringify(e.steamodded)), 
        localStorage.setItem(`version-cache-talisman`, JSON.stringify(e.talisman));
    } catch {}
});

var Me = function(e) {
    return e[e.Content = 0] = `Content`, e[e.Joker = 1] = `Joker`, e[e.QualityOfLife = 2] = `QualityOfLife`, 
    e[e.Technical = 3] = `Technical`, e[e.Miscellaneous = 4] = `Miscellaneous`, e[e.ResourcePacks = 5] = `ResourcePacks`, 
    e[e.API = 6] = `API`, e;
}({}), Ne = _(null), Pe = _(null), Fe = _([]), A = _([]), Ie = !1, j = !1;

async function Le(e) {
    Ie = !0;
    try {
        return await e();
    } finally {
        if (Ie = !1, j) {
            j = !1;
            try {
                M(y(A));
            } catch {}
        }
    }
}

function M(e) {
    try {
        let t = e.map(e => ({
            title: e.title,
            categories: e.categories,
            colors: e.colors,
            requires_steamodded: e.requires_steamodded,
            requires_talisman: e.requires_talisman,
            publisher: e.publisher,
            repo: e.repo,
            downloadURL: e.downloadURL,
            folderName: e.folderName ?? null,
            version: e.version ?? null,
            installed: e.installed,
            last_updated: e.last_updated,
            _dirName: e._dirName,
            _installedPath: e._installedPath,
            _hasThumbnail: e._hasThumbnail ?? !0
        }));
        if (!de(`mods-cache`, JSON.stringify(t))) {
            console.warn(`Failed to persist mods cache due to quota. Clearing cache.`);
            try {
                localStorage.removeItem(`mods-cache`), localStorage.removeItem(`mods-cache-ts`);
            } catch {}
            return;
        }
        let n = Date.now();
        de(`mods-cache-ts`, String(n)), N.set(n);
    } catch {
        try {
            localStorage.removeItem(`mods-cache`), localStorage.removeItem(`mods-cache-ts`);
        } catch {}
    }
}

var Re = _(!1), N = _(null), ze = _(0);

if (typeof window < `u`) {
    try {
        pe();
    } catch {}
    try {
        let e = localStorage.getItem(`mods-cache`);
        if (e) {
            let t = JSON.parse(e);
            Array.isArray(t) && A.set(t);
        }
        let t = localStorage.getItem(`mods-cache-ts`);
        if (t) {
            let e = Number(t);
            Number.isNaN(e) || N.set(e);
        }
    } catch {}
    let e = null;
    A.subscribe(t => {
        e && clearTimeout(e), e = window.setTimeout(() => {
            if (Ie) {
                j = !0;
                return;
            }
            `requestIdleCallback` in window ? window.requestIdleCallback(() => M(t), {
                timeout: 5e3
            }) : M(t);
        }, 2e3);
    });
}

var Be = _({}), Ve = _({});

function He() {
    let e = `Popular`;
    if (typeof window < `u`) try {
        e = localStorage.getItem(`currentCategory`) || `Popular`;
    } catch {}
    let {subscribe: t, set: n} = _(e);
    return {
        subscribe: t,
        set: e => {
            try {
                localStorage.setItem(`currentCategory`, e);
            } catch {}
            n(e);
        }
    };
}

var Ue = He(), We = _({
    visible: !1,
    message: ``,
    onConfirm: () => {},
    onCancel: () => {}
}), Ge = _({
    visible: !1
}), Ke = _({
    visible: !1,
    requiresSteamodded: !1,
    requiresTalisman: !1,
    onProceed: () => {},
    onDependencyClick: () => {}
}), qe = _({
    visible: !1,
    onAcknowledge: () => {},
    onCancel: () => {}
}), Je = _({
    visible: !1,
    currentVersion: ``,
    latestVersion: ``,
    onClose: () => {},
    onDontShow: () => {}
}), Ye = _({
    visible: !1
}), Xe = _({
    visible: !1
}), Ze = _({
    visible: !1,
    backupId: ``,
    backupName: ``
}), Qe = _({
    visible: !1,
    backupId: ``,
    backupName: ``
}), $e = `balatro-web-mod-manager`, P = `mods`, F = `assets`, et = `launch-reports`, I = null;

function tt() {
    return I || (I = new Promise((e, t) => {
        let n = indexedDB.open($e, 2);
        n.onupgradeneeded = () => {
            let e = n.result;
            e.objectStoreNames.contains(`mods`) || e.createObjectStore(P, {
                keyPath: `id`
            }), e.objectStoreNames.contains(`assets`) || e.createObjectStore(F, {
                keyPath: `key`
            }), e.objectStoreNames.contains(`launch-reports`) || e.createObjectStore(et, {
                keyPath: `id`
            });
        }, n.onsuccess = () => e(n.result), n.onerror = () => t(n.error ?? Error(`Unable to open browser mod storage.`));
    }), I);
}

async function L(e, t, n) {
    let r = await tt();
    return new Promise((i, a) => {
        let o = n(r.transaction(e, t).objectStore(e));
        o.onsuccess = () => i(o.result), o.onerror = () => a(o.error ?? Error(`Browser mod storage failed (${e}).`));
    });
}

var R = () => L(P, `readonly`, e => e.getAll()), z = e => L(P, `readwrite`, t => t.put(e)), nt = e => L(P, `readwrite`, t => t.delete(e)), rt = () => L(F, `readonly`, e => e.getAll()), it = e => L(F, `readwrite`, t => t.put(e)), at = e => L(F, `readwrite`, t => t.delete(e)), B = () => L(et, `readonly`, e => e.getAll());

async function ot(e) {
    await nt(e);
    let t = await rt();
    await Promise.all(t.filter(t => t.modId === e).map(e => at(e.key)));
}

var st = 104857600, V = 314572800, ct = 3e3, H = 8192, lt = 134217728, ut = /\.(?:png|jpe?g|webp|bmp)$/i;

function dt(e) {
    let t = e.replaceAll(`\\`, `/`).replace(/^\.\//, ``);
    if (!t || t.startsWith(`/`) || /^[A-Za-z]:/.test(t) || t.split(`/`).some(e => e === `..`)) throw Error(`Unsafe archive path rejected: ${e}`);
    return t.replace(/\/{2,}/g, `/`).replace(/^\/+|\/+$/g, ``);
}

function ft(e, t = ``) {
    let n = `${t} ${e}`.toLowerCase();
    if (/\.tar\.gz\b|\.tgz\b|gzip/.test(n)) return `tgz`;
    if (/\.tar\b/.test(n)) return `tar`;
    if (/\.zip\b|zip/.test(n)) return `zip`;
    throw Error(`Only ZIP, TAR, TAR.GZ, and TGZ mod archives are supported.`);
}

function pt(e) {
    let t = new TextDecoder, n = [], r = 0, i = 0;
    for (;r + 512 <= e.length; ) {
        let a = e.subarray(r, r + 512);
        if (a.every(e => e === 0)) break;
        let o = (e, n) => t.decode(a.subarray(e, e + n)).replace(/\0.*$/, ``).trim(), s = `${o(345, 155)}${o(345, 155) ? `/` : ``}${o(0, 100)}`, c = o(124, 12).replace(/\0/g, ``).trim(), l = Number.parseInt(c || `0`, 8), u = o(156, 1) || `0`;
        if (!Number.isFinite(l) || l < 0 || r + 512 + l > e.length) throw Error(`Malformed TAR archive.`);
        if (u === `1` || u === `2`) throw Error(`Archive links are not supported.`);
        if (u === `0` && s) {
            let t = dt(s);
            if (i += l, n.length + 1 > ct || i > V) throw Error(`Archive exceeds browser decompression limits.`);
            n.push({
                path: t,
                bytes: e.slice(r + 512, r + 512 + l)
            });
        }
        r += 512 + Math.ceil(l / 512) * 512;
    }
    return n;
}

async function mt(e, t, n) {
    if (n.byteLength > st) throw Error(`Archive exceeds the 100 MB compressed-size limit.`);
    let r = ft(e, t), i;
    if (r === `zip`) {
        let e = await window.JSZip.loadAsync(n);
        i = [];
        let t = 0;
        for (let n of Object.values(e.files)) {
            if (n.dir || /(^|\/)__MACOSX\//i.test(n.name)) continue;
            let e = dt(n.name), r = await n.async(`uint8array`);
            if (t += r.byteLength, i.length + 1 > ct || t > V) throw Error(`Archive exceeds browser decompression limits.`);
            i.push({
                path: e,
                bytes: r
            });
        }
    } else {
        let e = new Uint8Array(n);
        if (r === `tgz`) {
            if (!(`DecompressionStream` in window)) throw Error(`This browser cannot decompress TGZ files.`);
            let t = new Blob([ n ]).stream().pipeThrough(new DecompressionStream(`gzip`));
            if (e = new Uint8Array(await new Response(t).arrayBuffer()), e.byteLength > V) throw Error(`Archive exceeds browser decompression limits.`);
        }
        i = pt(e);
    }
    if (!i.length) throw Error(`No mod files were found in this archive.`);
    return {
        files: i,
        type: r
    };
}

function ht(e) {
    if (e.some(e => !e.path.includes(`/`))) return ``;
    let t = new Set(e.map(e => e.path.split(`/`)[0]));
    return t.size === 1 ? `${Array.from(t)[0]}/` : ``;
}

function U(e, t) {
    return String(e ?? ``).replace(/[^A-Za-z0-9_-]+/g, `-`).replace(/^-+|-+$/g, ``).slice(0, 80) || t;
}

function gt(e, t) {
    let n = new TextDecoder, r = new Map;
    for (let i of e.filter(e => /\.json$/i.test(e.path))) try {
        let e = JSON.parse(n.decode(i.bytes)), a = e.id ?? e.ID;
        if (!a || !(e.name || e.Name || e.main_file || e.prefix)) continue;
        let o = i.path.includes(`/`) ? i.path.slice(0, i.path.lastIndexOf(`/`)) : ``, s = Array.isArray(e.dependencies) ? e.dependencies.map(String) : [];
        r.set(o, {
            path: o,
            id: U(a, t),
            name: String(e.name ?? e.Name ?? a),
            dependencies: s,
            priority: Number(e.priority ?? 0)
        });
    } catch {}
    return r.size || r.set(``, {
        path: ``,
        id: U(t, `DownloadedMod`),
        name: t,
        dependencies: [],
        priority: 0
    }), Array.from(r.values()).sort((e, t) => e.priority - t.priority || e.path.localeCompare(t.path));
}

async function _t(e) {
    let t = await crypto.subtle.digest(`SHA-256`, e);
    return Array.from(new Uint8Array(t)).map(e => e.toString(16).padStart(2, `0`)).join(``);
}

async function vt(e, t, n) {
    let r = /(^|\/)assets\/2x\//i.test(n.path) ? 2 : 1, i = `${t}:${r}:${n.path}`;
    try {
        let a = n.bytes.buffer.slice(n.bytes.byteOffset, n.bytes.byteOffset + n.bytes.byteLength), o = await createImageBitmap(new Blob([ a ]));
        if (o.width > H || o.height > H) return o.close(), {
            key: i,
            modId: e,
            archiveHash: t,
            sourcePath: n.path,
            width: 0,
            height: 0,
            scale: r,
            rgba: new ArrayBuffer(0),
            disabledReason: `Texture exceeds ${H}px GPU safety limit.`
        };
        let s = new OffscreenCanvas(o.width, o.height).getContext(`2d`, {
            willReadFrequently: !0
        });
        if (!s) throw Error(`Canvas image decoding is unavailable.`);
        s.clearRect(0, 0, o.width, o.height), s.drawImage(o, 0, 0);
        let c = s.getImageData(0, 0, o.width, o.height).data.slice().buffer, l = {
            key: i,
            modId: e,
            archiveHash: t,
            sourcePath: n.path,
            width: o.width,
            height: o.height,
            scale: r,
            rgba: c
        };
        return o.close(), l;
    } catch (a) {
        return {
            key: i,
            modId: e,
            archiveHash: t,
            sourcePath: n.path,
            width: 0,
            height: 0,
            scale: r,
            rgba: new ArrayBuffer(0),
            disabledReason: `Image decode failed: ${a instanceof Error ? a.message : String(a)}`
        };
    }
}

var yt = Promise.resolve();

async function bt(e) {
    let t = await mt(e.name, e.type ?? ``, e.bytes), n = ht(t.files), r = t.files.map(e => ({
        ...e,
        path: n ? e.path.slice(n.length) : e.path
    })).filter(e => e.path), i = e.displayName || e.name.replace(/\.(?:zip|tar|tar\.gz|tgz)$/i, ``), a = gt(r, i), o = window.JSZip, s = new o;
    for (let e of r) s.file(e.path, e.bytes);
    let c = await s.generateAsync({
        type: `arraybuffer`,
        compression: `DEFLATE`,
        compressionOptions: {
            level: 6
        },
        streamFiles: !0
    }), l = await _t(c), u = [], d = await R();
    for (let n of a) {
        let o = U(n.id, `mod-${Date.now()}`), s = a.length === 1 ? r : r.filter(e => !n.path || e.path === n.path || e.path.startsWith(`${n.path}/`)), f = [], p = s.filter(e => ut.test(e.path)), m = new Set(p.map(e => e.path.toLowerCase())), h = p.filter(e => !/(^|\/)assets\/2x\//i.test(e.path) || !m.has(e.path.replace(/(^|\/)assets\/2x\//i, `$1assets/1x/`).toLowerCase())).sort((e, t) => e.bytes.byteLength - t.bytes.byteLength), g = 0, _ = !1;
        for (let e of h) {
            if (_ || g >= lt) break;
            let t = await vt(o, l, e);
            if (t.disabledReason && f.push(`${e.path}: ${t.disabledReason}`), !(!t.disabledReason && g + t.rgba.byteLength > lt)) try {
                await it(t), g += t.rgba.byteLength;
            } catch (e) {
                f.push(`Raw texture cache quota unavailable; packaged images will decode at launch (${String(e)})`), 
                _ = !0;
            }
        }
        let ee = d.find(e => e.id === o), v = {
            id: o,
            name: n.name || i,
            version: e.version ?? ``,
            fileName: `${o}.zip`,
            size: c.byteLength,
            enabled: ee?.enabled ?? !0,
            lovelyPatches: s.some(e => /(^|\/)lovely(?:\/.*\.toml|\.toml)$/i.test(e.path)),
            fileCount: s.length,
            bytes: c,
            updatedAt: Date.now(),
            path: `webmods://${o}`,
            sourceUrl: e.sourceUrl,
            dependencies: n.dependencies,
            dependencyIds: n.dependencies,
            archiveHash: l,
            archiveType: t.type,
            roots: [ n ],
            processedTextureScales: Array.from(new Set(p.map(e => /(^|\/)assets\/2x\//i.test(e.path) ? 2 : 1))),
            compatibilityStatus: f.length ? `limited` : p.length ? `repaired` : `compatible`,
            warnings: f
        };
        await z(v), u.push(v);
    }
    return u;
}

function xt(e) {
    let t = yt.then(() => bt(e), () => bt(e));
    return yt = t.catch(() => void 0), t;
}

var W = `${location.origin}/api/bmi`, G = 104857600, St = new Map, K = new Map, q = new Map;

function Ct(e, t = `mod`) {
    return String(e ?? ``).replace(/\.[^.]+$/, ``).replace(/[^A-Za-z0-9_-]+/g, `-`).replace(/^-+|-+$/g, ``).slice(0, 80) || t;
}

function J(e) {
    return String(e ?? ``).toLowerCase().replace(/[^a-z0-9]/g, ``);
}

function Y(e) {
    return e ? new URL(e, `https://api-bmi.dasguney.com`).href : ``;
}

function wt(e) {
    return typeof e == `number` ? {
        total: e,
        today: 0
    } : {
        total: Number(e?.total ?? 0),
        today: Number(e?.today ?? 0)
    };
}

function Tt(e) {
    let t = String(e.id ?? e.dir_name ?? e.name ?? `unknown`), n = String(e.name ?? e.title ?? t), r = Y(e.thumbnail_url);
    return St.set(t, e), r && K.set(n, r), {
        dir_name: t,
        meta: {
            title: n,
            author: String(e.author ?? `Unknown`),
            repo: String(e.repo ?? e.homepage ?? ``),
            downloadURL: `bmi://${t}`,
            folderName: String(e.folder_name ?? n.replace(/\s+/g, ``)),
            version: String(e.version ?? ``),
            categories: Array.isArray(e.categories) ? e.categories : [],
            "requires-steamodded": e.requires_steamodded === !0,
            "requires-talisman": e.requires_talisman === !0,
            "last-updated": Number(e.updated_at ?? 0),
            downloads: wt(e.downloads)
        },
        description: String(e.summary ?? e.description ?? ``),
        image_url: r,
        has_thumbnail: !!r
    };
}

async function X(e, t) {
    let n = await fetch(e, t);
    if (!n.ok) throw Error(`Request failed (${n.status}) for ${e}`);
    return n.json();
}

async function Et(e = `downloads_desc`) {
    let t = [], n = ``;
    do {
        let r = new URL(`${W}/mods`);
        r.searchParams.set(`limit`, `200`), r.searchParams.set(`sort`, e), n && r.searchParams.set(`cursor`, n);
        let i = await X(r.href);
        t.push(...i.items ?? []), n = String(i.nextCursor ?? i.next_cursor ?? ``);
    } while (n && t.length < 1e3);
    return t.map(Tt);
}

async function Z(e) {
    if (q.has(e)) return q.get(e);
    let t = await X(`${W}/mods/${encodeURIComponent(e)}`);
    q.set(e, t), St.set(e, t);
    let n = String(t.name ?? t.title ?? e), r = Y(t.thumbnail_url);
    return r && K.set(n, r), t;
}

function Dt(e) {
    let t = e.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
    return t ? {
        owner: t[1],
        repo: t[2].replace(/\.git$/i, ``)
    } : null;
}

async function Ot(e, t = ``) {
    let n = Dt(e);
    if (!n) throw Error(`This mod does not point to a GitHub repository.`);
    let r = (await X(`https://api.github.com/repos/${encodeURIComponent(n.owner)}/${encodeURIComponent(n.repo)}`)).default_branch || `main`, i = t || r, a = e => `https://api.github.com/repos/${encodeURIComponent(n.owner)}/${encodeURIComponent(n.repo)}/git/trees/${encodeURIComponent(e)}?recursive=1`, o;
    try {
        o = await X(a(i));
    } catch (e) {
        if (!t || i === r) throw e;
        i = r, o = await X(a(i));
    }
    if (o.truncated) throw Error(`This repository is too large for the browser installer.`);
    let s = (o.tree ?? []).filter(e => e.type === `blob` && e.path), c = s.reduce((e, t) => e + Number(t.size ?? 0), 0);
    if (!s.length) throw Error(`No files were found in this mod repository.`);
    if (s.length > 3e3 || c > G) throw Error(`This mod is larger than the browser installer limit.`);
    let l = window.JSZip;
    if (!l) throw Error(`The ZIP runtime did not load.`);
    let u = new l, d = 0;
    async function f() {
        for (;d < s.length; ) {
            let e = s[d++].path, t = `https://raw.githubusercontent.com/${encodeURIComponent(n.owner)}/${encodeURIComponent(n.repo)}/${encodeURIComponent(i)}/${e.split(`/`).map(encodeURIComponent).join(`/`)}`, r = await fetch(t);
            if (!r.ok) throw Error(`Could not download ${e}`);
            u.file(e, await r.arrayBuffer());
        }
    }
    return await Promise.all(Array.from({
        length: Math.min(8, s.length)
    }, () => f())), u.generateAsync({
        type: `arraybuffer`,
        compression: `DEFLATE`,
        compressionOptions: {
            level: 6
        },
        streamFiles: !0
    });
}

async function kt(e) {
    let t = await fetch(e);
    if (!t.ok) throw Error(`Download failed (${t.status}).`);
    if (Number(t.headers.get(`content-length`) ?? 0) > G) throw Error(`This mod is larger than the browser installer limit.`);
    let n = await t.arrayBuffer();
    if (n.byteLength > G) throw Error(`This mod is larger than the browser installer limit.`);
    return n;
}

async function At(e) {
    let t = String(e.url ?? ``), n = null, r = ``;
    if (t.startsWith(`bmi://`)) {
        r = t.slice(6), n = await Z(r), t = String(n.download_url ?? ``);
        if (/github\.com\/[^/]+\/[^/]+\/releases\/(?:latest\/download|download)\//i.test(t)) t = `${W}/download/${encodeURIComponent(r)}`;
    }
    if (!t) throw Error(`This mod does not provide a download URL.`);
    let i = String(n?.repo ?? n?.homepage ?? t), a, o = Dt(i) ?? Dt(t);
    if (t.startsWith(`${W}/download/`)) a = await kt(t); else if (o) {
        let e = t.match(/\/archive\/refs\/heads\/(.+)\.zip(?:$|\?)/i);
        a = await Ot(`https://github.com/${o.owner}/${o.repo}`, e?.[1] ?? ``);
    } else a = await kt(t);
    let s = String(e.folderName ?? n?.name ?? n?.title ?? `Downloaded Mod`);
    return (await xt({
        name: `${s}.zip`,
        type: `application/zip`,
        bytes: a,
        displayName: String(n?.name ?? n?.title ?? s),
        version: String(n?.version ?? ``),
        sourceUrl: t
    }))[0]?.path ?? `webmods://${Ct(s, `DownloadedMod`)}`;
}

async function Q(e) {
    let t = String(e ?? ``), n = J(t.replace(/^webmods:\/\//, ``));
    return (await R()).find(e => e.path === t || e.id === t || J(e.name) === n || J(e.id) === n);
}

async function jt(e) {
    let t = await Q(e.modName ?? e.name ?? e.path ?? e.modPath ?? e.rootMod);
    t && await ot(t.id);
}

function $() {
    return localStorage.getItem(`bmm-web-launch-mode`) || `modded`;
}

function Mt() {
    return {
        discord_rpc: !1,
        lovely_console: !1,
        background_enabled: !1,
        compat_helper: !0,
        linux_prefix: ``,
        launch_mode: $(),
        analytics_enabled: !1
    };
}

async function Nt(e, t = {}) {
    let n;
    switch (e) {
      case `get_app_init_data`:
        n = {
            version: `0.4.1-web`,
            existing_installation: `webport://balatro`,
            security_acknowledged: !0,
            lovely_installed: !0,
            lovely_update_available: null,
            launch_mode: $()
        };
        break;

      case `get_app_version`:
        n = `0.4.1`;
        break;

      case `get_all_settings`:
        n = Mt();
        break;

      case `get_launch_mode`:
        n = $();
        break;

      case `set_launch_mode`:
        localStorage.setItem(`bmm-web-launch-mode`, String(t.mode ?? `modded`)), n = null;
        break;

      case `get_balatro_path`:
        n = `webport://balatro`;
        break;

      case `get_mods_folder`:
        n = `Browser storage`;
        break;

      case `is_lovely_installed`:
      case `is_security_warning_acknowledged`:
        n = !0;
        break;

      case `check_steam_running`:
      case `check_balatro_running`:
        n = !1;
        break;

      case `launch_balatro`:
        window.location.assign($() === `vanilla` ? `/games/balatro/index.html` : `/games/balatromodded/play.html?v=lovely-web-12`), 
        n = !0;
        break;

      case `fetch_repo_mods`:
        n = await Et(String(t.sort ?? `downloads_desc`));
        break;

      case `fetch_repo_downloads`:
        {
            let e = await Et(String(t.sort ?? `downloads_desc`));
            n = Object.fromEntries(e.map(e => [ e.dir_name, e.meta.downloads ]));
            break;
        }

      case `get_cached_thumbnails_map`:
        n = Object.fromEntries((t.titles ?? []).map(e => [ e, K.get(e) ]).filter(e => e[1]));
        break;

      case `get_cached_thumbnail_by_title`:
      case `get_cached_installed_thumbnail`:
        n = K.get(String(t.title ?? ``)) ?? null;
        break;

      case `get_repo_thumbnail_url`:
        n = Y((await Z(String(t.dirName ?? ``))).thumbnail_url) || null;
        break;

      case `get_mod_details`:
        {
            let e = await Z(String(t.dirName ?? t.title ?? ``));
            n = {
                description: String(e.description_html ?? e.description ?? e.summary ?? ``),
                requires_steamodded: e.requires_steamodded === !0,
                requires_talisman: e.requires_talisman === !0,
                repo_url: e.repo ?? e.homepage ?? null,
                cached_at_unix: Math.floor(Date.now() / 1e3)
            };
            break;
        }

      case `get_description_cached_or_remote`:
        {
            let e = await Z(String(t.dirName ?? ``));
            n = String(e.description_html ?? e.description ?? e.summary ?? ``);
            break;
        }

      case `get_cached_description_by_title`:
        n = null;
        break;

      case `get_mod_repo_url`:
        {
            let e = await Z(String(t.dirName ?? ``));
            n = e.repo ?? e.homepage ?? null;
            break;
        }

      case `install_mod`:
        n = await At(t);
        break;

      case `add_installed_mod`:
        {
            let e = await Q(t.path ?? t.name);
            e && (e.name = String(t.name ?? e.name), e.version = String(t.currentVersion ?? e.version), 
            e.dependencies = Array.isArray(t.dependencies) ? t.dependencies.map(String) : [], 
            await z(e)), n = null;
            break;
        }

      case `get_installed_mods_from_db`:
        n = (await R()).map(e => ({
            name: e.name,
            path: e.path,
            orphaned: !1
        }));
        break;

      case `check_mod_installation`:
        n = J(t.modType) === `steamodded` || !!await Q(t.modType);
        break;

      case `is_mod_enabled`:
        n = (await Q(t.modName))?.enabled ?? !1;
        break;

      case `toggle_mod_enabled`:
      case `toggle_mod_enabled_by_path`:
        {
            let e = await Q(t.modName ?? t.path ?? t.modPath);
            e && (e.enabled = t.enabled === void 0 ? !e.enabled : !!t.enabled, await z(e)), 
            n = e?.enabled ?? !1;
            break;
        }

      case `enabled_state_map`:
        {
            let e = await R();
            n = Object.fromEntries(e.flatMap(e => [ [ e.name, e.enabled ], [ e.path, e.enabled ] ]));
            break;
        }

      case `toggle_mods_enabled_batch`:
        for (let e of t.enabled ?? []) {
            let t = await Q(e);
            t && (t.enabled = !0, await z(t));
        }
        for (let e of t.disabled ?? []) {
            let t = await Q(e);
            t && (t.enabled = !1, await z(t));
        }
        n = null;
        break;

      case `remove_installed_mod`:
      case `force_remove_mod`:
      case `delete_manual_mod`:
      case `cascade_uninstall`:
        await jt(t), n = null;
        break;

      case `path_exists`:
      case `verify_path_exists`:
        n = !!await Q(t.path);
        break;

      case `get_detected_local_mods`:
        n = [];
        break;

      case `get_latest_launch_report`:
        n = (await B()).sort((e, t) => t.createdAt - e.createdAt)[0] ?? null;
        break;

      case `get_dependents`:
        n = [];
        break;

      case `get_background_state`:
      case `is_background_animation_enabled`:
        n = !1;
        break;

      case `list_backups`:
        n = [];
        break;

      case `get_backups_total_size`:
        n = 0;
        break;

      case `get_backups_directory`:
        n = `Browser storage`;
        break;

      case `check_interrupted_restore`:
        n = null;
        break;

      case `load_mods_cache`:
        n = null;
        break;

      case `load_versions_cache`:
        n = null;
        break;

      case `reconcile_orphan_mods`:
        n = {
            skipped: !0,
            changed: [],
            orphan_total: 0
        };
        break;

      case `mods_state_summary`:
      case `get_state_summary`:
        {
            let e = await R();
            n = {
                installed: e.map(e => ({
                    name: e.name,
                    path: e.path
                })),
                enabled: Object.fromEntries(e.flatMap(e => [ [ e.name, e.enabled ], [ e.path, e.enabled ] ])),
                updates: {},
                thumbnails: Object.fromEntries(e.map(e => [ e.name, K.get(e.name) ]).filter(e => e[1])),
                descriptions: {}
            };
            break;
        }

      case `get_latest_steamodded_release`:
        n = `embedded://Steamodded`;
        break;

      case `get_steamodded_versions`:
        n = [ `1.0.0-beta-1814a` ];
        break;

      case `get_talisman_versions`:
        n = [];
        break;

      case `open_external_url`:
      case `plugin:opener|open_url`:
        window.open(String(t.url ?? ``), `_blank`, `noopener,noreferrer`), n = null;
        break;

      case `clear_app_state`:
        {
            let e = await R();
            await Promise.all(e.map(e => ot(e.id))), n = null;
            break;
        }

      default:
        n = null;
    }
    return n;
}

typeof window < `u` && (window.BalatroBrowserMods = {
    async installFiles(e) {
        let t = [];
        for (let n of Array.from(e)) {
            let e = await xt({
                name: n.name,
                type: n.type,
                bytes: await n.arrayBuffer()
            });
            t.push(...e.map(e => ({
                id: e.id,
                name: e.name,
                warnings: e.warnings ?? []
            })));
        }
        return window.dispatchEvent(new CustomEvent(`balatro-mods-changed`)), t;
    },
    async latestReport() {
        return (await B()).sort((e, t) => t.createdAt - e.createdAt)[0] ?? null;
    },
    async diagnostics() {
        let [e, t, n] = await Promise.all([ R(), rt(), B() ]);
        return {
            databaseVersion: 2,
            mods: e.map(({bytes: e, ...t}) => t),
            assets: t.map(({rgba: e, ...t}) => ({
                ...t,
                rgbaBytes: e.byteLength
            })),
            reports: n.sort((e, t) => t.createdAt - e.createdAt).slice(0, 20)
        };
    }
});

function Pt(e) {
    return e;
}

var Ft = {
    xmlns: `http://www.w3.org/2000/svg`,
    width: 24,
    height: 24,
    viewBox: `0 0 24 24`,
    fill: `none`,
    stroke: `currentColor`,
    "stroke-width": 2,
    "stroke-linecap": `round`,
    "stroke-linejoin": `round`
}, It = e => {
    for (let t in e) if (t.startsWith(`aria-`) || t === `role` || t === `title`) return !0;
    return !1;
}, Lt = (...e) => e.filter((e, t, n) => !!e && e.trim() !== `` && n.indexOf(e) === t).join(` `).trim(), Rt = r(`<svg><!><!></svg>`);

function zt(r, _) {
    let y = ee(_, [ `children`, `$$slots`, `$$events`, `$$legacy` ]), re = ee(y, [ `name`, `color`, `size`, `strokeWidth`, `absoluteStrokeWidth`, `iconNode` ]);
    f(_, !1);
    let x = b(_, `name`, 8, void 0), S = b(_, `color`, 8, `currentColor`), C = b(_, `size`, 8, 24), w = b(_, `strokeWidth`, 8, 2), T = b(_, `absoluteStrokeWidth`, 8, !1), ie = b(_, `iconNode`, 24, () => []);
    g();
    var E = Rt();
    v(E, (e, t, n) => ({
        ...Ft,
        ...e,
        ...re,
        width: C(),
        height: C(),
        stroke: S(),
        "stroke-width": t,
        class: n
    }), [ () => It(re) ? void 0 : {
        "aria-hidden": `true`
    }, () => (t(T()), t(w()), t(C()), u(() => T() ? Number(w()) * 24 / Number(C()) : w())), () => (t(Lt), 
    t(x()), t(y), u(() => Lt(`lucide-icon`, `lucide`, x() ? `lucide-${x()}` : ``, y.class))) ]);
    var D = d(E);
    n(D, 1, ie, o, (e, t) => {
        var n = p(() => te(l(t), 2));
        let r = () => l(n)[0], o = () => l(n)[1];
        var c = a(), u = s(c);
        m(u, r, !0, (e, t) => {
            v(e, () => ({
                ...o()
            }));
        }), i(e, c);
    });
    var ae = e(D);
    c(ae, _, `default`, {}, null), ne(E), i(r, E), h();
}

async function Bt(e) {
    if (e) {
        try {
            await Nt(`open_external_url`, {
                url: e
            });
            return;
        } catch (e) {
            console.warn(`open_external_url failed, falling back to opener plugin`, e);
        }
        try {
            await Nt(`plugin:opener|open_url`, {
                url: e
            });
        } catch {
            window.open(e, `_blank`, `noopener,noreferrer`);
            return;
        }
    }
}

export { Ye as A, we as B, _e as C, ye as D, Ge as E, xe as F, O as G, Je as H, Te as I, E as J, T as K, k as L, Ze as M, Fe as N, A as O, qe as P, We as R, Be as S, Ve as T, Le as U, ve as V, oe as W, D as X, ae as Y, Ne as _, Me as a, Qe as b, Ce as c, Re as d, ze as f, Pe as g, Ue as h, Nt as i, Ke as j, ke as k, je as l, Xe as m, zt as n, me as o, Se as p, ie as q, Pt as r, he as s, Bt as t, N as u, De as v, Oe as w, Ee as x, ge as y, be as z };
