-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "usersWhoLikesThisRecipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mealId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    CONSTRAINT "usersWhoLikesThisRecipe_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "usersWhoPutEmojiOnThisRecipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mealId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    CONSTRAINT "usersWhoPutEmojiOnThisRecipe_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "usersWhoPutHeartOnThisRecipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mealId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    CONSTRAINT "usersWhoPutHeartOnThisRecipe_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "favoritedBy" TEXT NOT NULL,
    "userName" TEXT,
    "userImage" TEXT,
    "mealName" TEXT,
    "selectedValue" TEXT,
    "image" TEXT,
    "ingredients" TEXT,
    "theWay" TEXT,
    "advise" TEXT,
    "link" TEXT,
    "numberOfLikes" INTEGER NOT NULL DEFAULT 0,
    "numberOfHearts" INTEGER NOT NULL DEFAULT 0,
    "numberOfEmojis" INTEGER NOT NULL DEFAULT 0,
    "interaction" TEXT,
    "postId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718369814/items/uefgzp5uba74cgiwnfdf.png',
    "googleId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

