/*
  Warnings:

  - You are about to alter the column `bank_account_number` on the `bank_account` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - Added the required column `amount` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bank_account" ALTER COLUMN "bank_account_number" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "amount" INTEGER NOT NULL;
