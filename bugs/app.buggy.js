// ⚠️ ЭНЭ ФАЙЛ АЛДААТАЙ — Seminar 4-ийн даалгаврын анхны код (ажиллуулахгүй).
// Зассан хувилбар: src/app.js. Алдаа бүрийг доор тэмдэглэв.

import express from "express";
import booksRouter from "./routes/books.router"; // ❌ 1: ".js" дутуу → ERR_MODULE_NOT_FOUND

const app = express();

app.use(notFound);     // ❌ 2: notFound route-уудаас ӨМНӨ → бүх хүсэлт 404 (бас import хийгээгүй)
app.use(booksRouter);  // ❌ 3: "/books" угтвар алга → /books/1 биш /1 болно

function logger(req, res) { // ❌ 4: next параметр алга, next() дуудаагүй → хүсэлт гацна
  console.log(req.method, req.url);
}
app.use(logger);       // ❌ 5: logger route-уудын ДАРАА → хэзээ ч ажиллахгүй

app.use(express.json()); // ❌ 6: express.json() хамгийн сүүлд → req.body undefined

app.listen(3000);
// ❌ 7: errorHandler огт байхгүй
