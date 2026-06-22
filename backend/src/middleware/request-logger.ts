import morgan from 'morgan'

// Structured log line for local API debugging and tail-friendly parsing.
export const requestLogger = morgan((tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: Number(tokens.status(req, res) ?? 0),
    responseTimeMs: Number(tokens['response-time'](req, res) ?? 0),
    contentLength: tokens.res(req, res, 'content-length') ?? '0',
  })
})
