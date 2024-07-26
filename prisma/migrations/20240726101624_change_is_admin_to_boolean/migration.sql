/*
  Warnings:

  - You are about to alter the column `isAdmin` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718369814/items/uefgzp5uba74cgiwnfdf.png',
    "googleId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "googleId", "id", "image", "isAdmin", "name", "password", "updatedAt") SELECT "createdAt", "email", "googleId", "id", "image", "isAdmin", "name", "password", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
