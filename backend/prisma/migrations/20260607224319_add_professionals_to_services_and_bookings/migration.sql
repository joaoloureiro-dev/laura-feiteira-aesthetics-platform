/*
  Warnings:

  - You are about to drop the column `type` on the `availability_slots` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[professionalId,startsAt]` on the table `availability_slots` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appointmentType` to the `availability_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professionalId` to the `availability_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professionalId` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "availability_slots_startsAt_type_key";

-- AlterTable
ALTER TABLE "availability_slots" DROP COLUMN "type",
ADD COLUMN     "appointmentType" "AppointmentType" NOT NULL,
ADD COLUMN     "professionalId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "professionalId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "professionals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professionals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_professionals" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_professionals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professionals_slug_key" ON "professionals"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "professionals_email_key" ON "professionals"("email");

-- CreateIndex
CREATE INDEX "professionals_isActive_idx" ON "professionals"("isActive");

-- CreateIndex
CREATE INDEX "professionals_createdAt_idx" ON "professionals"("createdAt");

-- CreateIndex
CREATE INDEX "service_professionals_serviceId_idx" ON "service_professionals"("serviceId");

-- CreateIndex
CREATE INDEX "service_professionals_professionalId_idx" ON "service_professionals"("professionalId");

-- CreateIndex
CREATE UNIQUE INDEX "service_professionals_serviceId_professionalId_key" ON "service_professionals"("serviceId", "professionalId");

-- CreateIndex
CREATE INDEX "availability_slots_professionalId_idx" ON "availability_slots"("professionalId");

-- CreateIndex
CREATE INDEX "availability_slots_startsAt_idx" ON "availability_slots"("startsAt");

-- CreateIndex
CREATE INDEX "availability_slots_endsAt_idx" ON "availability_slots"("endsAt");

-- CreateIndex
CREATE INDEX "availability_slots_appointmentType_idx" ON "availability_slots"("appointmentType");

-- CreateIndex
CREATE INDEX "availability_slots_isOpen_idx" ON "availability_slots"("isOpen");

-- CreateIndex
CREATE INDEX "availability_slots_professionalId_appointmentType_isOpen_idx" ON "availability_slots"("professionalId", "appointmentType", "isOpen");

-- CreateIndex
CREATE INDEX "availability_slots_professionalId_startsAt_isOpen_idx" ON "availability_slots"("professionalId", "startsAt", "isOpen");

-- CreateIndex
CREATE UNIQUE INDEX "availability_slots_professionalId_startsAt_key" ON "availability_slots"("professionalId", "startsAt");

-- CreateIndex
CREATE INDEX "bookings_userId_idx" ON "bookings"("userId");

-- CreateIndex
CREATE INDEX "bookings_serviceId_idx" ON "bookings"("serviceId");

-- CreateIndex
CREATE INDEX "bookings_professionalId_idx" ON "bookings"("professionalId");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_appointmentType_idx" ON "bookings"("appointmentType");

-- CreateIndex
CREATE INDEX "bookings_paymentStatus_idx" ON "bookings"("paymentStatus");

-- CreateIndex
CREATE INDEX "bookings_createdAt_idx" ON "bookings"("createdAt");

-- CreateIndex
CREATE INDEX "service_options_serviceId_idx" ON "service_options"("serviceId");

-- CreateIndex
CREATE INDEX "service_options_isActive_idx" ON "service_options"("isActive");

-- CreateIndex
CREATE INDEX "services_categoryId_idx" ON "services"("categoryId");

-- CreateIndex
CREATE INDEX "services_isActive_idx" ON "services"("isActive");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- AddForeignKey
ALTER TABLE "service_professionals" ADD CONSTRAINT "service_professionals_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_professionals" ADD CONSTRAINT "service_professionals_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slots_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
