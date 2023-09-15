import { C_TYPE, T_JSON } from "./constant";
import { NodeHeaders } from "./headers";
import { s_body, s_def, s_headers, s_init, s_inspect } from "./symbol";
import type { TAny } from "./types";

export class NodeResponse {
  constructor(body?: BodyInit | null, init?: ResponseInit) {
    this[s_body] = body;
    this[s_init] = init;
  }
  static error(): Response {
    return (<TAny> globalThis).NativeResponse.error();
  }
  static redirect(url: string | URL, status?: number): Response {
    return (<TAny> globalThis).NativeResponse.redirect(url, status);
  }
  static json(data: unknown, init?: ResponseInit): Response;
  static json(
    data: unknown,
    init: TAny = {},
  ): Response {
    if (init.headers !== void 0) {
      if (typeof init.headers.get === "function") {
        init.headers.set(C_TYPE, init.headers.get(C_TYPE) ?? T_JSON);
      } else {
        init.headers[C_TYPE] ??= T_JSON;
      }
    } else {
      init.headers = { [C_TYPE]: T_JSON };
    }
    return new NodeResponse(JSON.stringify(data), init);
  }
  private get res(): Response {
    return this[s_def] ??= new (<TAny> globalThis).NativeResponse(
      this[s_body],
      this[s_init],
    );
  }
  get headers() {
    return this[s_headers] ??= new Headers(this[s_init]?.headers);
  }
  get ok() {
    return this.res.ok;
  }
  get redirected() {
    return this.res.redirected;
  }
  get status() {
    return this[s_init]?.status ?? 200;
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
  clone(): Response {
    return new NodeResponse(this[s_body], this[s_init]);
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
  [s_inspect](
    depth: number,
    opts: TAny,
    inspect: TAny,
  ) {
    opts.depth = depth;
    const ret = {
      body: this.body,
      bodyUsed: this.bodyUsed,
      headers: new NodeHeaders(this.headers),
      status: this.status,
      statusText: this.statusText,
      redirected: this.redirected,
      ok: this.ok,
      url: this.url,
    };
    return `Response ${inspect(ret, opts)}`;
  }
  [k: string | symbol]: TAny;
}
