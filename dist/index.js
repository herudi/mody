"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = exports.handleFetch = void 0;
const request_1 = require("./request");
const response_1 = require("./response");
const symbol_1 = require("./symbol");
const node_http_1 = require("node:http");
const node_https_1 = require("node:https");
const constant_1 = require("./constant");
function mutateResponse() {
    if (globalThis.NativeResponse === undefined) {
        globalThis.NativeResponse = Response;
        globalThis.NativeRequest = Request;
        globalThis.Response = response_1.NodeResponse;
        globalThis.Request = request_1.NodeRequest;
    }
}
async function sendStream(resWeb, res) {
    if (resWeb[symbol_1.s_body] instanceof ReadableStream) {
        for await (const chunk of resWeb[symbol_1.s_body])
            res.write(chunk);
        res.end();
        return;
    }
    const chunks = [];
    for await (const chunk of resWeb.body)
        chunks.push(chunk);
    const data = Buffer.concat(chunks);
    if (resWeb[symbol_1.s_body] instanceof FormData && !res.getHeader(constant_1.C_TYPE)) {
        const type = `${constant_1.T_MULTIPART};boundary=${data.toString().split("\r")[0]}`;
        res.setHeader(constant_1.C_TYPE, type);
    }
    res.end(data);
}
function handleResWeb(resWeb, res) {
    if (res.writableEnded)
        return;
    let hasHeader, code = 200;
    const headers = {};
    if (resWeb[symbol_1.s_init] !== void 0) {
        hasHeader = 1;
        if (resWeb[symbol_1.s_init].headers !== void 0) {
            if (typeof resWeb[symbol_1.s_init].headers.get === "function") {
                resWeb[symbol_1.s_init].headers.forEach((val, key) => {
                    headers[key] = val;
                });
            }
            else {
                for (const k in resWeb[symbol_1.s_init].headers) {
                    headers[k] = resWeb[symbol_1.s_init].headers[k];
                }
            }
        }
        if (resWeb[symbol_1.s_init].status !== void 0) {
            code = resWeb[symbol_1.s_init].status;
        }
    }
    if (resWeb[symbol_1.s_headers] !== void 0) {
        hasHeader ??= 1;
        resWeb[symbol_1.s_headers].forEach((val, key) => {
            headers[key] = val;
        });
    }
    if (typeof resWeb[symbol_1.s_body] === "string") {
        if (hasHeader === void 0 || res.hasHeader(constant_1.C_TYPE) === false) {
            headers[constant_1.C_TYPE] = constant_1.T_TEXT;
        }
        headers[constant_1.C_LEN] = Buffer.byteLength(resWeb[symbol_1.s_body]);
        res.writeHead(code, headers);
        res.end(resWeb[symbol_1.s_body]);
    }
    else if (resWeb[symbol_1.s_body] == null) {
        headers[constant_1.C_LEN] = 0;
        res.writeHead(code, headers);
        res.end(resWeb[symbol_1.s_body]);
    }
    else if (resWeb[symbol_1.s_body] instanceof Uint8Array) {
        headers[constant_1.C_LEN] = resWeb[symbol_1.s_body].byteLength;
        res.writeHead(code, headers);
        res.end(resWeb[symbol_1.s_body]);
    }
    else {
        for (const k in headers)
            res.setHeader(k, headers[k]);
        res.statusCode = code;
        sendStream(resWeb, res);
    }
}
async function asyncHandleResWeb(resWeb, res) {
    handleResWeb(await resWeb, res);
}
const handleFetch = (handler) => async (req, res) => {
    const resWeb = handler(new request_1.NodeRequest(`http://${req.headers.host}${req.url}`, void 0, { req, res }));
    if (resWeb?.then)
        asyncHandleResWeb(resWeb, res);
    else
        handleResWeb(resWeb, res);
};
exports.handleFetch = handleFetch;
function serve(handler, opts = {}) {
    opts.port ??= 3000;
    opts.immediate ??= true;
    mutateResponse();
    const port = opts.port;
    let server;
    if (handler instanceof node_http_1.Server) {
        server = handler.listen(port);
    }
    else {
        const isSecure = opts.key !== void 0 && opts.cert !== void 0;
        const createServerMody = (isSecure ? node_https_1.createServer : node_http_1.createServer);
        server = createServerMody(opts, opts.immediate
            ? (req, res) => {
                setImmediate(() => (0, exports.handleFetch)(handler)(req, res));
            }
            : (req, res) => {
                (0, exports.handleFetch)(handler)(req, res);
            }).listen(port);
    }
    if (opts.onListen)
        opts.onListen(opts);
    else
        console.log(`> Running on port ${opts.port}`);
    return server;
}
exports.serve = serve;
exports.default = { serve, handleFetch: exports.handleFetch };
