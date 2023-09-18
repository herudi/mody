import type { FetchHandler, FetchOptions, TAny } from "./types";
import { NodeRequest } from "./request";
import { NodeResponse } from "./response";
import { s_body, s_headers, s_init } from "./symbol";
import {
  createServer,
  IncomingMessage,
  Server,
  ServerResponse,
} from "node:http";
import { createServer as createServerTls } from "node:https";
import {
  C_LEN,
  C_TYPE,
  R_ENC,
  R_NO_STREAM,
  T_MULTIPART,
  T_TEXT,
} from "./constant";
import { Buffer } from "node:buffer";

function mutateResponse() {
  if ((<TAny> globalThis).NativeResponse === undefined) {
    (<TAny> globalThis).NativeResponse = Response;
    (<TAny> globalThis).NativeRequest = Request;
    (<TAny> globalThis).Response = NodeResponse;
    (<TAny> globalThis).Request = NodeRequest;
  }
}
async function sendStream(resWeb: TAny, res: ServerResponse, ori = false) {
  if (ori) {
    resWeb = resWeb.clone();
    const headers = {};
    (<Headers> resWeb.headers).forEach((val, key) => {
      // disable compression
      if (!R_ENC.test(key)) headers[key] = val;
    });
    const code = resWeb.status ?? 200;
    if (R_NO_STREAM.test(headers[C_TYPE] ?? "")) {
      const body = await resWeb.text();
      headers[C_LEN] = Buffer.byteLength(body);
      res.writeHead(code, headers);
      res.end(body);
    } else {
      res.writeHead(code, headers);
      if (resWeb.body != null) {
        for await (const chunk of resWeb.body) res.write(chunk);
      }
      res.end();
    }
    return;
  }
  if (resWeb[s_body] instanceof ReadableStream) {
    for await (const chunk of resWeb[s_body] as TAny) res.write(chunk);
    res.end();
    return;
  }
  if (resWeb.body == null) {
    res.end();
    return;
  }
  const chunks = [] as TAny[];
  for await (const chunk of resWeb.body as TAny) chunks.push(chunk);
  const data = Buffer.concat(chunks);
  if (
    resWeb[s_body] instanceof FormData && !res.getHeader(C_TYPE)
  ) {
    const type = `${T_MULTIPART};boundary=${data.toString().split("\r")[0]}`;
    res.setHeader(C_TYPE, type);
  }
  res.end(data);
}
function handleResWeb(resWeb: TAny, res: ServerResponse) {
  if (res.writableEnded) return;
  if (resWeb._mody === void 0) {
    sendStream(resWeb, res, true);
    return;
  }
  let code = 200;
  const headers = {};
  if (resWeb[s_init] !== void 0) {
    if (resWeb[s_init].headers !== void 0) {
      if (typeof resWeb[s_init].headers.get === "function") {
        (<Headers> resWeb[s_init].headers).forEach((val, key) => {
          headers[key.toLowerCase()] = val;
        });
      } else {
        for (const k in resWeb[s_init].headers) {
          headers[k.toLowerCase()] = resWeb[s_init].headers[k];
        }
      }
    }
    if (resWeb[s_init].status !== void 0) {
      code = resWeb[s_init].status;
    }
  }
  if (resWeb[s_headers] !== void 0) {
    (<Headers> resWeb[s_headers]).forEach((val, key) => {
      headers[key.toLowerCase()] = val;
    });
  }
  if (typeof resWeb[s_body] === "string") {
    headers[C_TYPE] ??= T_TEXT;
    headers[C_LEN] = Buffer.byteLength(resWeb[s_body]);
    res.writeHead(code, headers);
    res.end(resWeb[s_body]);
  } else if (resWeb[s_body] == null) {
    headers[C_LEN] = 0;
    res.writeHead(code, headers);
    res.end(resWeb[s_body]);
  } else if (resWeb[s_body] instanceof Uint8Array) {
    headers[C_LEN] = resWeb[s_body].byteLength;
    res.writeHead(code, headers);
    res.end(resWeb[s_body]);
  } else {
    for (const k in headers) res.setHeader(k, headers[k]);
    res.statusCode = code;
    sendStream(resWeb, res);
  }
}

async function asyncHandleResWeb(resWeb: Promise<TAny>, res: TAny) {
  handleResWeb(await resWeb, res);
}
export function handleFetch(handler: FetchHandler) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const resWeb: TAny = handler(
      new NodeRequest(
        `http://${req.headers.host}${req.url}`,
        void 0,
        { req, res },
      ) as unknown as Request,
    );
    if (resWeb?.then) asyncHandleResWeb(resWeb, res);
    else handleResWeb(resWeb, res);
  };
}
export type { FetchHandler, FetchOptions };
export { NodeRequest as Request, NodeResponse as Response };
export function serve(handler: FetchHandler, opts?: FetchOptions): Server;
export function serve(handler: Server, opts?: FetchOptions): Server;
export function serve(handler: TAny, opts?: FetchOptions): Server;
export function serve(
  handler: TAny,
  opts: FetchOptions = {},
): Server {
  opts.port ??= 3000;
  opts.immediate ??= true;
  mutateResponse();
  const port = opts.port;
  let server: Server;
  if (handler instanceof Server) {
    server = handler.listen(port);
  } else {
    const isSecure = opts.key !== void 0 && opts.cert !== void 0;
    const createServerMody =
      (isSecure ? createServerTls : createServer) as TAny;
    server = createServerMody(
      opts,
      opts.immediate
        ? (req: IncomingMessage, res: ServerResponse) => {
          setImmediate(() => handleFetch(handler)(req, res));
        }
        : (req: IncomingMessage, res: ServerResponse) => {
          handleFetch(handler)(req, res);
        },
    ).listen(port);
  }
  if (opts.onListen) opts.onListen(opts);
  else console.log(`> Running on port ${opts.port}`);
  return server;
}

export default {
  serve,
  handleFetch,
  Request: NodeRequest,
  Response: NodeResponse,
};
