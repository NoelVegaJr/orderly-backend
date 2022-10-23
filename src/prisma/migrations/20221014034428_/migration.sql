/*
  Warnings:

  - Made the column `lastSeenDate` on table `ConversationParticipant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ConversationParticipant` MODIFY `lastSeenDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
