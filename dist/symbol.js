"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s_inspect = exports.s_headers = exports.s_body_used = exports.s_def = exports.s_init = exports.s_body = void 0;
exports.s_body = Symbol("input_body");
exports.s_init = Symbol("init");
exports.s_def = Symbol("default");
exports.s_body_used = Symbol("req_body_used");
exports.s_headers = Symbol("s_headers");
exports.s_inspect = Symbol.for("nodejs.util.inspect.custom");
