// Гаралт: GET /books 200 3ms
export function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });

  next(); // next() дуудахгүй бол хүсэлт гацна
}
