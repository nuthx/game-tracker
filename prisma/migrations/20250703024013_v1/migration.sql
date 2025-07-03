-- CreateTable
CREATE TABLE "config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "psn_npsso" TEXT NOT NULL DEFAULT '',
    "psn_monitor_from_id" TEXT NOT NULL DEFAULT '',
    "psn_monitor_from_name" TEXT NOT NULL DEFAULT '',
    "psn_monitor_from_avatar" TEXT NOT NULL DEFAULT '',
    "psn_monitor_to_id" TEXT NOT NULL DEFAULT '',
    "psn_monitor_to_name" TEXT NOT NULL DEFAULT '',
    "psn_monitor_to_avatar" TEXT NOT NULL DEFAULT '',
    "psn_monitor_interval" INTEGER NOT NULL DEFAULT 30,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "platform" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uname" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "utitle" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "title_alias" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "image_grid" TEXT NOT NULL DEFAULT '',
    "image_hero" TEXT NOT NULL DEFAULT '',
    "image_logo" TEXT NOT NULL DEFAULT '',
    "image_icon" TEXT NOT NULL DEFAULT '',
    "release_date" DATETIME,
    "user_rate" INTEGER NOT NULL DEFAULT 0,
    "user_status" INTEGER NOT NULL DEFAULT 0,
    "user_review" TEXT NOT NULL DEFAULT '',
    "user_start_at" DATETIME,
    "user_end_at" DATETIME,
    "user_play_seconds" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "record" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "platform_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "player" TEXT NOT NULL DEFAULT '',
    "start_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "play_seconds" INTEGER NOT NULL DEFAULT 0,
    "hide" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "record_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "platform" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "record_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GameToPlatform" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GameToPlatform_A_fkey" FOREIGN KEY ("A") REFERENCES "game" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GameToPlatform_B_fkey" FOREIGN KEY ("B") REFERENCES "platform" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "config_username_key" ON "config"("username");

-- CreateIndex
CREATE UNIQUE INDEX "platform_uname_key" ON "platform"("uname");

-- CreateIndex
CREATE UNIQUE INDEX "platform_name_key" ON "platform"("name");

-- CreateIndex
CREATE UNIQUE INDEX "game_utitle_key" ON "game"("utitle");

-- CreateIndex
CREATE UNIQUE INDEX "game_title_key" ON "game"("title");

-- CreateIndex
CREATE UNIQUE INDEX "game_title_alias_key" ON "game"("title_alias");

-- CreateIndex
CREATE UNIQUE INDEX "record_start_at_end_at_key" ON "record"("start_at", "end_at");

-- CreateIndex
CREATE UNIQUE INDEX "_GameToPlatform_AB_unique" ON "_GameToPlatform"("A", "B");

-- CreateIndex
CREATE INDEX "_GameToPlatform_B_index" ON "_GameToPlatform"("B");
