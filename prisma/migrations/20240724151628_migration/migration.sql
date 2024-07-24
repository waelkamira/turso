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
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hearts" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "emojis" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Meal" ("advise", "createdAt", "createdBy", "id", "image", "ingredients", "link", "mealName", "selectedValue", "theWay", "updatedAt", "userImage", "userName") SELECT "advise", "createdAt", "createdBy", "id", "image", "ingredients", "link", "mealName", "selectedValue", "theWay", "updatedAt", "userImage", "userName" FROM "Meal";
DROP TABLE "Meal";
ALTER TABLE "new_Meal" RENAME TO "Meal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
