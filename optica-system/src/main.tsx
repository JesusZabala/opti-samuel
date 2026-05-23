import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from "sonner";
import { NotificationProvider } from "@/context/NotificationContext";
import "animate.css";

// Quitamos el BrowserRouter de aquí porque ya está en App.tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <>
    <NotificationProvider>
      <App />
    </NotificationProvider>
    <Toaster
      position="top-right"
      richColors
      duration={5000}
    />
  </>
</React.StrictMode>,
)