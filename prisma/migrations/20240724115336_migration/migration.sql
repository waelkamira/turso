/*
  Warnings:

  - You are about to drop the `Emoji` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Heart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `emojis` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `hearts` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Meal` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Emoji";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Heart";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Like";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Action" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userEmail" TEXT NOT NULL,
    "mealId" INTEGER NOT NULL,
    "hearts" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "emojis" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Action_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Meal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "userImage" TEXT NOT NULL,
    "mealName" TEXT NOT NULL,
    "selectedValue" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "theWay" TEXT NOT NULL,
    "advise" TEXT,
    "link" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Meal" ("advise", "createdAt", "createdBy", "id", "image", "ingredients", "link", "mealName", "selectedValue", "theWay", "updatedAt", "userImage", "userName") SELECT "advise", "createdAt", "createdBy", "id", "image", "ingredients", "link", "mealName", "selectedValue", "theWay", "updatedAt", "userImage", "userName" FROM "Meal";
DROP TABLE "Meal";
ALTER TABLE "new_Meal" RENAME TO "Meal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;