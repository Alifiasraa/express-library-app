const prisma = require("../config/prisma");
const {
  borrowBookController,
  returnBookController,
  getAllBorrowingsController,
} = require("../src/controllers/v1/borrowing.controller");
const {
  borrowBook,
  returnBook,
  getAllBorrowings,
} = require("../src/models/v1/borrowing.model");

jest.mock("../src/models/v1/borrowing.model");
jest.mock("../config/prisma", () => ({
  member: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
  },
  book: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
  },
  borrowing: {
    findFirst: jest.fn(),
  },
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("borrowBookController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should borrow book successfully", async () => {
    const req = {
      body: { memberId: 1, bookId: 1 },
    };
    const res = mockResponse();

    prisma.member.findUnique.mockResolvedValue({
      id: 1,
      penalty: false,
      booksBorrowed: 1,
    });
    prisma.book.findUnique.mockResolvedValue({
      id: 1,
      stock: 5,
    });
    prisma.borrowing.findFirst.mockResolvedValue(null);
    borrowBook.mockResolvedValue({
      memberId: 1,
      bookId: 1,
      borrowedAt: new Date(),
    });

    await borrowBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Book borrowed successfully.",
      data: {
        memberId: 1,
        bookId: 1,
        borrowedAt: expect.any(Date),
      },
    });
  });

  test("should return 404 if member is not found", async () => {
    const req = {
      body: { memberId: 1, bookId: 1 },
    };
    const res = mockResponse();

    prisma.member.findUnique.mockResolvedValue(null);

    await borrowBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Member not found",
    });
  });

  test("should return 403 if member is penalized", async () => {
    const req = {
      body: { memberId: 1, bookId: 1 },
    };
    const res = mockResponse();

    prisma.member.findUnique.mockResolvedValue({
      id: 1,
      penalty: true,
      booksBorrowed: 1,
    });

    await borrowBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Member is currently penalized and cannot borrow books",
    });
  });

  test("should return 400 if member has borrowed more than 2 books", async () => {
    const req = {
      body: { memberId: 1, bookId: 1 },
    };
    const res = mockResponse();

    prisma.member.findUnique.mockResolvedValue({
      id: 1,
      penalty: false,
      booksBorrowed: 2,
    });

    await borrowBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Member may not borrow more than 2 books at a time",
    });
  });

  test("should return 404 if book is not available or out of stock", async () => {
    const req = {
      body: { memberId: 1, bookId: 1 },
    };
    const res = mockResponse();

    prisma.member.findUnique.mockResolvedValue({
      id: 1,
      penalty: false,
      booksBorrowed: 1,
    });
    prisma.book.findUnique.mockResolvedValue(null);

    await borrowBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Book not available or out of stock",
    });
  });

  test("should return 400 if book is already borrowed by another member", async () => {
    const req = {
      body: { memberId: 1, bookId: 1 },
    };
    const res = mockResponse();

    prisma.member.findUnique.mockResolvedValue({
      id: 1,
      penalty: false,
      booksBorrowed: 1,
    });
    prisma.book.findUnique.mockResolvedValue({
      id: 1,
      stock: 5,
    });
    prisma.borrowing.findFirst.mockResolvedValue({
      id: 1,
      bookId: 1,
      returnedAt: null,
    });

    await borrowBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "This book is currently borrowed by another member",
    });
  });

  test("should handle internal server errors", async () => {
    const req = {
      body: { memberId: 1, bookId: 1 },
    };
    const res = mockResponse();
    const errorMessage = "Internal server error";

    prisma.member.findUnique.mockRejectedValue(new Error(errorMessage));

    await borrowBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: errorMessage,
    });
  });
});

describe("Return Book Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return book successfully", async () => {
    const req = { body: { memberId: 1, bookId: 1 } };
    const res = mockResponse();
    const borrowing = { memberId: 1, bookId: 1, returnedAt: new Date() };

    prisma.borrowing.findFirst.mockResolvedValue(borrowing);
    returnBook.mockResolvedValue(borrowing);

    await returnBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Book returned successfully.",
      data: borrowing,
    });
  });

  test("should return 400 if the book was not borrowed or has already been returned", async () => {
    const req = { body: { memberId: 1, bookId: 1 } };
    const res = mockResponse();

    prisma.borrowing.findFirst.mockResolvedValue(null);

    await returnBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message:
        "This book was not borrowed by the member or has already been returned.",
    });
  });

  test("should return 500 on internal server error", async () => {
    const req = {
      body: {
        memberId: 1,
        bookId: 1,
      },
    };
    const res = mockResponse();
    const errorMessage = "Internal server error";

    prisma.borrowing.findFirst.mockResolvedValue({});

    returnBook.mockRejectedValue(new Error(errorMessage));

    await returnBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: errorMessage,
    });
  });
});

describe("getAllBorrowings", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return a list of borrowings successfully", async () => {
    const req = {};
    const res = mockResponse();
    const borrowings = [
      {
        id: 1,
        memberId: 1,
        bookId: 1,
        borrowedAt: "2024-08-02T18:25:09.458Z",
        returnedAt: "2024-08-02T19:09:45.199Z",
      },
      {
        id: 2,
        memberId: 2,
        bookId: 2,
        borrowedAt: "2024-08-02T18:04:18.761Z",
        returnedAt: "2024-08-02T19:13:58.023Z",
      },
    ];

    getAllBorrowings.mockResolvedValue(borrowings);

    await getAllBorrowingsController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Borrowing records retrieved successfully.",
      data: borrowings,
    });
  });

  test("should throw an error if there is a database error", async () => {
    const req = {};
    const res = mockResponse();
    const errorMessage = "Internal server error";

    // Mock the getBookList function to throw an error
    getAllBorrowings.mockRejectedValue(new Error(errorMessage));

    await getAllBorrowingsController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: errorMessage,
    });
  });
});
