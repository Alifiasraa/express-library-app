const prisma = require("../../../config/prisma");
const {
  addMember,
  getMemberList,
  getMemberDetail,
  updateMember,
  deleteMember,
} = require("../../models/v1/member.model");

const addMemberController = async (req, res) => {
  const { code, name } = req.body;

  // Check if all required fields are provided
  if (!code || !name) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  // Ensure the input types are valid
  if (typeof code !== "string" || typeof name !== "string") {
    return res.status(400).json({
      status: "fail",
      message: "Invalid input types",
    });
  }

  // Check if a member with the same 'code' already exists in the database, return a 400 response
  const existingMember = await prisma.member.findUnique({
    where: { code: code },
  });
  if (existingMember) {
    return res.status(400).json({
      status: "fail",
      message: "Member with this code already exists.",
    });
  }

  try {
    const member = await addMember({
      code,
      name,
    });
    res.status(201).json({
      status: "success",
      message: "Member added successfully",
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getMemberListController = async (req, res) => {
  try {
    const member = await getMemberList();
    res.status(200).json({
      status: "success",
      message: "Member retrieved successfully",
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getMemberDetailController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const member = await getMemberDetail(id);
    if (!member) {
      return res.status(404).json({
        status: "fail",
        message: "Member not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Member retrieved successfully",
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const updateMemberController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const member = await updateMember(id, req.body);
    res.status(200).json({
      status: "success",
      message: "Member updated successfully",
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const deleteMemberController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await deleteMember(id);
    res.status(200).json({
      status: "success",
      message: "Member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports = {
  addMemberController,
  getMemberListController,
  getMemberDetailController,
  updateMemberController,
  deleteMemberController,
};
