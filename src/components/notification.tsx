import { create } from "zustand";

interface Notification {
  message: string;
  level: "info" | "error" | "success";
  duration?: number;
}

export interface NotificationManager {
  notifications: Notification[];
  info: (message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  pop: (message?: string) => void;
}

export const useNotification = create<NotificationManager>((set) => {
  const add = (n: Notification) => {
    set((state) => ({
      notifications: [...state.notifications, { message: n.message, level: "info" }],
    }))
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.message !== n.message),
      }))
    }, n.duration ?? 5000)
  }
  return {
  info: (message) =>
    add({ message, level: "info" }),
  success: (message) =>
    add({ message, level: "success" }),
  error: (message) =>
    add({ message, level: "info" }),
  pop: (message?: string) => {
    if (message) {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.message !== message),
      }))
    } else {
      set((state) => ({ notifications: state.notifications.slice(1) }))
    }
  },
  notifications: [],
}
});

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
          onClick={() => {
            pop(n.message)
          }}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
