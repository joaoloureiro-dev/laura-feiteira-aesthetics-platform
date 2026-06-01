/**
 * Centralized application route paths.
 *
 * Why this exists:
 * Instead of writing route strings manually across the project,
 * we keep them in one place. This reduces mistakes when routes change later.
 */
export const routePaths = {
    home: "/",
    login: "/login",

    clientDashboard: "/client/dashboard",

    ownerDashboard: "/owner/dashboard",

    adminDashboard: "/admin/dashboard",
} as const