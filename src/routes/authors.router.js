import { Router } from "express";
import * as c from "../controllers/authors.controller.js";

const router = Router();

router.get("/", c.getAuthors);
router.get("/:id", c.getAuthor);
router.post("/", c.createAuthor);
router.get("/:id/books", c.getAuthorBooks);

export default router;
