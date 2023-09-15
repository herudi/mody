"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeResponse = void 0;
const constant_1 = require("./constant");
const headers_1 = require("./headers");
const symbol_1 = require("./symbol");
class NodeResponse {
    constructor(body, init) {
        this[symbol_1.s_body] = body;
        this[symbol_1.s_init] = init;
    }
    static error() {
        return globalThis.NativeResponse.error();
    }
    static redirect(url, status) {
        return globalThis.NativeResponse.redirect(url, status);
    }
    static json(data, init = {}) {
        if (init.headers !== void 0) {
            if (typeof init.headers.get === "function") {
                init.headers.set(constant_1.C_TYPE, init.headers.get(constant_1.C_TYPE) ?? constant_1.T_JSON);
            }
            else {
                init.headers[constant_1.C_TYPE] ??= constant_1.T_JSON;
            }
        }
        else {
            init.headers = { [constant_1.C_TYPE]: constant_1.T_JSON };
        }
        return new NodeResponse(JSON.stringify(data), init);
    }
    get res() {
        return this[symbol_1.s_def] ??= new globalThis.NativeResponse(this[symbol_1.s_body], this[symbol_1.s_init]);
    }
    get headers() {
        return this[symbol_1.s_headers] ??= new Headers(this[symbol_1.s_init]?.headers);
    }
    get ok() {
        return this.res.ok;
    }
    get redirected() {
        return this.res.redirected;
    }
    get status() {
        return this[symbol_1.s_init]?.status ?? 200;
    }
    get statusText() {
        return this.res.statusText;
    }
    get type() {
        return this.res.type;
    }
    get url() {
        return this.res.url;
    }
    get body() {
        return this.res.body;
    }
    get bodyUsed() {
        return this.res.bodyUsed;
    }
    clone() {
        return new NodeResponse(this[symbol_1.s_body], this[symbol_1.s_init]);
    }
    arrayBuffer() {
        return this.res.arrayBuffer();
    }
    blob() {
        return this.res.blob();
    }
    formData() {
        return this.res.formData();
    }
    json() {
        return this.res.json();
    }
    text() {
        return this.res.text();
    }
    get [Symbol.hasInstance]() {
        return "Response";
    }
    [symbol_1.s_inspect](depth, opts, inspect) {
        opts.depth = depth;
        const ret = {
            body: this.body,
            bodyUsed: this.bodyUsed,
            headers: new headers_1.NodeHeaders(this.headers),
            status: this.status,
            statusText: this.statusText,
            redirected: this.redirected,
            ok: this.ok,
            url: this.url,
        };
        return `Response ${inspect(ret, opts)}`;
    }
}
exports.NodeResponse = NodeResponse;
