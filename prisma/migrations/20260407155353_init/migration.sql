-- CreateEnum
CREATE TYPE "ResearchStatus" AS ENUM ('ONGOING', 'COMPLETED', 'PLANNED');

-- CreateEnum
CREATE TYPE "GroupCategory" AS ENUM ('POSTDOC', 'PHD', 'MASTERS', 'UNDERGRADUATE', 'FACULTY', 'ALUMNI', 'STAFF', 'RESEARCH_SCHOLAR', 'COLLABORATOR', 'OTHER');

-- CreateEnum
CREATE TYPE "AwardType" AS ENUM ('GROUP_LEADER', 'GROUP_MEMBER');

-- CreateEnum
CREATE TYPE "PublicationCategory" AS ENUM ('PATENTS', 'JOURNAL', 'CONFERENCE', 'PRESENTATION', 'NATIONAL_REPORT', 'INVITED_TALK', 'BOOK', 'OTHER');

-- CreateTable
CREATE TABLE "ResearchProjects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "mainImg" TEXT NOT NULL,
    "imgs" TEXT[],
    "links" TEXT[],
    "fundingAgencies" TEXT[],
    "investigators" TEXT[],
    "contributors" TEXT[],
    "duration" TEXT,
    "status" "ResearchStatus" NOT NULL DEFAULT 'PLANNED',
    "amntFunded" DECIMAL(10,2),
    "completedOn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchProjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "installedOn" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMembers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "researchAreas" TEXT[],
    "designation" TEXT,
    "category" "GroupCategory" NOT NULL,
    "profileImgUrl" TEXT,
    "profileLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Awards" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "AwardType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Awards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publications" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" "PublicationCategory" NOT NULL,
    "year" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsAndAnnouncements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsAndAnnouncements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResearchProjects_status_idx" ON "ResearchProjects"("status");

-- CreateIndex
CREATE INDEX "ResearchProjects_createdAt_idx" ON "ResearchProjects"("createdAt");

-- CreateIndex
CREATE INDEX "ResearchProjects_completedOn_idx" ON "ResearchProjects"("completedOn");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMembers_email_key" ON "GroupMembers"("email");

-- CreateIndex
CREATE INDEX "Publications_category_idx" ON "Publications"("category");

-- CreateIndex
CREATE INDEX "Publications_year_idx" ON "Publications"("year");
