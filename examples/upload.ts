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
    return new Response("field file is required", { status: 422 });
  }
  return new Response(null, { status: 404 });
});
