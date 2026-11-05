// Seminar 2–3: Prisma-аас өмнөх санах ойн (in-memory) хувилбар.
// Seminar 5-аас хойш app энэ файлыг ашиглахгүй — лавлагаа болгож үлдээв.

export const books = [
  { id: 1, title: "Node", price: 45000, isAvailable: true },
  { id: 2, title: "Express", price: 52000, isAvailable: true },
  { id: 3, title: "Prisma", price: 61000, isAvailable: false },
];

let nextId = 4;

// ---- Seminar 2: туслах функцүүд ----
export function sum(a, b) {
  return a + b;
}

export function isExpensive(book) {
  return book.price > 50000;
}

export function getTitles(list) {
  return list.map((book) => book.title);
}

export function countAvailable(list = books) {
  return list.filter((book) => book.isAvailable).length;
}

export const formatPrice = (price) => `${price.toLocaleString("en-US")}₮`;

export function findBookById(id) {
  return books.find((book) => book.id === id);
}

export function searchByTitle(keyword) {
  return books.filter((book) =>
    book.title.toLowerCase().includes(keyword.toLowerCase())
  );
}

// DB-г дуурайсан асинхрон функц (await-гүй дуудвал {} буцна)
export function getBooksFromDb() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(books), 500);
  });
}

export function getBookOrThrow(id) {
  const book = findBookById(id);
  if (!book) throw new Error("Book not found");
  return book;
}

// ---- Seminar 3: CRUD ----
export function addBook(input) {
  const book = { id: nextId++, isAvailable: true, ...input };
  books.push(book);
  return book;
}

export function updateBook(id, changes) {
  const book = findBookById(id);
  if (!book) return null;
  Object.assign(book, changes);
  return book;
}

export function removeBook(id) {
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) return false;
  books.splice(index, 1);
  return true;
}
