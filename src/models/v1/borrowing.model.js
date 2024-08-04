const prisma = require("../../../config/prisma");

const borrowBook = async (data) => {
  const { memberId, bookId } = data;
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const borrowing = await prisma.borrowing.create({
        data: {
          memberId,
          bookId,
        },
      });

      // update member
      await prisma.member.update({
        where: { id: memberId },
        data: {
          booksBorrowed: {
            increment: 1,
          },
        },
      });

      // update book
      await prisma.book.update({
        where: { id: bookId },
        data: {
          stock: {
            decrement: 1,
          },
        },
      });

      return borrowing;
    });

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const returnBook = async (memberId, bookId) => {
  try {
    const borrowing = await prisma.borrowing.findFirst({
      where: {
        memberId,
        bookId,
        returnedAt: null,
      },
    });

    // check pinalty
    const borrowedAt = new Date(borrowing.borrowedAt);
    const returnedAt = new Date();
    const differenceInTime = returnedAt - borrowedAt;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays > 7) {
      const penaltyEndDate = new Date();
      penaltyEndDate.setDate(penaltyEndDate.getDate() + 3);

      await prisma.member.update({
        where: {
          id: memberId,
        },
        data: {
          penalty: true,
          penaltyEndDate: penaltyEndDate,
        },
      });
    }

    // Update the borrowing record with the returned date
    const result = await prisma.$transaction(async (prisma) => {
      const borrowing = await prisma.borrowing.updateMany({
        where: {
          memberId,
          bookId,
          returnedAt: null,
        },
        data: {
          returnedAt,
        },
      });

      // update member
      await prisma.member.update({
        where: { id: memberId },
        data: {
          booksBorrowed: {
            decrement: 1,
          },
        },
      });

      // update book
      await prisma.book.update({
        where: { id: bookId },
        data: {
          stock: {
            increment: 1,
          },
        },
      });

      return borrowing;
    });

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllBorrowings = async () => {
  try {
    const result = await prisma.borrowing.findMany();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  borrowBook,
  returnBook,
  getAllBorrowings,
};
