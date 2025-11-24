// src/components/NotificationBar.jsx
import { useNotification } from "../context/NotificationContext";

function NotificationBar() {
  const { notification, clearNotification } = useNotification();

  if (!notification) return null;

  const bgClass =
    notification.type === "success"
      ? "bg-blue-600"
      : notification.type === "error"
      ? "bg-red-600"
      : "bg-gray-700";

  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        max-w-sm w-[90vw] sm:w-[360px]
        rounded-lg shadow-lg
        ${bgClass}
        text-white text-sm
      `}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔔</span>
          <span>{notification.message}</span>
        </div>

        <button
          className="ml-3 text-xs underline hover:opacity-80"
          onClick={clearNotification}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default NotificationBar;
