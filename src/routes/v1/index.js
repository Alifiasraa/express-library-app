const { Router } = require("express");
const router = Router();
const bookRouter = require("./book");
const memberRouter = require("./member");

router.use("/books", bookRouter);
router.use("/members", memberRouter);

module.exports = router;
