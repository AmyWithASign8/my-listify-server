-- CreateEnum
CREATE TYPE "Category" AS ENUM ('anime');

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "image" BYTEA,
    "rating" SMALLINT NOT NULL DEFAULT 0,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "experience" INTEGER[] DEFAULT ARRAY[0, 1000]::INTEGER[],
    "top_items" INTEGER[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_id_key" ON "Item"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Item_title_key" ON "Item"("title");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
