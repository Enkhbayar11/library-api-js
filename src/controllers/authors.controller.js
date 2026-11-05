import { prisma } from "../db.js";

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "id must be a positive integer" });
    return null;
  }
  return id;
}

// GET /authors — зохиолч бүрийн номын тоотой
export async function getAuthors(req, res) {
  const authors = await prisma.author.findMany({
    include: { _count: { select: { books: true } } },
    orderBy: { id: "asc" },
  });
  res.json(authors);
}

// GET /authors/:id
export async function getAuthor(req, res) {
  const id = parseId(req, res);
  if (id === null) return;

  const author = await prisma.author.findUnique({
    where: { id },
    include: { books: true },
  });
  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }
  res.json(author);
}

// POST /authors { name, email }
export async function createAuthor(req, res) {
  const { name, email } = req.body ?? {};
  if (!name || !email) {
    return res.status(400).json({ message: "name and email are required" });
  }

  try {
    const author = await prisma.author.create({ data: { name, email } });
    res.status(201).json(author);
  } catch (err) {
    if (err.code === "P2002") {
      // Unique constraint failed: email
      return res.status(409).json({ message: "Email already exists" });
    }
    throw err;
  }
}

// GET /authors/:id/books
export async function getAuthorBooks(req, res) {
  const authorId = parseId(req, res);
  if (authorId === null) return;

  const author = await prisma.author.findUnique({
    where: { id: authorId },
    include: { books: true },
  });
  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }
  res.json(author.books);
}
