import { AppRoutes } from "../routes/AppRoutes"

/**
 * Root application component.
 *
 * BrowserRouter is registered once in main.tsx.
 * AuthProvider is also registered in main.tsx.
 *
 * This component should only render the application routes.
 */
export function App() {
  return <AppRoutes />
}