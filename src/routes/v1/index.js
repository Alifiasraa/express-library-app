const { Router } = require("express");
const router = Router();
const bookRouter = require("./book");
const memberRouter = require("./member");
const borrowingRouter = require("./borrowing");

router.use("/books", bookRouter);
router.use("/members", memberRouter);
router.use("/borrowings", borrowingRouter);

module.exports = router;
