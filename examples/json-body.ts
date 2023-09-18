import { serve } from "mody";

serve(async (req) => {
  const url = new URL(req.url);
  if (req.method === "POST" && url.pathname === "/") {
    const body = await req.json();
    return Response.json(body, { status: 201 });
  }
  return new Response(null, { status: 404 });
});
