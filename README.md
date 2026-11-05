# Library API — Seminar 1–6

Express 5 + Prisma 6 + PostgreSQL. Seminar 1-ээс 6 хүртэлх бүх даалгавар **нэг төсөлд**.

## Ажиллуулах

```bash
npm install
```

`.env.example`-ийг `.env` болгож хуулаад нууц үгээ бичнэ (нууц үгэнд `#` байвал `%23`).

```bash
npx prisma migrate dev
npm run seed
npm run dev
```

| Команд | Юу хийдэг |
|---|---|
| `npm run dev` | Серверийг асаана (http://localhost:3000) |
| `npm run practice` | Seminar 2-ын JS дасгалуудыг ажиллуулна |
| `npm run seed` | Бат, Сараа + 3 ном оруулна |
| `npx prisma studio` | Өгөгдлийг хөтөч дээр харна |

## Бүтэц

```
library-api-js/
├─ prisma/
│  ├─ schema.prisma            Author 1→N Book                     (S5, S6)
│  ├─ migrations/
│  └─ seed.js                  Бат, Сараа + 3 ном                  (S6)
├─ src/
│  ├─ app.js                   middleware дараалал, /, /health, /profile,
│  │                           /about, /students, /courses         (S1, S3, S4)
│  ├─ db.js                    PrismaClient                        (S5)
│  ├─ practice.js              object, map/filter/find, async      (S2)
│  ├─ routes/
│  │  ├─ books.router.js       /search нь /:id-ээс өмнө            (S3, S4)
│  │  └─ authors.router.js                                         (S6)
│  ├─ controllers/
│  │  ├─ books.controller.js   prisma.book.*                       (S5, S6)
│  │  └─ authors.controller.js include, _count                     (S6)
│  ├─ middlewares/
│  │  ├─ logger.js             GET /books 200 3ms                  (S3)
│  │  └─ error.js              notFound, errorHandler              (S3)
│  └─ data/books.js            санах ойн хувилбар + функцүүд       (S2, S3)
├─ bugs/app.buggy.js           Seminar 4-ийн алдаатай код (ажиллуулахгүй)
└─ README.md
```

## Бүх route

| Хүсэлт | Хариу | Семинар |
|---|---|---|
| GET / | 200 | 1 |
| GET /health | 200 | 1 |
| GET /profile | 200 (password-гүй) | 1 |
| GET /about, /students, /courses | 200 | 1 |
| GET /books, GET /books?q=node | 200, ном бүр `author`-тай | 2, 5, 6 |
| GET /books/search?q=node | 200 | 4 |
| GET /books/:id | 200 / 404, `abc` → 400 | 1, 2, 5 |
| POST /books `{ title, price, authorId }` | 201 / 400 | 3, 5, 6 |
| PATCH /books/:id | 200 / 404 | 3, 5 |
| DELETE /books/:id | 204 / 404 | 3, 5 |
| GET /authors | 200 (`_count`) | 6 |
| GET /authors/:id | 200 / 404 | 6 |
| POST /authors `{ name, email }` | 201 / 409 | 6 |
| GET /authors/:id/books | 200 / 404 | 6 |
| GET /unknown | 404 | 3 |

POST/PATCH/DELETE-г PowerShell дээр туршина:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/books -ContentType "application/json" -Body '{"title":"Go","price":40000,"authorId":1}'
Invoke-RestMethod -Method Patch -Uri http://localhost:3000/books/1 -ContentType "application/json" -Body '{"price":50000}'
Invoke-RestMethod -Method Delete -Uri http://localhost:3000/books/2
```

> Seminar 3–4-ийн хариу `{ count, data }` хэлбэртэй байсан. Seminar 5-аас эхлэн Prisma ашигладаг болсон тул массив буцаана. Санах ойн хувилбарын код `src/data/books.js`-д хадгалагдсан.

---

# Семинар бүрийн хариулт

## Seminar 1 — Node.js + Express эхлэл

### Тохиргоо

```bash
node -v
npm -v
mkdir library-api-js
cd library-api-js
npm init -y
npm i express
code .
```

`package.json`-д `"type": "module"` болон `"dev": "node --watch src/app.js"` нэмнэ.

```bash
npm install
npm run dev
```

### Шалгах

| Хүсэлт | Хариу |
|---|---|
| GET / | 200 `{ "message": "Library API", "version": "1.0.0" }` |
| GET /health | 200 `{ "status": "ok", "uptime": ... }` |
| GET /profile | 200 `{ name, role, email }` |
| GET /books/1 | 200 `{ "id": 1, ... }` |
| GET /books/99 | 200 `{ "id": 99, ... }` |
| GET /books/abc | 200 `{ "id": null }` — `Number("abc")` = `NaN`, JSON-д `null` болно |
| GET /nothing | 404 |
| GET /about, /students, /courses | 200 (бие даалт) |

### Асуултын хариу

**/profile дээр password буцаах уу?** — Үгүй. Нууц үг, token зэрэг мэдээллийг API хэзээ ч буцааж болохгүй.

**`:id` юу вэ?** — Route parameter. `req.params.id`-ээр авна. Үргэлж **string** ирдэг тул `Number()`-ээр тоо болгоно.

### Алдаа ба шийдэл

| Алдаа | Шалтгаан | Шийдэл |
|---|---|---|
| `Cannot use import statement outside a module` | `package.json`-д `"type": "module"` алга | `"type": "module"` нэмэх |
| `Cannot find module 'express'` | express суугаагүй | `npm i express` |
| `Error: listen EADDRINUSE: address already in use :::3000` | 3000 порт өөр процесст эзлэгдсэн | Хуучин terminal-аа Ctrl+C-ээр зогсоох, эсвэл `const PORT = 4000;` болгоод `localhost:4000/health` нээх |
| `Cannot GET /health` | Ийм route бичээгүй / файл хадгалаагүй / буруу хаяг | `app.get("/health", ...)` байгаа эсэх, Ctrl+S, хаягаа шалгах |

### Git

```bash
git init
git add .
git commit -m "week1: express setup"
```

`.gitignore`:

```
node_modules
.env
```

---

## Seminar 2 — JavaScript: object, map/filter/find, module, async

### Шалгах

| Хүсэлт | Хариу |
|---|---|
| GET /books | 200 — 3 ном (0.5 сек хүлээгээд) |
| GET /books?q=node | 200 — `[{ "title": "Node" }]` |
| GET /books?q=NODE | 200 — мөн адил (том/жижиг үсэг хамаагүй) |
| GET /books/2 | 200 — Express |
| GET /books/99 | 404 `{ "message": "Book not found" }` |

### Асуултын хариу

- **`book.isbn`** → `undefined` (байхгүй талбар алдаа өгөхгүй).
- **`map`** → массивын элемент бүрийг хувиргаж, **ижил урттай шинэ массив** буцаана.
- **`filter`** → нөхцөл хангасныг **массив** болгож буцаана (юу ч олдохгүй бол `[]`).
- **`find`** → **эхний нэг** элемент, олдохгүй бол `undefined` → `??` ашиглаж `"not found"`.
- **`sc-camel-format-price`** → буруу нэр, `-` орж болохгүй → **`formatPrice`** (camelCase).
- **`async/await`** → `getBooksFromDb()` Promise буцаадаг. `await`-гүй бол `res.json(Promise)` → `{}` гарна. `async` + `await` хийвэл `[ ... 3 ном ... ]`.
- **`throw` + `try/catch`** → функц алдаа шидэж, route нь барьж аваад 404 буцаана.

### Алдаа ба шийдэл

| Алдаа | Шалтгаан | Шийдэл |
|---|---|---|
| `Cannot find module './books'` | ESM-д өргөтгөл заавал | `"./books.js"` |
| `books is not defined` | import хийгээгүй / export хийгээгүй | `export const books`, `import { books } from "./books.js"` |
| Хариу `{}` | Promise-ийг `await` хийгээгүй | `async (req, res)` + `await getBooksFromDb()` |
| `filter` хоосон массив | Хайлтын үг таараагүй, эсвэл том/жижиг үсэг | `.toLowerCase()` хоёр талд |
| `id` олдохгүй, 404 | `req.params.id` string, `"1" === 1` false | `Number(req.params.id)` |

---

## Seminar 3 — CRUD, middleware, бүтэц

### Шалгах

POST/PATCH-д `Content-Type: application/json` header заавал.

| Хүсэлт | Body | Хариу |
|---|---|---|
| GET /books | | 200 `{ count: 3, data: [...] }` |
| POST /books | `{ "title": "Docker" }` | 201 (id: 4) |
| POST /books | `{ "price": 99000 }` | 400 `title is required` |
| PATCH /books/4 | `{ "price": 100 }` | 200 |
| DELETE /books/4 | | 204 |
| DELETE /books/4 | | 404 (аль хэдийн устсан) |
| GET /unknown | | 404 `Route not found` |

PowerShell дээр:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/books -ContentType "application/json" -Body '{"title":"Docker"}'
Invoke-RestMethod -Method Patch -Uri http://localhost:3000/books/4 -ContentType "application/json" -Body '{"price":100}'
Invoke-RestMethod -Method Delete -Uri http://localhost:3000/books/4
```

### Асуултын хариу

- **`app.use(express.json())`** — body-г JSON болгож `req.body`-д хийнэ. Байхгүй бол `req.body` = `undefined`.
- **201** — шинээр үүссэн, **204** — амжилттай, хариу хоосон, **400** — буруу өгөгдөл, **404** — олдсонгүй.
- **`...input`** (spread) — input-ийн бүх талбарыг шинэ объект руу хуулна.
- **`Object.assign(book, changes)`** — байгаа объектын талбаруудыг шинэчилнэ.
- **`findIndex` + `splice`** — индексийг олоод массиваас устгана.
- **Middleware** `(req, res, next)` — хүсэлт бүр дээр ажиллана, `next()` дуудаж дараагийнх руу шилжүүлнэ.
- **`let sc-camel-next-id = 4`** буруу → **`let nextId = 4`**.

### Алдаа ба шийдэл

| Алдаа | Шалтгаан | Шийдэл |
|---|---|---|
| `TypeError: c.create is not a function` | Controller-т `create` гэж **export** хийгээгүй, эсвэл нэр зөрсөн (`createBook` гэх мэт) | `export function create(req, res)` |
| `req.body` undefined | `express.json()` алга, эсвэл Content-Type header алга | `app.use(express.json())` route-аас өмнө |
| Хүсэлт гацна | middleware `next()` дуудаагүй | `next()` |

---

## Seminar 4 — Debugging (алдаа олж засах)

### 1. app.js дахь алдаанууд

| # | Алдаатай | Зассан | Яагаад |
|---|---|---|---|
| 1 | `from "./routes/books.router"` | `from "./routes/books.router.js"` | ESM-д өргөтгөл заавал, эс бөгөөс `ERR_MODULE_NOT_FOUND` |
| 2 | `app.use(notFound)` эхэнд | route-уудын **дараа** | Middleware дарааллаар ажилладаг — эхэнд байвал бүх хүсэлт 404 |
| 3 | `app.use(booksRouter)` | `app.use("/books", booksRouter)` | Угтвар байхгүй бол `/books/1` биш `/1` болно |
| 4 | `function logger(req, res)` | `function logger(req, res, next) { ...; next(); }` | `next()` дуудахгүй бол хүсэлт **гацна** |
| 5 | `app.use(logger)` route-ийн дараа | route-оос **өмнө** | Хариу илгээгдсэний дараа хэзээ ч ажиллахгүй |
| 6 | `app.use(express.json())` сүүлд | хамгийн **эхэнд** | Эс бөгөөс `req.body` = `undefined` |
| 7 | errorHandler алга | `app.use(errorHandler)` хамгийн сүүлд | Алдааг барьж 500 буцаана |

**Зөв дараалал:**

```js
app.use(express.json());
app.use(logger);
app.use("/books", booksRouter);
app.use(notFound);
app.use(errorHandler);
app.listen(3000);
```

### 2. `"1" === 1` → false

```js
const id = req.params.id;            // ❌ "1" (string)
const book = books.find((b) => b.id === id); // үргэлж undefined → 404

const id = Number(req.params.id);    // ✅ 1 (number)
```

### 3. `Cannot set headers after they are sent to the client`

```js
if (!title) {
  res.status(400).json({ message: "title is required" }); // ❌ return алга
}
const book = addBook({ title });
res.status(201).json(book); // ← 2 дахь хариу → алдаа

if (!title) {
  return res.status(400).json({ message: "title is required" }); // ✅
}
```

### 4. Route-ийн дараалал

```js
router.get("/:id", c.getOne);     // ❌ "/search" энд баригдаж params.id = "search"
router.get("/search", c.search);

router.get("/search", c.search);  // ✅ тодорхой route эхэнд
router.get("/:id", c.getOne);
```

### Шалгах

| Хүсэлт | Хариу |
|---|---|
| GET /books | 200 |
| GET /books/1 | 200 |
| GET /books/search?q=node | 200 |
| POST /books + `{ "title": "Go" }` | 201 |
| POST /books + `{ }` | 400 |
| GET /unknown | 404 |

---

## Seminar 5 — PostgreSQL + Prisma

### 1. PostgreSQL

```bash
psql --version
psql -U postgres
```

```sql
CREATE DATABASE library;
\l
\q
```

### 2. Prisma суулгах

```bash
npm install prisma@6 --save-dev
npm install @prisma/client@6
npx prisma init
```

`npx prisma init` нь `prisma/schema.prisma` болон `.env` үүсгэнэ.

### 3. `.env`

Жишээ мөр:

```
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

| Хэсэг | Утга | Манайх |
|---|---|---|
| `johndoe` | хэрэглэгч | `postgres` |
| `randompassword` | нууц үг | өөрийн нууц үг |
| `mydb?schema=public` | өгөгдлийн сан | `library` |

```
DATABASE_URL="postgresql://postgres:1234@localhost:5432/library"
```

⚠️ Нууц үгэнд `#` байвал `%23`, `@` байвал `%40` гэж бичнэ (эс бөгөөс `P1013: invalid port number`).

### 4. Model → Migration

`prisma/schema.prisma` дотор `Book` model. Дараа нь:

```bash
npx prisma migrate dev --name init
```

```
Applying migration `..._init`
Your database is now in sync with your schema.
Generated Prisma Client
```

Өгөгдлөө харах: `npx prisma studio`

### 5. Бүтэц

```
src/
├─ db.js               PrismaClient
├─ app.js
├─ routes/books.js
├─ controllers/books.js   prisma.book.findMany/create/update/delete
└─ middlewares/
```

### 6. Нөхөх даалгаврын хариу

```js
// PATCH
const book = await prisma.book.update({
  where: { id },
  data: req.body,
});

// DELETE
await prisma.book.delete({ where: { id } });
res.status(204).end();
```

### 7. Шалгах

| Хүсэлт | Хариу |
|---|---|
| GET /books | 200 `[]` (эхэндээ хоосон) |
| POST /books `{ "title": "Node", "price": 45000 }` | 201 |
| GET /books/99 | 404 |
| PATCH /books/1 `{ "price": 50000 }` | 200 |
| DELETE /books/2 | 204 (байхгүй бол 404) |
| GET /books/abc | 400 |

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/books -ContentType "application/json" -Body '{"title":"Node","price":45000}'
```

### 8. Алдаа ба шийдэл

| Алдаа | Шалтгаан | Шийдэл |
|---|---|---|
| `Can't reach database server` | PostgreSQL асаагүй / host, порт буруу | PostgreSQL service асаах, `localhost:5432` шалгах |
| `Authentication failed` (P1000) | `.env`-ийн нууц үг/хэрэглэгч буруу | Зөв нууц үг бичих |
| `The table "Book" does not exist` | Migration хийгээгүй | `npx prisma migrate dev --name init` |
| `Cannot read properties of undefined (reading 'findMany')` | `prisma.book` undefined — `prisma generate` хийгээгүй, `db.js`-ээс import хийгээгүй, эсвэл model нэр буруу (`prisma.books`) | `npx prisma generate`, `import { prisma } from "../db.js"`, `prisma.book` (жижиг үсэг, ганц тоо) |

---

## Seminar 6 — Relation: Author 1 → N Book

### 1. Schema

`prisma/schema.prisma`:

```prisma
model Author {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
  books Book[]
}

model Book {
  ...
  authorId Int
  author   Author @relation(fields: [authorId], references: [id])
}
```

- `authorId` — бодит багана (foreign key)
- `author` — Prisma-гийн холбоос (DB-д багана биш)
- `books Book[]` — эсрэг тал. Байхгүй бол `missing an opposite relation field` алдаа гарна.

### 2. Migration

Хуучин номуудад `authorId` байхгүй тул эхлээд reset хийнэ (бүх өгөгдөл устна):

```bash
npx prisma migrate reset
npx prisma migrate dev --name add_author
```

### 3. Seed

```bash
node prisma/seed.js     # эсвэл: npm run seed
```

Бат (2 ном), Сараа (1 ном) үүснэ.

### 4. Route

```js
app.use("/authors", authorsRouter);
```

| Route | Controller |
|---|---|
| GET /authors | getAuthors (`_count`) |
| GET /authors/:id | getAuthor |
| POST /authors | createAuthor |
| GET /authors/:id/books | getAuthorBooks |

### 5. `include`

```js
const books = await prisma.book.findMany();                // зөвхөн authorId
const books = await prisma.book.findMany({
  include: { author: true },                               // author объект хамт
});
include: { _count: { select: { books: true } } }           // зөвхөн номын тоо
```

### 6. Шалгах

| Хүсэлт | Хариу |
|---|---|
| GET /authors | 200 — `_count.books` |
| GET /authors/1/books | 200 — Батын 2 ном |
| GET /authors/99/books | 404 |
| GET /books | 200 — ном бүрт `author` |
| POST /books `{ "title": "Go", "price": 40000, "authorId": 2 }` | 201 |
| POST /books `{ ..., "authorId": 99 }` | 400 (P2003) |

Seed дахин ажиллуулбал id өөрчлөгдөнө — `GET /authors`-оос бодит id-г харна.

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/books -ContentType "application/json" -Body '{"title":"Go","price":40000,"authorId":2}'
```

### 7. Алдаа ба шийдэл

| Алдаа | Шалтгаан | Шийдэл |
|---|---|---|
| `missing an opposite relation field` | `Author`-т `books Book[]` алга | `books Book[]` нэмэх |
| `Unique constraint failed on the fields: (email)` (P2002) | Ижил email-тэй author дахин үүсгэсэн (seed 2 удаа) | Өөр email, эсвэл seed-ийн эхэнд `deleteMany()` |
| `Foreign key constraint failed` (P2003) | Байхгүй `authorId`-тэй ном | Байгаа author-ийн id ашиглах → 400 буцаана |
| `Unknown argument include` | `include`-ийг дэмждэггүй функцэд (`createMany`) эсвэл `where` дотор бичсэн / relation нэр буруу | `findMany({ include: { author: true } })` |
| Migration алдаа: `Added the required column authorId without a default value` | Хуучин номуудад authorId байхгүй | `npx prisma migrate reset` |

---
