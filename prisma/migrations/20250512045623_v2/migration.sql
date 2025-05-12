/*
  1. monitorInterval默认值从1改为10
  2. 将playTime转换为playSeconds，且值*60
*/

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PsnRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "state" TEXT NOT NULL,
    "npTitleId" TEXT NOT NULL DEFAULT '',
    "titleName" TEXT NOT NULL DEFAULT '',
    "format" TEXT NOT NULL DEFAULT '',
    "launchPlatform" TEXT NOT NULL DEFAULT '',
    "conceptIconUrl" TEXT NOT NULL DEFAULT '',
    "startAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playSeconds" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_PsnRecord" ("conceptIconUrl", "endAt", "format", "id", "launchPlatform", "npTitleId", "startAt", "state", "titleName", "playSeconds") 
SELECT "conceptIconUrl", "endAt", "format", "id", "launchPlatform", "npTitleId", "startAt", "state", "titleName", CAST("playTime" AS INTEGER) * 60 
FROM "PsnRecord";
DROP TABLE "PsnRecord";
ALTER TABLE "new_PsnRecord" RENAME TO "PsnRecord";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "npsso" TEXT NOT NULL DEFAULT '',
    "onlineId" TEXT NOT NULL DEFAULT '',
    "accountId" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '',
    "monitorId" TEXT NOT NULL DEFAULT 'me',
    "monitorInterval" TEXT NOT NULL DEFAULT '10',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("accountId", "avatar", "createdAt", "id", "monitorId", "monitorInterval", "npsso", "onlineId", "password", "updatedAt", "username") SELECT "accountId", "avatar", "createdAt", "id", "monitorId", "monitorInterval", "npsso", "onlineId", "password", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
