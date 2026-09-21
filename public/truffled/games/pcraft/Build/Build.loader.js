function createUnityInstance(n,t,d){function f(e,n){if(!f.aborted&&t.showBanner)return"error"==n&&(f.aborted=!0),t.showBanner(e,n);switch(n){case"error":console.error(e);break;case"warning":console.warn(e);break;default:console.log(e)}}function r(e){var n=e.reason||e.error,t=n?n.toString():e.message||e.reason||"",r=n&&n.stack?n.stack.toString():"";(t+="\n"+(r=r.startsWith(t)?r.substring(t.length):r).trim())&&p.stackTraceRegExp&&p.stackTraceRegExp.test(t)&&w(t,e.filename||n&&(n.fileName||n.sourceURL)||"",e.lineno||n&&(n.lineNumber||n.line)||0)}function e(e,n,t){var r=e[n];void 0!==r&&r||(console.warn('Config option "'+n+'" is missing or empty. Falling back to default value: "'+t+'". Consider updating your WebGL template to include the missing config option.'),e[n]=t)}d=d||function(){};var o,p={canvas:n,webglContextAttributes:{preserveDrawingBuffer:!1,powerPreference:2},streamingAssetsUrl:"StreamingAssets",downloadProgress:{},deinitializers:[],intervals:{},setInterval:function(e,n){e=window.setInterval(e,n);return this.intervals[e]=!0,e},clearInterval:function(e){delete this.intervals[e],window.clearInterval(e)},preRun:[],postRun:[],print:function(e){console.log(e)},printErr:function(e){console.error(e),"string"==typeof e&&-1!=e.indexOf("wasm streaming compile failed")&&(-1!=e.toLowerCase().indexOf("mime")?f('HTTP Response Header "Content-Type" configured incorrectly on the server for file '+p.codeUrl+' , should be "application/wasm". Startup time performance will suffer.',"warning"):f('WebAssembly streaming compilation failed! This can happen for example if "Content-Encoding" HTTP header is incorrectly enabled on the server for file '+p.codeUrl+", but the file is not pre-compressed on disk (or vice versa). Check the Network tab in browser Devtools to debug server header configuration.","warning"))},locateFile:function(e){return e},disabledCanvasEvents:["contextmenu","dragstart"]};for(o in e(t,"companyName","Unity"),e(t,"productName","WebGL Player"),e(t,"productVersion","1.0"),t)p[o]=t[o];p.streamingAssetsUrl=new URL(p.streamingAssetsUrl,document.URL).href;var i=p.disabledCanvasEvents.slice();function s(e){e.preventDefault()}i.forEach(function(e){n.addEventListener(e,s)}),window.addEventListener("error",r),window.addEventListener("unhandledrejection",r);var a="",l="";function u(e){document.webkitCurrentFullScreenElement===n?n.style.width&&(a=n.style.width,l=n.style.height,n.style.width="100%",n.style.height="100%"):a&&(n.style.width=a,n.style.height=l,l=a="")}document.addEventListener("webkitfullscreenchange",u),p.deinitializers.push(function(){for(var e in p.disableAccessToMediaDevices(),i.forEach(function(e){n.removeEventListener(e,s)}),window.removeEventListener("error",r),window.removeEventListener("unhandledrejection",r),document.removeEventListener("webkitfullscreenchange",u),p.intervals)window.clearInterval(e);p.intervals={}}),p.QuitCleanup=function(){for(var e=0;e<p.deinitializers.length;e++)p.deinitializers[e]();p.deinitializers=[],"function"==typeof p.onQuit&&p.onQuit()};var c={Module:p,SetFullscreen:function(){if(p.SetFullscreen)return p.SetFullscreen.apply(p,arguments);p.print("Failed to set Fullscreen mode: Player not loaded yet.")},SendMessage:function(){if(p.SendMessage)return p.SendMessage.apply(p,arguments);p.print("Failed to execute SendMessage: Player not loaded yet.")},Quit:function(){return new Promise(function(e,n){p.shouldQuit=!0,p.onQuit=e})},GetMetricsInfo:function(){var e=p._getMetricsInfo(),n=e+4,t=n+4,r=t+8,o=r+8,i=o+4,s=i+4,a=s+8,d=a+8,f=d+4,l=f+4,u=l+4;return{totalWASMHeapSize:p.HEAPU32[e>>2],usedWASMHeapSize:p.HEAPU32[n>>2],totalJSHeapSize:p.HEAPF64[t>>3],usedJSHeapSize:p.HEAPF64[r>>3],pageLoadTime:p.HEAPU32[o>>2],pageLoadTimeToFrame1:p.HEAPU32[i>>2],fps:p.HEAPF64[s>>3],movingAverageFps:p.HEAPF64[a>>3],assetLoadTime:p.HEAPU32[d>>2],webAssemblyStartupTime:p.HEAPU32[f>>2]-(p.webAssemblyTimeStart||0),codeDownloadTime:p.HEAPU32[l>>2],gameStartupTime:p.HEAPU32[u>>2],numJankedFrames:p.HEAPU32[u+4>>2]}}};function w(e,n,t){-1==e.indexOf("fullscreen error")&&(p.startupErrorHandler?p.startupErrorHandler(e,n,t):p.errorHandler&&p.errorHandler(e,n,t)||(console.log("Invoking error handler due to\n"+e),"function"==typeof dump&&dump("Invoking error handler due to\n"+e),w.didShowErrorMessage||(-1!=(e="An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was:\n"+e).indexOf("DISABLE_EXCEPTION_CATCHING")?e="An exception has occurred, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project WebGL player settings to be able to catch the exception or see the stack trace.":-1!=e.indexOf("Cannot enlarge memory arrays")?e="Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings.":-1==e.indexOf("Invalid array buffer length")&&-1==e.indexOf("Invalid typed array length")&&-1==e.indexOf("out of memory")&&-1==e.indexOf("could not allocate memory")||(e="The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings."),alert(e),w.didShowErrorMessage=!0)))}function h(e,n){if("symbolsUrl"!=e){var t=p.downloadProgress[e],r=(t=t||(p.downloadProgress[e]={started:!1,finished:!1,lengthComputable:!1,total:0,loaded:0}),"object"!=typeof n||"progress"!=n.type&&"load"!=n.type||(t.started||(t.started=!0,t.lengthComputable=n.lengthComputable),t.total=n.total,t.loaded=n.loaded,"load"==n.type&&(t.finished=!0)),0),o=0,i=0,s=0,a=0;for(e in p.downloadProgress){if(!(t=p.downloadProgress[e]).started)return;i++,t.lengthComputable?(r+=t.loaded,o+=t.total,s++):t.finished||a++}d(.9*(i?(i-a-(o?s*(o-r)/o:0))/i:0))}}p.SystemInfo=function(){var e,n,t,r,o=navigator.userAgent+" ",i=[["Firefox","Firefox"],["OPR","Opera"],["Edg","Edge"],["SamsungBrowser","Samsung Browser"],["Trident","Internet Explorer"],["MSIE","Internet Explorer"],["Chrome","Chrome"],["CriOS","Chrome on iOS Safari"],["FxiOS","Firefox on iOS Safari"],["Safari","Safari"]];function s(e,n,t){return(e=RegExp(e,"i").exec(n))&&e[t]}for(var a=0;a<i.length;++a)if(n=s(i[a][0]+"[/ ](.*?)[ \\)]",o,1)){e=i[a][1];break}"Safari"==e&&(n=s("Version/(.*?) ",o,1)),"Internet Explorer"==e&&(n=s("rv:(.*?)\\)? ",o,1)||n);for(var d=[["Windows (.*?)[;)]","Windows"],["Android ([0-9_.]+)","Android"],["iPhone OS ([0-9_.]+)","iPhoneOS"],["iPad.*? OS ([0-9_.]+)","iPadOS"],["FreeBSD( )","FreeBSD"],["OpenBSD( )","OpenBSD"],["Linux|X11()","Linux"],["Mac OS X ([0-9_\\.]+)","MacOS"],["bot|google|baidu|bing|msn|teoma|slurp|yandex","Search Bot"]],f=0;f<d.length;++f)if(l=s(d[f][0],o,1)){t=d[f][1],l=l.replace(/_/g,".");break}var l={"NT 5.0":"2000","NT 5.1":"XP","NT 5.2":"Server 2003","NT 6.0":"Vista","NT 6.1":"7","NT 6.2":"8","NT 6.3":"8.1","NT 10.0":"10"}[l]||l,u=((u=document.createElement("canvas"))&&(gl=u.getContext("webgl2"),glVersion=gl?2:0,gl||(gl=u&&u.getContext("webgl"))&&(glVersion=1),gl&&(r=gl.getExtension("WEBGL_debug_renderer_info")&&gl.getParameter(37446)||gl.getParameter(7937))),"undefined"!=typeof SharedArrayBuffer),c="object"==typeof WebAssembly&&"function"==typeof WebAssembly.compile;return{width:screen.width,height:screen.height,userAgent:o.trim(),browser:e||"Unknown browser",browserVersion:n||"Unknown version",mobile:/Mobile|Android|iP(ad|hone)/.test(navigator.appVersion),os:t||"Unknown OS",osVersion:l||"Unknown OS Version",gpu:r||"Unknown GPU",language:navigator.userLanguage||navigator.language,hasWebGL:glVersion,hasCursorLock:!!document.body.requestPointerLock,hasFullscreen:!!document.body.requestFullscreen||!!document.body.webkitRequestFullscreen,hasThreads:u,hasWasm:c,hasWasmThreads:!1}}(),p.abortHandler=function(e){return w(e,"",0),!0},Error.stackTraceLimit=Math.max(Error.stackTraceLimit||0,50),p.readBodyWithProgress=function(i,s,a){var e=i.body?i.body.getReader():void 0,d=void 0!==i.headers.get("Content-Length"),f=function(e,n){if(!n)return 0;var n=e.headers.get("Content-Encoding"),t=parseInt(e.headers.get("Content-Length"));switch(n){case"br":return Math.round(5*t);case"gzip":return Math.round(4*t);default:return t}}(i,d),l=new Uint8Array(f),u=[],c=0,w=0;return d||console.warn("[UnityCache] Response is served without Content-Length header. Please reconfigure server to include valid Content-Length for better download performance."),function o(){return void 0===e?i.arrayBuffer().then(function(e){var n=new Uint8Array(e);return s({type:"progress",response:i,total:e.length,loaded:0,lengthComputable:d,chunk:a?n:null}),n}):e.read().then(function(e){if(e.done){if(c===f)return l;if(c<f)return l.slice(0,c);for(var n=new Uint8Array(c),t=(n.set(l,0),w),r=0;r<u.length;++r)n.set(u[r],t),t+=u[r].length;return n}return c+e.value.length<=l.length?(l.set(e.value,c),w=c+e.value.length):u.push(e.value),c+=e.value.length,s({type:"progress",response:i,total:Math.max(f,c),loaded:c,lengthComputable:d,chunk:a?e.value:null}),o()})}().then(function(e){return s({type:"load",response:i,total:e.length,loaded:e.length,lengthComputable:d,chunk:null}),i.parsedBody=e,i})},p.fetchWithProgress=function(e,n){var t=function(){};return n&&n.onProgress&&(t=n.onProgress),fetch(e,n).then(function(e){return p.readBodyWithProgress(e,t,n.enableStreamingDownload)})};var b={gzip:{hasUnityMarker:function(e){var n=10,t="UnityWeb Compressed Content (gzip)";if(n>e.length||31!=e[0]||139!=e[1])return!1;var r=e[3];if(4&r){if(n+2>e.length)return!1;if((n+=2+e[n]+(e[n+1]<<8))>e.length)return!1}if(8&r){for(;n<e.length&&e[n];)n++;if(n+1>e.length)return!1;n++}return 16&r&&String.fromCharCode.apply(null,e.subarray(n,n+t.length+1))==t+"\0"}},br:{require:function(e){if(!this._bwReady){this._bwReady=(async()=>{
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
* @param {Uint8Array} buf
* @param {any} raw_options
* @returns {Uint8Array}
*/
function compress(buf, raw_options) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(buf, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.compress(retptr, ptr0, len0, addBorrowedObject(raw_options));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        if (r3) {
            throw takeObject(r2);
        }
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
* @param {Uint8Array} buf
* @returns {Uint8Array}
*/
function __bwDecompress(buf) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(buf, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.decompress(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        if (r3) {
            throw takeObject(r2);
        }
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}
/**
* Same as [`brotli::BrotliResult`] except [`brotli::BrotliResult::ResultFailure`].
*
* Always `> 0`.
*
* `ResultFailure` is removed
* because we will convert the failure to an actual negative error code (if available) and pass it elsewhere.
*/
const BrotliStreamResultCode = Object.freeze({ ResultSuccess:1,"1":"ResultSuccess",NeedsMoreInput:2,"2":"NeedsMoreInput",NeedsMoreOutput:3,"3":"NeedsMoreOutput", });
/**
* Returned by every successful (de)compression.
*/
class BrotliStreamResult {

    static __wrap(ptr) {
        const obj = Object.create(BrotliStreamResult.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_brotlistreamresult_free(ptr);
    }
    /**
    * Result code.
    *
    * See [`BrotliStreamResultCode`] for available values.
    *
    * When error, the error code is not passed here but rather goes to `Err`.
    */
    get code() {
        const ret = wasm.__wbg_get_brotlistreamresult_code(this.ptr);
        return ret >>> 0;
    }
    /**
    * Result code.
    *
    * See [`BrotliStreamResultCode`] for available values.
    *
    * When error, the error code is not passed here but rather goes to `Err`.
    * @param {number} arg0
    */
    set code(arg0) {
        wasm.__wbg_set_brotlistreamresult_code(this.ptr, arg0);
    }
    /**
    * Output buffer
    */
    get buf() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_brotlistreamresult_buf(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Output buffer
    * @param {Uint8Array} arg0
    */
    set buf(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_brotlistreamresult_buf(this.ptr, ptr0, len0);
    }
    /**
    * Consumed bytes of the input buffer
    */
    get input_offset() {
        const ret = wasm.__wbg_get_brotlistreamresult_input_offset(this.ptr);
        return ret >>> 0;
    }
    /**
    * Consumed bytes of the input buffer
    * @param {number} arg0
    */
    set input_offset(arg0) {
        wasm.__wbg_set_brotlistreamresult_input_offset(this.ptr, arg0);
    }
}
/**
*/
class CompressStream {

    static __wrap(ptr) {
        const obj = Object.create(CompressStream.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compressstream_free(ptr);
    }
    /**
    * @param {number | undefined} quality
    */
    constructor(quality) {
        const ret = wasm.compressstream_new(!isLikeNone(quality), isLikeNone(quality) ? 0 : quality);
        return CompressStream.__wrap(ret);
    }
    /**
    * @param {Uint8Array | undefined} input_opt
    * @param {number} output_size
    * @returns {BrotliStreamResult}
    */
    compress(input_opt, output_size) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = isLikeNone(input_opt) ? 0 : passArray8ToWasm0(input_opt, wasm.__wbindgen_malloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.compressstream_compress(retptr, this.ptr, ptr0, len0, output_size);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return BrotliStreamResult.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {number}
    */
    total_out() {
        const ret = wasm.compressstream_total_out(this.ptr);
        return ret >>> 0;
    }
}
/**
*/
class DecompressStream {

    static __wrap(ptr) {
        const obj = Object.create(DecompressStream.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_decompressstream_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = wasm.decompressstream_new();
        return DecompressStream.__wrap(ret);
    }
    /**
    * @param {Uint8Array} input
    * @param {number} output_size
    * @returns {BrotliStreamResult}
    */
    decompress(input, output_size) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(input, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.decompressstream_decompress(retptr, this.ptr, ptr0, len0, output_size);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return BrotliStreamResult.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {number}
    */
    total_out() {
        const ret = wasm.decompressstream_total_out(this.ptr);
        return ret >>> 0;
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function __bwInit(input) {
    if (typeof input === 'undefined') {
        input = new URL('brotli_wasm_bg.wasm', self.location.href);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_json_serialize = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = JSON.stringify(obj === undefined ? null : obj);
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_new_693216e109162396 = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_0ddaca5d1abfb52f = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_09919627ac0992f5 = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    __bwInit.__wbindgen_wasm_module = module;

    return wasm;
}


await __bwInit(this.__bwWasmUrl);this.__bwDecompress=__bwDecompress;})()}return this._bwReady},decompress:function(e){var t=this;return this.require().then(function(){return t.__bwDecompress(e)})},hasUnityMarker:function(e){var n="UnityWeb Compressed Content (brotli)";if(!e.length)return!1;var t=1&e[0]?14&e[0]?4:7:1,r=e[0]&(1<<t)-1,o=1+(Math.log(n.length-1)/Math.log(2)>>3);if(commentOffset=1+t+2+1+2+(o<<3)+7>>3,17==r||commentOffset>e.length)return!1;for(var i=r+(6+(o<<4)+(n.length-1<<6)<<t),s=0;s<commentOffset;s++,i>>>=8)if(e[s]!=(255&i))return!1;return String.fromCharCode.apply(null,e.subarray(commentOffset,commentOffset+n.length))==n}}};function m(n){h(n);var e=p.fetchWithProgress,t=p[n],r=/file:\/\//.exec(t)?"same-origin":void 0;return e(p[n],{method:"GET",companyName:p.companyName,productName:p.productName,productVersion:p.productVersion,control:"no-store",mode:r,onProgress:function(e){h(n,e)}}).then(function(e){return s=e.parsedBody,a=p[n],new Promise(function(e,n){try{for(var t in b){var r,o,i;if(b[t].hasUnityMarker(s))return a&&console.log('You can reduce startup time if you configure your web server to add "Content-Encoding: '+t+'" response header when serving "'+a+'" file.'),(r=b[t]).worker||(o=URL.createObjectURL(new Blob(["this.__bwWasmUrl = ",JSON.stringify(new URL("Build/brotli.wasm",document.baseURI).href),"; this.require = ",r.require.toString(),"; this.decompress = ",r.decompress.toString(),"; this.onmessage = ",function(e){var id=e.data.id;Promise.resolve(this.decompress(e.data.compressed)).then(function(decompressed){postMessage({id:id,decompressed:decompressed},decompressed?[decompressed.buffer]:[])})}.toString(),"; postMessage({ ready: true });"],{type:"application/javascript"})),r.worker=new Worker(o),r.worker.onmessage=function(e){e.data.ready?URL.revokeObjectURL(o):(this.callbacks[e.data.id](e.data.decompressed),delete this.callbacks[e.data.id])},r.worker.callbacks={},r.worker.nextCallbackId=0),i=r.worker.nextCallbackId++,r.worker.callbacks[i]=e,void r.worker.postMessage({id:i,compressed:s},[s.buffer])}e(s)}catch(e){n(e)}});var s,a}).catch(function(e){var n="Failed to download file "+t;"file:"==location.protocol?f(n+". Loading web pages via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host Unity content, or use the Unity Build and Run option.","error"):console.error(n)})}function g(){var n=performance.now(),h=(Promise.all([m("frameworkUrl").then(function(e){var a=URL.createObjectURL(new Blob([e],{type:"application/javascript"}));return new Promise(function(i,e){var s=document.createElement("script");s.src=a,s.onload=function(){if("undefined"==typeof unityFramework||!unityFramework){var e,n=[["br","br"],["gz","gzip"]];for(e in n){var t,r=n[e];if(p.frameworkUrl.endsWith("."+r[0]))return t="Unable to parse "+p.frameworkUrl+"!","file:"==location.protocol?void f(t+" Loading pre-compressed (brotli or gzip) content via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host compressed Unity content, or use the Unity Build and Run option.","error"):(t+=' This can happen if build compression was enabled but web server hosting the content was misconfigured to not serve the file with HTTP Response Header "Content-Encoding: '+r[1]+'" present. Check browser Console and Devtools Network tab to debug.',"br"==r[0]&&"http:"==location.protocol&&(r=-1!=["localhost","127.0.0.1"].indexOf(location.hostname)?"":"Migrate your server to use HTTPS.",t=/Firefox/.test(navigator.userAgent)?"Unable to parse "+p.frameworkUrl+'!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported in Firefox over HTTP connections. '+r+' See <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1670675">https://bugzilla.mozilla.org/show_bug.cgi?id=1670675</a> for more information.':"Unable to parse "+p.frameworkUrl+'!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported over HTTP connections. Migrate your server to use HTTPS.'),void f(t,"error"))}f("Unable to parse "+p.frameworkUrl+"! The file is corrupt, or compression was misconfigured? (check Content-Encoding HTTP Response Header on web server)","error")}var o=unityFramework;unityFramework=null,s.onload=null,URL.revokeObjectURL(a),i(o)},s.onerror=function(e){f("Unable to load file "+p.frameworkUrl+"! Check that the file exists on the remote server. (also check browser Console and Devtools Network tab to debug)","error")},document.body.appendChild(s),p.deinitializers.push(function(){document.body.removeChild(s)})})}),m("codeUrl")]).then(function(e){p.wasmBinary=e[1],e[0](p),p.codeDownloadTimeEnd=performance.now()-n}),performance.now()),e=m("dataUrl");p.preRun.push(function(){p.addRunDependency("dataUrl"),e.then(function(n){var e=new TextDecoder("utf-8"),t=0;function r(){var e=(n[t]|n[t+1]<<8|n[t+2]<<16|n[t+3]<<24)>>>0;return t+=4,e}function o(e){if(b.gzip.hasUnityMarker(n))throw e+'. Failed to parse binary data file, because it is still gzip-compressed and should have been uncompressed by the browser. Web server has likely provided gzip-compressed data without specifying the HTTP Response Header "Content-Encoding: gzip" with it to instruct the browser to decompress it. Please verify your web server hosting configuration.';if(b.br.hasUnityMarker(n))throw e+'. Failed to parse binary data file, because it is still brotli-compressed and should have been uncompressed by the browser. Web server has likely provided brotli-compressed data without specifying the HTTP Response Header "Content-Encoding: br" with it to instruct the browser to decompress it. Please verify your web server hosting configuration.';throw e}var i="UnityWebData1.0\0",s=e.decode(n.subarray(0,i.length)),a=(s!=i&&o('Unknown data format (id="'+s+'")'),t+=i.length,r());for(t+a>n.length&&o("Invalid binary data file header! (pos="+t+", headerSize="+a+", file length="+n.length+")");t<a;){var d=r(),f=r(),l=(d+f>n.length&&o("Invalid binary data file size! (offset="+d+", size="+f+", file length="+n.length+")"),r()),u=(t+l>n.length&&o("Invalid binary data file path name! (pos="+t+", length="+l+", file length="+n.length+")"),e.decode(n.subarray(t,t+l)));t+=l;for(var c=0,w=u.indexOf("/",c)+1;0<w;c=w,w=u.indexOf("/",c)+1)p.FS_createPath(u.substring(0,c),u.substring(c,w-1),!0,!0);p.FS_createDataFile(u,null,n.subarray(d,d+f),!0,!0,!0)}p.removeRunDependency("dataUrl"),p.dataUrlLoadEndTime=performance.now()-h})})}return new Promise(function(e,n){var t;p.SystemInfo.hasWebGL?1==p.SystemInfo.hasWebGL?(t='Your browser does not support graphics API "WebGL 2" which is required for this content.',"Safari"==p.SystemInfo.browser&&parseInt(p.SystemInfo.browserVersion)<15&&(p.SystemInfo.mobile||1<navigator.maxTouchPoints?t+="\nUpgrade to iOS 15 or later.":t+="\nUpgrade to Safari 15 or later."),n(t)):p.SystemInfo.hasWasm?(p.startupErrorHandler=n,d(0),p.postRun.push(function(){d(1),delete p.startupErrorHandler,e(c),p.pageStartupTime=performance.now()}),g()):n("Your browser does not support WebAssembly."):n("Your browser does not support WebGL.")})}