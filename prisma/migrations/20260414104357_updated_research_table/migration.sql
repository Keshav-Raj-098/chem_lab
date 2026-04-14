/*
  Warnings:

  - You are about to drop the column `body` on the `ResearchProjects` table. All the data in the column will be lost.
  - You are about to drop the column `imgs` on the `ResearchProjects` table. All the data in the column will be lost.
  - You are about to drop the column `links` on the `ResearchProjects` table. All the data in the column will be lost.
  - You are about to drop the column `mainImg` on the `ResearchProjects` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ResearchProjectType" AS ENUM ('FUNDED', 'NON_FUNDED');

-- AlterTable
ALTER TABLE "ResearchProjects" DROP COLUMN "body",
DROP COLUMN "imgs",
DROP COLUMN "links",
DROP COLUMN "mainImg",
ALTER COLUMN "fundingAgencies" SET NOT NULL,
ALTER COLUMN "fundingAgencies" SET DATA TYPE TEXT,
ALTER COLUMN "investigators" DROP NOT NULL,
ALTER COLUMN "investigators" SET DATA TYPE TEXT,
ALTER COLUMN "contributors" DROP NOT NULL,
ALTER COLUMN "contributors" SET DATA TYPE TEXT;
