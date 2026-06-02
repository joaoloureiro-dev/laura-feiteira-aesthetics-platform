import { prisma } from "../../database/prisma"

/**
 * Repository responsible for database access related to services.
 *
 * Production rule:
 * Prisma queries should stay here, not inside controllers.
 * This makes the code easier to test, reuse and maintain.
 */
export class ServicesRepository {
    /**
     * Gets all service categories with active services and active options.
     *
     * ServiceCategory does not currently have an isActive field in our schema,
     * so we only filter Service and ServiceOption.
     */
    async findPublicCatalog() {
        return prisma.serviceCategory.findMany({
            orderBy: {
                name: "asc",
            },
            include: {
                services: {
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        name: "asc",
                    },
                    include: {
                        options: {
                            where: {
                                isActive: true,
                            },
                            orderBy: {
                                name: "asc",
                            },
                        },
                    },
                },
            },
        })
    }

    /**
     * Gets one active service by slug with its active options.
     *
     * Used by future public service detail pages.
     */
    async findPublicServiceBySlug(slug: string) {
        return prisma.service.findFirst({
            where: {
                slug,
                isActive: true,
            },
            include: {
                options: {
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        name: "asc",
                    },
                },
            },
        })
    }
}