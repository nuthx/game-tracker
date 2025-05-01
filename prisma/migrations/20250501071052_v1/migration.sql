-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "npsso" TEXT NOT NULL DEFAULT '',
    "onlineId" TEXT NOT NULL DEFAULT '',
    "accountId" TEXT NOT NULL DEFAULT '',
    "npId" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '',
    "monitorId" TEXT NOT NULL DEFAULT 'me',
    "monitorInterval" TEXT NOT NULL DEFAULT '1',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PsnRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "npTitleId" TEXT NOT NULL,
    "titleName" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "launchPlatform" TEXT NOT NULL,
    "conceptIconUrl" TEXT NOT NULL,
    "startAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" DATETIME,
    "playTime" INTEGER,
    "error" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "_PsnRecordToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PsnRecordToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "PsnRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PsnRecordToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_PsnRecordToUser_AB_unique" ON "_PsnRecordToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PsnRecordToUser_B_index" ON "_PsnRecordToUser"("B");
