/*
  Warnings:

  - The primary key for the `availability_slots` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `availabilityId` on the `bookings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[startsAt,type]` on the table `availability_slots` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[availabilitySlotId]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endsAt` to the `availability_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startsAt` to the `availability_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `availability_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availabilitySlotId` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_availabilityId_fkey";

-- DropIndex
DROP INDEX "bookings_availabilityId_key";

-- AlterTable
ALTER TABLE "availability_slots" DROP CONSTRAINT "availability_slots_pkey",
ADD COLUMN     "endsAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startsAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" "AppointmentType" NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "availability_slots_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "availabilityId",
ADD COLUMN     "availabilitySlotId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "availability_slots_startsAt_type_key" ON "availability_slots"("startsAt", "type");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_availabilitySlotId_key" ON "bookings"("availabilitySlotId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_availabilitySlotId_fkey" FOREIGN KEY ("availabilitySlotId") REFERENCES "availability_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
