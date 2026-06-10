import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import { App } from "./app/App"
import { AuthProvider } from "./features/auth/services/AuthContext"
import { ToastViewport } from "./features/toast/components/ToastViewport"
import { ToastProvider } from "./features/toast/services/ToastContext"
import "./styles/index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <App />
          <ToastViewport />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
)