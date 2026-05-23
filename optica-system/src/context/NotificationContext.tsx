import {
  createContext,
  useContext,
  useState,
} from "react";

import { toast } from "sonner";

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

    // SONNER
    toast(notification.titulo, {
      description: notification.mensaje,
      duration: 5000,
    });

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