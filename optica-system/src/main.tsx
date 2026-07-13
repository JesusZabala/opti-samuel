import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NotificationProvider } from "@/context/NotificationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "sonner";
import "animate.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <>
    <ThemeProvider>
      <NotificationProvider>
        <App />
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={5000}
          className="dark:!bg-[#1a2a20] dark:!text-gray-100 dark:!border dark:!border-white/10"
        />
      </NotificationProvider>
    </ThemeProvider>
  </>
</React.StrictMode>,
)