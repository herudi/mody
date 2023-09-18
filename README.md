## Mody

Fast & Modern Http Server for Node.

[![GitHub](https://img.shields.io/github/license/herudi/mody)](https://github.com/herudi/mody/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/mody)](https://www.npmjs.com/package/mody)
[![bundlejs](https://deno.bundlejs.com/badge?q=mody&config={%22esbuild%22:{%22format%22:%22cjs%22,%22platform%22:%22node%22}})](https://www.npmjs.com/package/mody)

## Install

```bash
npm i mody
```

## Usage

```js
import { serve } from "mody";

const handler = (request) => {
  return new Response("Hello World");
};

serve(handler);

// serve(handler, { port: 8000 });
```

## Fetch Handler

Mody is based on
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### Request

The [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
interface of the
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
represents a resource request.

### Response

The [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
interface of the
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
represents the response to a request.

## With Framework

### Hono

[Hono](https://hono.dev) is a small, simple, and ultrafast web framework for the
Edges.

```js
import { serve } from "mody";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("hello hono"));

serve(app.fetch);
```

### Itty Router

[Itty](https://github.com/kwhitley/itty-router) is arguably the smallest (~450
bytes) feature-rich JavaScript router available, while enabling dead-simple API
code.

```js
import { serve } from "mody";
import { Router } from "itty-router";

const router = Router();

router.get("/", (req) => {
  return new Response("hello itty");
});

serve(router.handle);
```

## Examples

See [Examples](https://github.com/herudi/mody/blob/master/examples)

### Proxy

```js
import { serve } from "mody";

serve((req) => fetch("https://example.com"));
```

### Send Json

```js
import { serve } from "mody";

serve((req) => Response.json({ name: "john" }));
```

### Redirect

```js
import { serve } from "mody";

serve((req) => {
  const url = new URL(req.url);
  if (url.pathname === "/") {
    return new Response("home");
  }
  if (url.pathname === "/redirect") {
    return Response.redirect(new URL("/", url.origin));
  }
  return new Response(null, { status: 404 });
});
```

### Server Sent Event (SSE)

```js
import { serve } from "mody";

serve((req) => {
  let int;
  const stream = new ReadableStream({
    start(controller) {
      int = setInterval(() => {
        controller.enqueue(`data: hello, mody\n\n`);
      }, 1000);
    },
    cancel() {
      clearInterval(int);
    },
  });
  return new Response(stream, {
    headers: { "content-type": "text/event-stream" },
  });
});
```

## License

[MIT](LICENSE)
