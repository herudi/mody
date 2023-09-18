import { serve } from "mody";
import { Router } from "itty-router";

const router = Router();

router.get("/", (req) => {
  return new Response("hello itty");
});

serve(router.handle);
