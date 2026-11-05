export function notFound(req, res) {
  res.status(404).json({
    message: "Route not found",
    path: req.url,
  });
}

// 4 параметртэй байх ёстой — тэгж байж Express үүнийг error handler гэж таньдаг
export function errorHandler(error, req, res, next) {
  console.error(error);

  // Буруу JSON body илгээвэл
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON body" });
  }

  res.status(500).json({ message: "Internal server error" });
}
