/**
 * Centralized application route paths.
 *
 * Instead of writing route strings manually across the project,
 * all application paths are kept in one place.
 */
export const routePaths = {
    home: "/",

    login: "/login",
    register: "/register",

    services: "/services",
    serviceDetails: "/services/:slug",
    booking: "/booking",

    clientDashboard: "/client/dashboard",
    ownerDashboard: "/owner/dashboard",
    adminDashboard: "/admin/dashboard",

    unauthorized: "/unauthorized",
} as const