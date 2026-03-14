import { create } from "zustand";

interface Notification {
  message: string;
  level: "info" | "error" | "success";
}

export interface NotificationManager {
  notifications: Notification[];
  info: (message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  pop: () => void;
  auto_pop: (duration: number) => void;
}

export const useNotification = create<NotificationManager>((set) => ({
  info: (message) =>
    set((state) => ({
      notifications: [...state.notifications, { message, level: "info" }],
    })),
  success: (message) =>
    set((state) => ({
      notifications: [...state.notifications, { message, level: "success" }],
    })),
  error: (message) =>
    set((state) => ({
      notifications: [...state.notifications, { message, level: "error" }],
    })),
  pop: () => set((state) => ({ notifications: state.notifications.slice(1) })),
  notifications: [],
  auto_pop: (duration) => {
    setTimeout(() => {
      set((state) => ({ notifications: state.notifications.slice(1) }));
    }, duration);
  },
}));

export function NotificationContainer() {
  const { notifications, pop } = useNotification();
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((n, index) => (
        <div
          key={index}
          className={`px-4 py-2 rounded shadow text-white ${
            n.level === "info"
              ? "bg-blue-500"
              : n.level === "success"
                ? "bg-green-500"
                : "bg-red-500"
          }`}
          onClick={pop}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
