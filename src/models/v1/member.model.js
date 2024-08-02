const prisma = require("../../../config/prisma");

const addMember = async (data) => {
  const { code, name } = data;
  try {
    const result = await prisma.member.create({
      data: {
        code,
        name,
      },
      include: {
        borrowings: true,
      },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMemberList = async () => {
  try {
    const result = await prisma.member.findMany();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMemberDetail = async (id) => {
  try {
    const result = await prisma.member.findUnique({
      where: {
        id: id,
      },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateMember = async (id, reqBody) => {
  try {
    const result = await prisma.member.update({
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

const deleteMember = async (id) => {
  try {
    await prisma.member.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {}
};

module.exports = {
  addMember,
  getMemberList,
  getMemberDetail,
  updateMember,
  deleteMember,
};
