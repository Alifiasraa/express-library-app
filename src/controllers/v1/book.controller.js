const prisma = require("../../../config/prisma");
const {
  addBook,
  getBookList,
  getBookDetail,
  updateBook,
  deleteBook,
} = require("../../models/v1/book.model");

const addBookController = async (req, res) => {
  const { code, title, author, stock } = req.body;

  // Check if all required fields are provided
  if (!code || !title || !author || !stock) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  // Ensure the input types are valid
  if (
    typeof code !== "string" ||
    typeof title !== "string" ||
    typeof author !== "string" ||
    typeof stock !== "number"
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid input types",
    });
  }

  // Check if stock is greater than or equal to 0
  if (stock < 0) {
    return res.status(400).json({
      status: "fail",
      message: "Stock must be greater than or equal to 0",
    });
  }

  // Check if a book with the same 'code' already exists in the database, return a 400 response
  const existingBook = await prisma.book.findUnique({
    where: { code: code },
  });
  if (existingBook) {
    return res.status(400).json({
      status: "fail",
      message: "Book with this code already exists.",
    });
  }

  try {
    const book = await addBook({
      code,
      title,
      author,
      stock,
    });
    res.status(201).json({
      status: "success",
      message: "Book added successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getBookListController = async (req, res) => {
  try {
    const book = await getBookList();
    res.status(200).json({
      status: "success",
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getBookDetailController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const book = await getBookDetail(id);
    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "Book not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const updateBookController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const book = await updateBook(id, req.body);
    res.status(200).json({
      status: "success",
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const deleteBookController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const book = await deleteBook(id);
    res.status(200).json({
      status: "success",
      message: "Book deleted successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports = {
  addBookController,
  getBookListController,
  getBookDetailController,
  updateBookController,
  deleteBookController,
};
