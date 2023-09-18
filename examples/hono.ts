import { serve } from "mody";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("hello hono");
});

serve(app.fetch);
