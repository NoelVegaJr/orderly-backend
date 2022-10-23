-- AlterTable
ALTER TABLE `ConversationParticipant` ADD COLUMN `lastSeenDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
