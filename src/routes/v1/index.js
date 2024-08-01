const { Router } = require("express");
const router = Router();
const bookRouter = require("./book");

router.use("/book", bookRouter);

module.exports = router;
