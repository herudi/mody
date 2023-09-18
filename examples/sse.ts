import { serve } from "mody";

const html = `
  <html>
    <head>
      <title>Server Sent Event</title>
      <script>
        window.onload = () => {
          const message = document.getElementById("message");
          const evtSource = new EventSource("/sse");
          evtSource.onmessage = function (event) {
            message.innerHTML += (event.data + "<br/>");
          }
        }
      </script>
    </head>
    <body style="width: 80%; margin: auto">
      <h1>Simple SSE</h1>
      <hr/>
      <div id="message"></div>
    </body>
  </html>
`;

serve((req) => {
  const url = new URL(req.url);
  if (url.pathname === "/") {
    return new Response(html, { headers: { "content-type": "text/html" } });
  } else if (url.pathname === "/sse") {
    let int: any;
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
  }
  return new Response("not found", { status: 404 });
});
