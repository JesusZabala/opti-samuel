import {
  createContext,
  useContext,
  useState,
} from "react";

import { toast } from "sonner";
import Logo from "@/assets/Logo.png";

type NotificationType = {
  titulo: string;
  mensaje: string;
  fecha: string;
};

type ContextType = {
  notifications: NotificationType[];

  addNotification: (
    notification: NotificationType
  ) => void;
};

const NotificationContext =
  createContext<ContextType | null>(null);

export const NotificationProvider = ({
  children,
}: any) => {

  const [notifications, setNotifications] =
    useState<NotificationType[]>([]);

  const addNotification = (
    notification: NotificationType
  ) => {

    // SONNER — custom centered toast with logo
    toast.custom(
      (_t) => (
        <div className="flex items-start gap-4 p-4 bg-white dark:bg-[#1a2a20] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 min-w-[320px] max-w-md">
          <img
            src={Logo}
            alt="Opti-Samuel"
            className="w-10 h-10 rounded-lg object-contain shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm text-[#1a4731] dark:text-emerald-100 truncate">
              {notification.titulo}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              {notification.mensaje}
            </p>
            <p className="text-[10px] text-gray-300 dark:text-gray-500 mt-2 font-medium">
              {new Date(notification.fecha).toLocaleString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
      }
    );

    // CAMPANA
    setNotifications((prev) => [
      notification,
      ...prev,
    ]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {

  const context =
    useContext(NotificationContext);

  if (!context) {

    throw new Error(
      "useNotifications debe usarse dentro del Provider"
    );

  }

  return context;
};