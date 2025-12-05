"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ToastType = "success" | "error";

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onReturnHome?: () => void;
}

interface ToastContextValue {
  addToast: (toast: Omit<ToastData, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, "id">) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, ...toast }]);
    // auto-remove
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration ?? 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 bg-white/60 border border-white/80 backdrop-blur-md rounded-2xl">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`relative w-80 p-4 rounded-xl shadow-lg flex flex-col bg-${
              t.type === "success" ? "green-500" : "red-500"
            }`}
          >
            <p className="font-semibold">{t.message}</p>
            <div className="flex gap-2 mt-2">
              {t.onReturnHome && (
                <button
                  className="bg-white text-green-600 px-3 py-1 rounded hover:bg-gray-100"
                  onClick={t.onReturnHome}
                >
                  Return Home
                </button>
              )}
              <button
                className="px-3 py-1 rounded bg-white/30 hover:bg-white/50"
                onClick={() => removeToast(t.id)}
              >
                Close
              </button>
            </div>
            {/* Timer bar */}
            <div className="h-1 bg-white/50 mt-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-white"
                style={{
                  animation: `timer ${t.duration ?? 5000}ms linear forwards`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes timer {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
