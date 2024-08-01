const { Router } = require("express");
const router = Router();
const {
  addBookController,
  getBookListController,
  getBookDetailController,
  updateBookController,
  deleteBookController,
} = require("../../../controllers/v1/book.controller");

// add book
router.post("/", addBookController);

// get book list
router.get("/", getBookListController);

// get book detail
router.get("/:id", getBookDetailController);

// update book
router.put("/:id", updateBookController);

// delete book
router.delete("/:id", deleteBookController);

module.exports = router;
