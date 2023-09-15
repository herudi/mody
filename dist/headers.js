"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHeaders = void 0;
const symbol_1 = require("./symbol");
class NodeHeaders {
    headers;
    constructor(headers) {
        this.headers = headers;
    }
    [symbol_1.s_inspect](depth, opts, inspect) {
        opts.depth = depth;
        const headers = {};
        this.headers.forEach((v, k) => {
            headers[k] = v;
        });
        return `Headers ${inspect(headers, opts)}`;
    }
}
exports.NodeHeaders = NodeHeaders;
