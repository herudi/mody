## Mody

Edge-Style http server for NodeJS using
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

[![GitHub](https://img.shields.io/github/license/herudi/mody)](https://github.com/herudi/mody/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/mody)](https://www.npmjs.com/package/mody)
[![bundlejs](https://deno.bundlejs.com/badge?q=mody&config={%22esbuild%22:{%22format%22:%22cjs%22,%22platform%22:%22node%22}})](https://www.npmjs.com/package/mody)

## Install

```bash
npm install mody
```

## Usage

```js
import { serve } from "mody";

serve((req) => new Response("Hello Mody"));

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

## Examples

### Send Json

```js
import { serve } from "mody";

serve(() => Response.json({ name: "john" }));
```

### Upload File

```ts
import { serve } from "mody";
import { writeFile } from "node:fs/promises";
import { Buffer } from "node:buffer";

serve(async (req) => {
  const url = new URL(req.url);
  if (req.method === "POST" && url.pathname === "/") {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (file) {
      const ab = await file.arrayBuffer();
      await writeFile(file.name, Buffer.from(ab));
      return new Response("Success upload");
    }
    return new Response("Field file is required", { status: 422 });
  }
  return new Response(null, { status: 404 });
});
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

See More [Examples](https://github.com/herudi/mody/blob/master/examples)

## License

[MIT](LICENSE)
