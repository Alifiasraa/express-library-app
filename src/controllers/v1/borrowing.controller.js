const prisma = require("../../../config/prisma");
const {
  borrowBook,
  returnBook,
  getAllBorrowings,
} = require("../../models/v1/borrowing.model");

const borrowBookController = async (req, res) => {
  const { memberId, bookId } = req.body;
  try {
    const member = await prisma.member.findUnique({
      where: {
        id: memberId,
      },
    });
    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    // check member
    if (!member) {
      return res.status(404).json({
        status: "fail",
        message: "Member not found",
      });
    }
    if (member.penalty === true) {
      return res.status(403).json({
        status: "fail",
        message: "Member is currently penalized and cannot borrow books",
      });
    }
    if (member.booksBorrowed >= 2) {
      return res.status(400).json({
        status: "fail",
        message: "Member may not borrow more than 2 books at a time",
      });
    }

    // check book
    if (!book || book.stock <= 0) {
      return res.status(404).json({
        status: "fail",
        message: "Book not available or out of stock",
      });
    }

    // check if the book is already borrowed by another member
    const existingBorrowing = await prisma.borrowing.findFirst({
      where: {
        bookId,
        returnedAt: null,
      },
    });
    if (existingBorrowing) {
      return res.status(400).json({
        status: "fail",
        message: "This book is currently borrowed by another member",
      });
    }

    const borrowing = await borrowBook({ memberId, bookId });
    res.status(201).json({
      status: "success",
      message: "Book borrowed successfully.",
      data: borrowing,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const returnBookController = async (req, res) => {
  const { memberId, bookId } = req.body;
  try {
    const ongoingBorrowing = await prisma.borrowing.findFirst({
      where: {
        memberId,
        bookId,
        returnedAt: null,
      },
    });
    if (!ongoingBorrowing) {
      return res.status(400).json({
        status: "fail",
        message:
          "This book was not borrowed by the member or has already been returned.",
      });
    }

    const borrowing = await returnBook(memberId, bookId);
    res.status(200).json({
      status: "success",
      message: "Book returned successfully.",
      data: borrowing,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getAllBorrowingsController = async (req, res) => {
  try {
    const borrowings = await getAllBorrowings();
    res.status(200).json({
      status: "success",
      message: "Borrowing records retrieved successfully.",
      data: borrowings,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports = {
  borrowBookController,
  returnBookController,
  getAllBorrowingsController,
};
