/// <reference types="node" />
import type { FetchHandler, FetchOptions, TAny } from "./types";
import { IncomingMessage, Server, ServerResponse } from "node:http";
export declare const handleFetch: (handler: FetchHandler) => (req: IncomingMessage, res: ServerResponse) => Promise<void>;
export type { FetchHandler, FetchOptions };
export declare function serve(handler: FetchHandler, opts?: FetchOptions): Server;
export declare function serve(handler: Server, opts?: FetchOptions): Server;
export declare function serve(handler: TAny, opts?: FetchOptions): Server;
declare const _default: {
    serve: typeof serve;
    handleFetch: (handler: FetchHandler) => (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => Promise<void>;
};
export default _default;
