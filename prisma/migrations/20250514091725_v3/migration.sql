-- CreateTable
CREATE TABLE "NxRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" TEXT NOT NULL DEFAULT '',
    "gameName" TEXT NOT NULL DEFAULT '',
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
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "npsso" TEXT NOT NULL DEFAULT '',
    "onlineId" TEXT NOT NULL DEFAULT '',
    "accountId" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '',
    "monitorId" TEXT NOT NULL DEFAULT 'me',
    "monitorInterval" TEXT NOT NULL DEFAULT '5',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("accountId", "avatar", "createdAt", "id", "monitorId", "monitorInterval", "npsso", "onlineId", "password", "updatedAt", "username") SELECT "accountId", "avatar", "createdAt", "id", "monitorId", "monitorInterval", "npsso", "onlineId", "password", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
