var __create = Object.create
var __defProp = Object.defineProperty
var __getOwnPropDesc = Object.getOwnPropertyDescriptor // Note: can return "undefined" due to a Safari bug
var __getOwnPropNames = Object.getOwnPropertyNames
var __getProtoOf = Object.getPrototypeOf
var __hasOwnProp = Object.prototype.hasOwnProperty
// Wraps a CommonJS closure and returns a require() function. This has two
// implementations, a compact one for minified code and a verbose one that
// generates friendly names in V8's profiler and in stack traces.
var __commonJS = (cb, mod) => function () {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports
}
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports)
// Used to implement ESM exports both for "require()" and "import * as"
var __export = (target, all) => {
    for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true })
}

var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === 'object' || typeof from === 'function')
        for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
            key = keys[i]
            if (!__hasOwnProp.call(to, key) && key !== except)
                __defProp(to, key, { get: (k => from[k]).bind(null, key), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable })
        }
    return to
}

// This is used to implement "export * from" statements. It copies properties
// from the imported module to the current module's ESM export object. If the
// current module is an entry point and the target format is CommonJS, we
// also copy the properties to "module.exports" in addition to our module's
// internal ESM export object.
var __reExport = (target, mod, secondTarget) => (
    __copyProps(target, mod, 'default'),
    secondTarget && __copyProps(secondTarget, mod, 'default')
)

// Converts the module from CommonJS to ESM. When in node mode (i.e. in an
// ".mjs" file, package.json has "type: module", or the "__esModule" export
// in the CommonJS file is falsy or missing), the "default" property is
// overridden to point to the original CommonJS exports object instead.
var __toESM = (mod, isNodeMode, target) => (
    target = mod != null ? __create(__getProtoOf(mod)) : {},
    __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule
            ? __defProp(target, 'default', { value: mod, enumerable: true })
            : target,
        mod)
)

// Converts the module from ESM to CommonJS. This clones the input module
// object with the addition of a non-enumerable "__esModule" property set
// to "true", which overwrites any existing export named "__esModule".
var __toCommonJS = mod => __copyProps(__defProp({}, '__esModule', { value: true }), mod)