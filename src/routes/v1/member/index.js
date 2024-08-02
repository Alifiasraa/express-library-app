const { Router } = require("express");
const router = Router();
const {
  addMemberController,
  getMemberListController,
  getMemberDetailController,
  updateMemberController,
  deleteMemberController,
} = require("../../../controllers/v1/member.controller");

// add member
router.post("/", addMemberController);

// get member list
router.get("/", getMemberListController);

// get member detail
router.get("/:id", getMemberDetailController);

// update member
router.put("/:id", updateMemberController);

// delete member
router.delete("/:id", deleteMemberController);

module.exports = router;
