/*
  1. 添加NxRecord表
  2. 新增PsnRecord字段userId，如果monitorId为me则设置为accountId，否则设置为monitorId
  3. 新增PsnRecord字段userName，默认值为空
  4. 新增User表字段monitorName，默认值为空
  5. 新增User表字段monitorAvatar，默认值为空
*/

-- CreateTable
CREATE TABLE "NxRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "state" TEXT NOT NULL DEFAULT 'gaming',
    "gameId" TEXT NOT NULL DEFAULT '',
    "gameName" TEXT NOT NULL DEFAULT '',
    "gamePlatform" TEXT NOT NULL DEFAULT 'NS',
    "gameCoverUrl" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL DEFAULT '',
    "userName" TEXT NOT NULL DEFAULT '',
    "startAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playSeconds" INTEGER NOT NULL DEFAULT 0
);

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
    "userId" TEXT NOT NULL DEFAULT '',
    "userName" TEXT NOT NULL DEFAULT '',
    "startAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playSeconds" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_PsnRecord" ("conceptIconUrl", "endAt", "format", "id", "launchPlatform", "npTitleId", "playSeconds", "startAt", "state", "titleName", "userId")
SELECT 
    p."conceptIconUrl", 
    p."endAt", 
    p."format", 
    p."id", 
    p."launchPlatform", 
    p."npTitleId", 
    p."playSeconds", 
    p."startAt", 
    p."state", 
    p."titleName",
    CASE 
        WHEN (SELECT "monitorId" FROM "User" WHERE "id" = 1) = 'me' THEN (SELECT "accountId" FROM "User" WHERE "id" = 1)
        ELSE (SELECT "monitorId" FROM "User" WHERE "id" = 1)
    END
FROM "PsnRecord" p;
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
    "monitorName" TEXT NOT NULL DEFAULT '',
    "monitorAvatar" TEXT NOT NULL DEFAULT '',
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
