-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "anotherTitles" TEXT[] DEFAULT ARRAY[]::TEXT[];
