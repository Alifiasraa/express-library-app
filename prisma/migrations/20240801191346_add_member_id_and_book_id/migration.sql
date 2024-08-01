/*
  Warnings:

  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookCode` on the `Borrowing` table. All the data in the column will be lost.
  - You are about to drop the column `memberCode` on the `Borrowing` table. All the data in the column will be lost.
  - The primary key for the `Member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `bookId` to the `Borrowing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `Borrowing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Borrowing" DROP CONSTRAINT "Borrowing_bookCode_fkey";

-- DropForeignKey
ALTER TABLE "Borrowing" DROP CONSTRAINT "Borrowing_memberCode_fkey";

-- AlterTable
ALTER TABLE "Book" DROP CONSTRAINT "Book_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Book_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Borrowing" DROP COLUMN "bookCode",
DROP COLUMN "memberCode",
ADD COLUMN     "bookId" INTEGER NOT NULL,
ADD COLUMN     "memberId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Member" DROP CONSTRAINT "Member_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Member_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Borrowing" ADD CONSTRAINT "Borrowing_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrowing" ADD CONSTRAINT "Borrowing_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
