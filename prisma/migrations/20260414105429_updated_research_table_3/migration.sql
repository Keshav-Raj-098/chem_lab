-- AlterTable
ALTER TABLE "ResearchProjects" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "fundingAgencies" DROP NOT NULL,
ALTER COLUMN "amntFunded" SET DATA TYPE TEXT;
