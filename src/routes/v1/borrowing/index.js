const { Router } = require("express");
const router = Router();
const {
  borrowBookController,
  returnBookController,
  getAllBorrowingsController,
} = require("../../../controllers/v1/borrowing.controller");

// borrow book
router.post("/", borrowBookController);

// return book
router.put("/:id/return", returnBookController);

// get borrowing list
router.get("/", getAllBorrowingsController);

module.exports = router;
