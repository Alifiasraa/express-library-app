const prisma = require("../config/prisma");
const {
  addBookController,
  getBookListController,
  getBookDetailController,
  updateBookController,
  deleteBookController,
} = require("../src/controllers/v1/book.controller");
const {
  addBook,
  getBookList,
  getBookDetail,
  updateBook,
  deleteBook,
} = require("../src/models/v1/book.model");

jest.mock("../src/models/v1/book.model");
jest.mock("../config/prisma", () => ({
  book: {
    findUnique: jest.fn(),
  },
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("addBookController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should add a book successfully", async () => {
    const req = {
      body: {
        code: "JK-45",
        title: "Harry Potter",
        author: "J.K Rowling",
        stock: 10,
      },
    };
    const res = mockResponse();

    addBook.mockResolvedValue(req.body);

    await addBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Book added successfully",
      data: req.body,
    });
  });

  test("should return error if required fields are missing", async () => {
    const req = { body: { code: "JK-45", title: "", author: "", stock: 10 } };
    const res = mockResponse();

    await addBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Please provide all required fields",
    });
  });

  test("should return error if input types are invalid", async () => {
    const req = {
      body: {
        code: "JK-45",
        title: "Harry Potter",
        author: "J.K Rowling",
        stock: "10",
      },
    };
    const res = mockResponse();

    await addBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Invalid input types",
    });
  });

  test("should return error if stock is less than 0", async () => {
    const req = {
      body: {
        code: "JK-45",
        title: "Harry Potter",
        author: "J.K Rowling",
        stock: -5,
      },
    };
    const res = mockResponse();

    await addBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Stock must be greater than or equal to 0",
    });
  });

  test("should return error if book with the same code already exists", async () => {
    const req = {
      body: {
        code: "JK-45",
        title: "Harry Potter",
        author: "J.K Rowling",
        stock: 10,
      },
    };
    const res = mockResponse();

    prisma.book.findUnique.mockResolvedValue(req.body);

    await addBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Book with this code already exists.",
    });
  });

  test("should handle server errors", async () => {
    const req = {
      body: {
        code: "JK-45",
        title: "Harry Potter",
        author: "J.K Rowling",
        stock: 10,
      },
    };
    const res = mockResponse();
    const errorMessage = "Internal server error";

    prisma.book.findUnique.mockResolvedValue(null);
    addBook.mockRejectedValue(new Error(errorMessage));

    await addBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: errorMessage,
    });
  });
});

describe("getBookListController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should retrieve book list successfully", async () => {
    const req = {};
    const res = mockResponse();
    const books = [
      {
        id: 1,
        code: "JK-45",
        title: "Harry Potter",
        author: "J.K Rowling",
        stock: 10,
      },
      {
        id: 2,
        code: "SHR-1",
        title: "A Study in Scarlet",
        author: "Arthur Conan Doyle",
        stock: 5,
      },
    ];

    getBookList.mockResolvedValue(books);

    await getBookListController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Book retrieved successfully",
      data: books,
    });
  });

  test("should return 500 if there is an error during the process", async () => {
    const req = {};
    const res = mockResponse();
    const errorMessage = "Internal server error";

    getBookList.mockRejectedValue(new Error(errorMessage));

    await getBookListController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: errorMessage,
    });
  });
});

describe("getBookDetailController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return book details successfully if book is found", async () => {
    const req = { params: { id: "1" } };
    const res = mockResponse();
    const book = {
      id: 1,
      code: "JK-45",
      title: "Harry Potter",
      author: "J.K Rowling",
      stock: 10,
    };

    getBookDetail.mockResolvedValue(book);

    await getBookDetailController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Book retrieved successfully",
      data: book,
    });
  });

  test("should return 404 if book is not found", async () => {
    const req = { params: { id: "1" } };
    const res = mockResponse();

    getBookDetail.mockResolvedValue(null);

    await getBookDetailController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Book not found",
    });
  });

  test("should return 500 if there is an error during the process", async () => {
    const req = { params: { id: "1" } };
    const res = mockResponse();
    const errorMessage = "Internal server error";

    getBookDetail.mockRejectedValue(new Error(errorMessage));

    await getBookDetailController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: errorMessage,
    });
  });
});

describe("updateBookController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should update a book successfully", async () => {
    const req = {
      params: { id: "1" },
      body: { title: "Updated Title", author: "Updated Author" },
    };
    const res = mockResponse();
    const updatedBook = {
      id: 1,
      code: "JK-45",
      title: "Updated Title",
      author: "Updated Author",
      stock: 10,
    };

    updateBook.mockResolvedValue(updatedBook);

    await updateBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Book updated successfully",
      data: updatedBook,
    });
  });

  test("should return 500 if there is an error during the process", async () => {
    const req = { params: { id: "1" }, body: { title: "Updated Title" } };
    const res = mockResponse();
    const errorMessage = "Internal server error";

    updateBook.mockRejectedValue(new Error(errorMessage));

    await updateBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: errorMessage,
    });
  });
});

describe("deleteBookController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should delete a book successfully", async () => {
    const req = { params: { id: "1" } };
    const res = mockResponse();
    const deletedBook = {
      id: 1,
      code: "JK-45",
      title: "Harry Potter",
      author: "J.K Rowling",
      stock: 10,
    };

    deleteBook.mockResolvedValue(deletedBook);

    await deleteBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Book deleted successfully",
      data: deletedBook,
    });
  });

  test("should return 500 if there is an error during the process", async () => {
    const req = { params: { id: "1" } };
    const res = mockResponse();
    const errorMessage = "Internal server error";

    deleteBook.mockRejectedValue(new Error(errorMessage));

    await deleteBookController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: errorMessage,
    });
  });
});
