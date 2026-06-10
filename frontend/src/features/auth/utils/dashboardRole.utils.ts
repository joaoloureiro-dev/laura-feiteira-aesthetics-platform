import type { UserRole } from "../types/auth.types"
import { routePaths } from "../../../routes/routePaths"

type DashboardRoleConfig = {
    path: string
    name: string
}

const dashboardByRole: Record<UserRole, DashboardRoleConfig> = {
    CLIENT: {
        path: routePaths.clientDashboard,
        name: "área de cliente",
    },
    OWNER: {
        path: routePaths.ownerDashboard,
        name: "dashboard de gestão",
    },
    ADMIN: {
        path: routePaths.adminDashboard,
        name: "dashboard de administração",
    },
}

export function getDashboardPathByRole(role: UserRole) {
    return dashboardByRole[role].path
}

export function getDashboardNameByRole(role: UserRole) {
    return dashboardByRole[role].name
}