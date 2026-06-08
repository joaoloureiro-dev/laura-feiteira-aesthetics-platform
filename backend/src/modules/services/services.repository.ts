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
     * Gets all service categories with:
     * - active services;
     * - active service options;
     * - active professionals assigned to each service.
     *
     * ServiceCategory does not currently have an isActive field in our schema,
     * so we only filter Service, ServiceOption and Professional.
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
                        professionals: {
                            where: {
                                professional: {
                                    isActive: true,
                                },
                            },
                            include: {
                                professional: {
                                    select: {
                                        id: true,
                                        name: true,
                                        slug: true,
                                    },
                                },
                            },
                            orderBy: {
                                professional: {
                                    name: "asc",
                                },
                            },
                        },
                    },
                },
            },
        })
    }

    /**
     * Gets one active service by slug with:
     * - active options;
     * - active professionals assigned to this service.
     *
     * Used by the public service detail page and booking flow.
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
                professionals: {
                    where: {
                        professional: {
                            isActive: true,
                        },
                    },
                    include: {
                        professional: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                    orderBy: {
                        professional: {
                            name: "asc",
                        },
                    },
                },
            },
        })
    }
}