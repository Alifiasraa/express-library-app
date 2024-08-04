const prisma = require("../config/prisma");
const {
  addMemberController,
  getMemberListController,
  getMemberDetailController,
  updateMemberController,
  deleteMemberController,
} = require("../src/controllers/v1/member.controller");
const {
  addMember,
  getMemberList,
  getMemberDetail,
  updateMember,
  deleteMember,
} = require("../src/models/v1/member.model");

jest.mock("../src/models/v1/member.model");
jest.mock("../config/prisma", () => ({
  member: {
    findUnique: jest.fn(),
  },
}));

// Mock response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("addMemberController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should add a member successfully", async () => {
    const req = {
      body: {
        code: "M001",
        name: "John Doe",
      },
    };
    const res = mockResponse();

    addMember.mockResolvedValue(req.body);

    await addMemberController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Member added successfully",
      data: req.body,
    });
  });

  test("should return error if member already exists", async () => {
    const req = {
      body: {
        code: "M001",
        name: "John Doe",
      },
    };
    const res = mockResponse();

    prisma.member.findUnique.mockResolvedValue(req.body);

    await addMemberController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Member with this code already exists.",
    });
  });

  test("should return error if required fields are missing", async () => {
    const req = {
      body: {
        code: "M001",
        // Missing name
      },
    };
    const res = mockResponse();

    await addMemberController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Please provide all required fields",
    });
  });

  test("should return error if input types are invalid", async () => {
    const req = {
      body: {
        code: "M001",
        name: 123, // Invalid type
      },
    };
    const res = mockResponse();

    await addMemberController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Invalid input types",
    });
  });

  test("should handle internal server errors", async () => {
    const req = {
      body: {
        code: "M001",
        name: "Angga",
      },
    };
    const res = mockResponse();
    const errorMessage = "Internal server error";

    prisma.member.findUnique.mockResolvedValue(null);
    addMember.mockRejectedValue(new Error(errorMessage));

    await addMemberController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: errorMessage,
    });
  });
});

describe("getMemberListController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should retrieve the list of members successfully", async () => {
    const req = {};
    const res = mockResponse();
    const members = [
      {
        id: 1,
        code: "M001",
        name: "John Doe",
        booksBorrowed: 0,
        penalty: false,
        penaltyEndDate: null,
      },
      {
        id: 2,
        code: "M002",
        name: "Jane Doe",
        booksBorrowed: 0,
        penalty: false,
        penaltyEndDate: null,
      },
    ];

    getMemberList.mockResolvedValue(members);

    await getMemberListController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Member retrieved successfully",
      data: members,
    });
  });

  test("should handle internal server errors", async () => {
    const req = {};
    const res = mockResponse();
    const errorMessage = "Internal server error";

    getMemberList.mockRejectedValue(new Error(errorMessage));

    await getMemberListController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: errorMessage,
    });
  });
});

describe("getMemberDetailController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should retrieve member details successfully", async () => {
    const req = { params: { id: "1" } };
    const res = mockResponse();
    const member = {
      id: 1,
      code: "M001",
      name: "John Doe",
      booksBorrowed: 0,
      penalty: false,
      penaltyEndDate: null,
    };

    getMemberDetail.mockResolvedValue(member);

    await getMemberDetailController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Member retrieved successfully",
      data: member,
    });
  });

  test("should return 404 if member not found", async () => {
    const req = { params: { id: "1" } };
    const res = mockResponse();

    getMemberDetail.mockResolvedValue(null);

    await getMemberDetailController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Member not found",
    });
  });

  test("should handle internal server errors", async () => {
    const req = { params: { id: "1" } };
    const res = mockResponse();
    const errorMessage = "Internal server error";

    getMemberDetail.mockRejectedValue(new Error(errorMessage));

    await getMemberDetailController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: errorMessage,
    });
  });
});

describe("updateMemberController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should update member successfully", async () => {
    const req = {
      params: { id: "1" },
      body: { name: "Updated Name" },
    };
    const res = mockResponse();
    const updatedMember = {
      id: 1,
      code: "M001",
      name: "Updated Name",
    };

    updateMember.mockResolvedValue(updatedMember);

    await updateMemberController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Member updated successfully",
      data: updatedMember,
    });
  });

  test("should handle internal server errors", async () => {
    const req = {
      params: { id: "1" },
      body: { name: "Updated Name" },
    };
    const res = mockResponse();
    const errorMessage = "Internal server error";

    updateMember.mockRejectedValue(new Error(errorMessage));

    await updateMemberController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: errorMessage,
    });
  });
});

describe("deleteMemberController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should delete member successfully", async () => {
    const req = {
      params: { id: "1" },
    };
    const res = mockResponse();

    deleteMember.mockResolvedValue();

    await deleteMemberController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Member deleted successfully",
    });
  });

  test("should handle internal server errors", async () => {
    const req = {
      params: { id: "1" },
    };
    const res = mockResponse();
    const errorMessage = "Internal server error";

    deleteMember.mockRejectedValue(new Error(errorMessage));

    await deleteMemberController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: errorMessage,
    });
  });
});
