// node prisma/seed.js
import { prisma } from "../src/db.js";

// Дахин ажиллуулахад "Unique constraint failed: email" гарахгүйн тулд эхлээд цэвэрлэнэ
await prisma.book.deleteMany();
await prisma.author.deleteMany();

const bat = await prisma.author.create({
  data: { name: "Бат", email: "bat@mail.mn" },
});
const saraa = await prisma.author.create({
  data: { name: "Сараа", email: "saraa@mail.mn" },
});

await prisma.book.createMany({
  data: [
    { title: "Node.js Basics", price: 45000, authorId: bat.id },
    { title: "Express in Action", price: 52000, authorId: bat.id },
    { title: "SQL for Kids", price: 30000, authorId: saraa.id },
  ],
});

console.log("Seed OK:", { bat: bat.id, saraa: saraa.id });
await prisma.$disconnect();
