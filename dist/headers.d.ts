import { s_inspect } from "./symbol";
import type { TAny } from "./types";
export declare class NodeHeaders {
    headers: Headers;
    constructor(headers: Headers);
    [s_inspect](depth: number, opts: TAny, inspect: TAny): string;
}
