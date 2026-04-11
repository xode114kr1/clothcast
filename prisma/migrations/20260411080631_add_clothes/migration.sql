-- CreateEnum
CREATE TYPE "ClothingCategory" AS ENUM ('TOP', 'BOTTOM', 'OUTER', 'SHOES');

-- CreateEnum
CREATE TYPE "ClothingFit" AS ENUM ('oversized', 'regular', 'slim');

-- CreateTable
CREATE TABLE "Clothes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ClothingCategory" NOT NULL,
    "color" TEXT NOT NULL,
    "fit" "ClothingFit" NOT NULL,
    "formality" INTEGER NOT NULL,
    "material" TEXT,
    "pattern" TEXT,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clothes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Clothes_userId_idx" ON "Clothes"("userId");

-- CreateIndex
CREATE INDEX "Clothes_category_idx" ON "Clothes"("category");

-- CreateIndex
CREATE INDEX "Clothes_fit_idx" ON "Clothes"("fit");

-- AddForeignKey
ALTER TABLE "Clothes" ADD CONSTRAINT "Clothes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
