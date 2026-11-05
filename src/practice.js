// Seminar 2 дасгал:  npm run practice
import {
  books,
  sum,
  isExpensive,
  getTitles,
  countAvailable,
  formatPrice,
  findBookById,
  searchByTitle,
  getBooksFromDb,
  getBookOrThrow,
} from "./data/books.js";

// ---- 1. Object ----
const book = {
  id: 1,
  title: "Node.js Basics",
  author: "Bat",
  price: 45000,
  isAvailable: true,
};

console.log(book.title);    // Node.js Basics
console.log(book["title"]); // Node.js Basics
console.log(book.isbn);     // undefined — байхгүй талбар

book.price = 50000;
console.log(book.price);    // 50000

// ---- 2. map ----
const titles = books.map((book) => book.title);
const labels = books.map((book) => `${book.title} -- ${book.price}`);

console.log(titles);        // [ 'Node', 'Express', 'Prisma' ]
console.log(labels);        // [ 'Node -- 45000', 'Express -- 52000', 'Prisma -- 61000' ]
console.log(books.length);  // 3

// ---- 3. filter, find ----
const cheap = books.filter((book) => book.price < 50000);
const available = books.filter((book) => book.isAvailable);
const book3 = books.find((book) => book.id === 3);

console.log(cheap);                        // [ { id: 1, title: 'Node', ... } ]
console.log(available);                    // id 1, 2
console.log(book3 ?? "not found");         // { id: 3, ... }
console.log(findBookById(99) ?? "not found"); // not found

// ---- 4. Функцүүд ----
console.log(sum(2, 3));                // 5
console.log(isExpensive(books[1]));    // true (52000 > 50000)
console.log(getTitles(books));         // [ 'Node', 'Express', 'Prisma' ]
console.log(countAvailable(books));    // 2
console.log(formatPrice(45000));       // 45,000₮
console.log(searchByTitle("NODE"));    // [ { id: 1, title: 'Node', ... } ]

// ---- 5. async/await ----
const notAwaited = getBooksFromDb();
console.log(notAwaited);               // Promise { <pending> }  → res.json-д {} болно
const fromDb = await getBooksFromDb();
console.log(fromDb.length);            // 3

// ---- 6. throw / try-catch ----
try {
  getBookOrThrow(99);
} catch (error) {
  console.log(error.message);          // Book not found
}
