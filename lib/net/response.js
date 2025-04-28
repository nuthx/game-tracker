export function sendResponse(request, { code = 200, message = "success", data = null }) {
  // Extract method and pathname as model for logging
  const method = request.method;
  const pathname = new URL(request.url).pathname;
  const model = `${method} ${pathname}`;

  if (code >= 300 && code <= 599) {
    console.error(message, model);
  }

  return Response.json({ code, message, data }, { 
    status: code
  });
}
