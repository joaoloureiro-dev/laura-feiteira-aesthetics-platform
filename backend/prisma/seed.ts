import "dotenv/config"

import { PrismaClient } from "@prisma/client"

import { seedAvailabilitySlots } from "./seed/availability.seed"
import { serviceCategoriesSeed } from "./seed/services.seed"

/**
 * Prisma client used by the seed script.
 *
 * With Prisma 6, Prisma reads DATABASE_URL from the .env file
 * through the datasource configuration in schema.prisma.
 */
const prisma = new PrismaClient()

/**
 * Seeds the service catalog.
 *
 * We use upsert to make this seed idempotent.
 * That means we can run it multiple times without duplicating categories
 * or services.
 */
async function seedServiceCatalog() {
  for (const category of serviceCategoriesSeed) {
    const createdCategory = await prisma.serviceCategory.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    })

    for (const service of category.services) {
      const createdService = await prisma.service.upsert({
        where: {
          slug: service.slug,
        },
        update: {
          name: service.name,
          description: service.description,
          evaluationRequirement: service.evaluationRequirement,
          categoryId: createdCategory.id,
          isActive: true,
        },
        create: {
          name: service.name,
          slug: service.slug,
          description: service.description,
          evaluationRequirement: service.evaluationRequirement,
          categoryId: createdCategory.id,
          isActive: true,
        },
      })

      /**
       * Service options do not currently have a slug or unique field.
       *
       * For this seed, we remove the existing options for the service
       * and recreate them from this file as the source of truth.
       *
       * Later, after Laura can edit services from the dashboard,
       * we may change this approach to avoid overwriting dashboard edits.
       */
      await prisma.serviceOption.deleteMany({
        where: {
          serviceId: createdService.id,
        },
      })

      await prisma.serviceOption.createMany({
        data: service.options.map((option) => ({
          serviceId: createdService.id,
          name: option.name,
          description: option.description,
          priceCents: option.priceCents,
          priceLabel: option.priceLabel,
          durationMinutes: option.durationMinutes,
          isActive: true,
        })),
      })
    }
  }
}

/**
 * Main seed function.
 *
 * Current seed order:
 * 1. Service catalog
 * 2. Test availability slots
 *
 * Later we can add:
 * - first owner user;
 * - first admin user;
 * - default settings;
 * - email templates.
 */
async function main() {
  await seedServiceCatalog()
  await seedAvailabilitySlots(prisma)

  console.log("Seed completed successfully.")
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error)

    /**
     * Throwing the error still makes the seed command fail properly.
     * We avoid process.exit() here to keep TypeScript setups cleaner.
     */
    throw error
  })
  .finally(async () => {
    await prisma.$disconnect()
  })