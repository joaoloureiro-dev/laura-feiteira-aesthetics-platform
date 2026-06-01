import { BrowserRouter } from "react-router-dom"

import { AppRoutes } from "../routes/AppRoutes"

/**
 * Root application component.
 *
 * BrowserRouter enables client-side navigation, which means the app can change pages
 * without doing a full browser reload.
 */
export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}