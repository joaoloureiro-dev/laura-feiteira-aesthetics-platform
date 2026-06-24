import { Route, Routes } from "react-router-dom"

import { DashboardLayout } from "../components/layout/DashboardLayout"
import { PublicLayout } from "../components/layout/PublicLayout"
import { AdminDashboardPage } from "../features/admin-dashboard/pages/AdminDashboardPage"
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute"
import { ClientBookingsPage } from "../features/client-dashboard/pages/ClientBookingsPage"
import { ClientDashboardPage } from "../features/client-dashboard/pages/ClientDashboardPage"
import { OwnerDashboardPage } from "../features/owner-dashboard/pages/OwnerDashboardPage"
import { ServiceDetailsPage } from "../features/services/pages/ServiceDetailsPage"
import { ServicesPage } from "../features/services/pages/ServicesPage"
import { BookingPage } from "../pages/BookingPage"
import { HomePage } from "../pages/HomePage"
import { LoginPage } from "../pages/LoginPage"
import { NotFoundPage } from "../pages/NotFoundPage"
import { RegisterPage } from "../pages/RegisterPage"
import { UnauthorizedPage } from "../pages/UnauthorizedPage"
import { routePaths } from "./routePaths"

/**
 * Main application routes.
 *
 * Public routes:
 * - Home
 * - Login
 * - Register
 * - Services catalog
 * - Service details
 * - Booking
 *
 * Protected client routes:
 * - Dashboard
 * - Bookings
 *
 * Protected dashboard routes:
 * - CLIENT -> /client/*
 * - OWNER  -> /owner/*
 * - ADMIN  -> /admin/*
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
                path={routePaths.register}
                element={
                    <PublicLayout>
                        <RegisterPage />
                    </PublicLayout>
                }
            />

            <Route
                path={routePaths.services}
                element={
                    <PublicLayout>
                        <ServicesPage />
                    </PublicLayout>
                }
            />

            <Route
                path={routePaths.serviceDetails}
                element={
                    <PublicLayout>
                        <ServiceDetailsPage />
                    </PublicLayout>
                }
            />

            <Route
                path={routePaths.booking}
                element={
                    <PublicLayout>
                        <BookingPage />
                    </PublicLayout>
                }
            />

            <Route
                path={routePaths.clientDashboard}
                element={
                    <ProtectedRoute allowedRoles={["CLIENT"]}>
                        <DashboardLayout roleLabel="Cliente">
                            <ClientDashboardPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={routePaths.clientBookings}
                element={
                    <ProtectedRoute allowedRoles={["CLIENT"]}>
                        <DashboardLayout roleLabel="Cliente">
                            <ClientBookingsPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={routePaths.ownerDashboard}
                element={
                    <ProtectedRoute allowedRoles={["OWNER"]}>
                        <DashboardLayout roleLabel="Owner">
                            <OwnerDashboardPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={routePaths.adminDashboard}
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <DashboardLayout roleLabel="Admin">
                            <AdminDashboardPage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={routePaths.unauthorized}
                element={
                    <PublicLayout>
                        <UnauthorizedPage />
                    </PublicLayout>
                }
            />

            <Route
                path="*"
                element={
                    <PublicLayout>
                        <NotFoundPage />
                    </PublicLayout>
                }
            />
        </Routes>
    )
}