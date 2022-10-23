-- AlterTable
ALTER TABLE `ConversationParticipant` ALTER COLUMN `lastSeenDate` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Message` ALTER COLUMN `dateSent` DROP DEFAULT;
