import { Route, Routes } from "react-router-dom"

import { DashboardLayout } from "../components/layout/DashboardLayout"
import { PublicLayout } from "../components/layout/PublicLayout"
import { ClientDashboardPage } from "../features/client-dashboard/pages/ClientDashboardPage"
import { OwnerDashboardPage } from "../features/owner-dashboard/pages/OwnerDashboardPage"
import { AdminDashboardPage } from "../features/admin-dashboard/pages/AdminDashboardPage"
import { HomePage } from "../pages/HomePage"
import { LoginPage } from "../pages/LoginPage"
import { NotFoundPage } from "../pages/NotFoundPage"
import { routePaths } from "./routePaths"

/**
 * Main application routes.
 *
 * At this stage, these routes are public placeholders.
 * Later, we will protect dashboard routes with authentication and role checks:
 *
 * CLIENT -> /client/dashboard
 * OWNER  -> /owner/dashboard
 * ADMIN  -> /admin/dashboard
 */
export function AppRoutes() {
    return (
        <Routes>
            <Route
                path={routePaths.home}
                element={
                    <PublicLayout>
                        <HomePage />
                    </PublicLayout>
                }
            />

            <Route
                path={routePaths.login}
                element={
                    <PublicLayout>
                        <LoginPage />
                    </PublicLayout>
                }
            />

            <Route
                path={routePaths.clientDashboard}
                element={
                    <DashboardLayout roleLabel="Cliente">
                        <ClientDashboardPage />
                    </DashboardLayout>
                }
            />

            <Route
                path={routePaths.ownerDashboard}
                element={
                    <DashboardLayout roleLabel="Owner">
                        <OwnerDashboardPage />
                    </DashboardLayout>
                }
            />

            <Route
                path={routePaths.adminDashboard}
                element={
                    <DashboardLayout roleLabel="Admin">
                        <AdminDashboardPage />
                    </DashboardLayout>
                }
            />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}