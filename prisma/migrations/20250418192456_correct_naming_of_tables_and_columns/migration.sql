/*
  Warnings:

  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_userId_fkey";

-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "item" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "image" BYTEA,
    "rating" SMALLINT NOT NULL DEFAULT 0,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "category" "Category" NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "avatar" BYTEA NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "experience" INTEGER[] DEFAULT ARRAY[0, 1000]::INTEGER[],
    "top_items" INTEGER[],
    "theme" "Theme" NOT NULL DEFAULT 'light',
    "role" "UserRole" NOT NULL DEFAULT 'user',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_id_key" ON "item"("id");

-- CreateIndex
CREATE UNIQUE INDEX "item_title_key" ON "item"("title");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
