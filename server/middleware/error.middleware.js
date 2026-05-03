export function notFound(req, res, next) {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.status = 404;
  next(err);
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  res.status(status).json({ success: false, data: null, message: err.message || "Server error", error: err.stack });
}
