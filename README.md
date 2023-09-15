## Mody

Fast & Modern Http Server for Node.

## Install

```bash
npm i mody
```

## Usage

```js
import { serve } from "mody";

// default port 3000
serve((request) => new Response("Hello World"));
```

### With Options

```js
import { serve } from "mody";

const handler = (request) => {
  return new Response("Hello World");
};

serve(handler, { port: 8000 });
```

### Request Body

```js
// json
const json = await request.json();

// text
const json = await request.text();

// formData
const json = await request.formData();

// arrayBuffer
const json = await request.arrayBuffer();

// blob
const json = await request.blob();
```

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
