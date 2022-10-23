/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `participantId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Task` table. All the data in the column will be lost.
  - Added the required column `taskListId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Task` DROP COLUMN `conversationId`,
    DROP COLUMN `participantId`,
    DROP COLUMN `text`,
    ADD COLUMN `taskListId` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `TaskList` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `conversationId` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_taskListId_fkey` FOREIGN KEY (`taskListId`) REFERENCES `TaskList`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
