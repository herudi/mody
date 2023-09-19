import { s_inspect } from "./symbol";
import type { TAny } from "./types";

export class ModyHeaders {
  constructor(public headers: Headers) {}
  [s_inspect](
    depth: number,
    opts: TAny,
    inspect: TAny,
  ) {
    opts.depth = depth;
    const headers = {};
    this.headers.forEach((v, k) => {
      headers[k] = v;
    });
    return `Headers ${inspect(headers, opts)}`;
  }
}
