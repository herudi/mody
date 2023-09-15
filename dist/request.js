"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeRequest = void 0;
const headers_1 = require("./headers");
const symbol_1 = require("./symbol");
const typeError = (m) => Promise.reject(new TypeError(m));
const consumed = "body already consumed";
const misstype = "missing content-type";
const mnotbody = "GET/HEAD cannot have body";
const notBody = (raw) => raw.method === "GET" || raw.method === "HEAD";
function reqBody(url, body, raw) {
    return new globalThis.NativeRequest(url, {
        method: raw.method,
        headers: raw.headers,
        body: notBody(raw) ? void 0 : body,
    });
}
class NodeRequest {
    raw;
    constructor(input, init, raw) {
        this.raw = raw;
        this[symbol_1.s_body] = input;
        this[symbol_1.s_init] = init;
    }
    get rawBody() {
        if (this[symbol_1.s_body_used])
            return typeError(consumed);
        this[symbol_1.s_body_used] = true;
        if (!this.raw.req.headers["content-type"])
            return typeError(misstype);
        if (notBody(this.raw.req))
            return typeError(mnotbody);
        return new Promise((resolve, reject) => {
            const chunks = [];
            this.raw.req.on("data", (buf) => chunks.push(buf))
                /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                // @ts-ignore: Buffer for nodejs
                .on("end", () => resolve(Buffer.concat(chunks)))
                .on("error", (err) => reject(err));
        });
    }
    get req() {
        return this[symbol_1.s_def] ??= new globalThis.NativeRequest(this[symbol_1.s_body], this[symbol_1.s_init]);
    }
    get cache() {
        return this.req.cache;
    }
    get credentials() {
        return this.req.credentials;
    }
    get destination() {
        return this.req.destination;
    }
    get headers() {
        return this.raw ? new Headers(this.raw.req.headers) : this.req.headers;
    }
    get integrity() {
        return this.req.integrity;
    }
    get keepalive() {
        return this.req.keepalive;
    }
    get method() {
        return this.raw ? this.raw.req.method : this.req.method;
    }
    get mode() {
        return this.req.mode;
    }
    get redirect() {
        return this.req.redirect;
    }
    get referrer() {
        return this.req.referrer;
    }
    get referrerPolicy() {
        return this.req.referrerPolicy;
    }
    get signal() {
        return this.req.signal;
    }
    get url() {
        if (typeof this[symbol_1.s_body] === "string") {
            return this[symbol_1.s_body];
        }
        return this.req.url;
    }
    clone() {
        const req = new NodeRequest(this[symbol_1.s_body], this[symbol_1.s_init], this.raw);
        return req;
    }
    get body() {
        if (this.raw) {
            if (notBody(this.raw.req))
                return null;
            if (!this.raw.req.headers["content-type"])
                return null;
            return new ReadableStream({
                start: async (ctrl) => {
                    try {
                        const body = await this.rawBody;
                        ctrl.enqueue(body);
                        ctrl.close();
                    }
                    catch (e) {
                        ctrl.close();
                        throw e;
                    }
                },
            });
        }
        return this.req.body;
    }
    get bodyUsed() {
        if (this.raw) {
            return this[symbol_1.s_body_used] ?? false;
        }
        return this.req.bodyUsed;
    }
    arrayBuffer() {
        return (async () => {
            if (this.raw) {
                return await this.rawBody;
            }
            return await this.req.arrayBuffer();
        })();
    }
    blob() {
        return (async () => {
            if (this.raw) {
                const req = reqBody(this[symbol_1.s_body], await this.rawBody, this.raw.req);
                return await req.blob();
            }
            return await this.req.blob();
        })();
    }
    formData() {
        return (async () => {
            if (this.raw) {
                const req = reqBody(this[symbol_1.s_body], await this.rawBody, this.raw.req);
                return await req.formData();
            }
            return await this.req.formData();
        })();
    }
    json() {
        return (async () => {
            if (this.raw) {
                return JSON.parse((await this.rawBody).toString());
            }
            return await this.req.json();
        })();
    }
    text() {
        return (async () => {
            if (this.raw) {
                return (await this.rawBody).toString();
            }
            return await this.req.text();
        })();
    }
    get [Symbol.hasInstance]() {
        return "Request";
    }
    [symbol_1.s_inspect](depth, opts, inspect) {
        opts.depth = depth;
        const ret = {
            bodyUsed: this.bodyUsed,
            headers: new headers_1.NodeHeaders(this.headers),
            method: this.method,
            redirect: this.redirect,
            url: this.url,
        };
        return `Request ${inspect(ret, opts)}`;
    }
}
exports.NodeRequest = NodeRequest;
