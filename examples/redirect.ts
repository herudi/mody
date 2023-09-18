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
