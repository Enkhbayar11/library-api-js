import express from "express";
import booksRouter from "./routes/books.router.js";
import authorsRouter from "./routes/authors.router.js";
import { logger } from "./middlewares/logger.js";
import { notFound, errorHandler } from "./middlewares/error.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Дараалал чухал (Seminar 4): json → logger → routes → notFound → errorHandler
app.use(express.json());
app.use(logger);

// ---- Seminar 1 ----
app.get("/", (req, res) => {
  res.json({ message: "Library API", version: "1.0.0" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// password-ыг хэзээ ч response-д буцаахгүй
app.get("/profile", (req, res) => {
  res.json({ name: "Bat", role: "USER", email: "bat@example.com" });
});

// Seminar 1 бие даалт: /about, /students, /courses
app.get("/about", (req, res) => {
  res.json({ app: "Library API", description: "Номын сангийн REST API" });
});

app.get("/students", (req, res) => {
  res.json([
    { id: 1, name: "Bat" },
    { id: 2, name: "Saraa" },
  ]);
});

app.get("/courses", (req, res) => {
  res.json([
    { id: 1, title: "Node.js" },
    { id: 2, title: "Express" },
    { id: 3, title: "Prisma" },
  ]);
});

// ---- Seminar 3–6 ----
app.use("/books", booksRouter);
app.use("/authors", authorsRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
