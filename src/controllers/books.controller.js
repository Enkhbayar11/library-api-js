import { prisma } from "../db.js";

// "abc" → 400 (NaN-ээр Prisma руу явуулахгүй)
function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "id must be a positive integer" });
    return null;
  }
  return id;
}

// GET /books   (?q=node байвал гарчгаар хайна, том жижиг үсэг хамаагүй)
export async function list(req, res) {
  const q = req.query.q;
  const books = await prisma.book.findMany({
    where: q ? { title: { contains: String(q), mode: "insensitive" } } : undefined,
    include: { author: true },
    orderBy: { id: "asc" },
  });
  res.json(books);
}

// GET /books/search?q=node
export async function search(req, res) {
  const q = String(req.query.q ?? "");
  const books = await prisma.book.findMany({
    where: { title: { contains: q, mode: "insensitive" } },
    include: { author: true },
    orderBy: { id: "asc" },
  });
  res.json(books);
}

// GET /books/:id
export async function getOne(req, res) {
  const id = parseId(req, res);
  if (id === null) return;

  const book = await prisma.book.findUnique({
    where: { id },
    include: { author: true },
  });
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(book);
}

// POST /books { title, price, authorId }
export async function create(req, res) {
  const { title, price, authorId } = req.body ?? {};

  // return-гүй бол "Cannot set headers after they are sent" гарна (Seminar 4)
  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "title is required" });
  }
  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({ message: "price must be a non-negative number" });
  }
  if (!Number.isInteger(authorId)) {
    return res.status(400).json({ message: "authorId is required" });
  }

  try {
    const book = await prisma.book.create({
      data: { title, price, authorId },
    });
    res.status(201).json(book);
  } catch (err) {
    if (err.code === "P2003") {
      // Foreign key constraint failed — ийм author байхгүй
      return res.status(400).json({ message: "Author not found" });
    }
    throw err;
  }
}

// PATCH /books/:id { price: 50000 }
export async function update(req, res) {
  const id = parseId(req, res);
  if (id === null) return;

  // Зөвхөн зөвшөөрөгдсөн талбаруудыг авна
  const { title, price, isAvailable, authorId } = req.body ?? {};
  const data = {};
  if (title !== undefined) data.title = title;
  if (price !== undefined) data.price = price;
  if (isAvailable !== undefined) data.isAvailable = isAvailable;
  if (authorId !== undefined) data.authorId = authorId;

  try {
    const book = await prisma.book.update({ where: { id }, data });
    res.json(book);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Book not found" });
    }
    if (err.code === "P2003") {
      return res.status(400).json({ message: "Author not found" });
    }
    if (err.name === "PrismaClientValidationError") {
      return res.status(400).json({ message: "Invalid field value" });
    }
    throw err;
  }
}

// DELETE /books/:id
export async function remove(req, res) {
  const id = parseId(req, res);
  if (id === null) return;

  try {
    await prisma.book.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Book not found" });
    }
    throw err;
  }
}
