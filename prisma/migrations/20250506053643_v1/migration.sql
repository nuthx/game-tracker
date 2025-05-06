-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "npsso" TEXT NOT NULL DEFAULT '',
    "onlineId" TEXT NOT NULL DEFAULT '',
    "accountId" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '',
    "monitorId" TEXT NOT NULL DEFAULT 'me',
    "monitorInterval" TEXT NOT NULL DEFAULT '1',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PsnRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "state" TEXT NOT NULL,
    "npTitleId" TEXT NOT NULL DEFAULT '',
    "titleName" TEXT NOT NULL DEFAULT '',
    "format" TEXT NOT NULL DEFAULT '',
    "launchPlatform" TEXT NOT NULL DEFAULT '',
    "conceptIconUrl" TEXT NOT NULL DEFAULT '',
    "startAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playTime" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
