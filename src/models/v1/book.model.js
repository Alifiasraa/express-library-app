const prisma = require("../../../config/prisma");

const addBook = async (data) => {
  const { code, title, author, stock } = data;
  try {
    const result = await prisma.book.create({
      data: {
        code,
        title,
        author,
        stock,
      },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getBookList = async () => {
  try {
    const borrowedBooks = await prisma.borrowing.findMany({
      where: {
        returnedAt: null,
      },
      select: {
        bookId: true,
      },
    });

    const borrowedBookIds = borrowedBooks.map((borrowing) => borrowing.bookId);

    const result = await prisma.book.findMany({
      where: {
        id: {
          notIn: borrowedBookIds,
        },
      },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getBookDetail = async (id) => {
  try {
    const result = await prisma.book.findUnique({
      where: {
        id: id,
      },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateBook = async (id, reqBody) => {
  try {
    const result = await prisma.book.update({
      where: {
        id: id,
      },
      data: reqBody,
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteBook = async (id) => {
  try {
    await prisma.book.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  addBook,
  getBookList,
  getBookDetail,
  updateBook,
  deleteBook,
};
