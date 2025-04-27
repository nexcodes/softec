"use client";

import * as React from "react"
import { createContext, useContext, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa"

type ToastVariant = "default" | "destructive" | "success"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

interface ToastContextType {
  toasts: Toast[]
  toast: (props: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2, 11)
    const newToast = { id, title, description, variant }
    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismiss(id)
    }, 5000)
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

function ToastContainer({ 
  toasts, 
  dismiss 
}: { 
  toasts: Toast[]
  dismiss: (id: string) => void 
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`rounded-lg border shadow-lg p-4 ${
              toast.variant === "destructive" 
                ? "bg-red-950/90 border-red-800 text-red-50" 
                : toast.variant === "success" 
                ? "bg-green-950/90 border-green-800 text-green-50"
                : "bg-gray-950/90 border-gray-800 text-gray-50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-2">
                {toast.variant === "destructive" ? (
                  <FaExclamationTriangle className="text-red-400 mt-0.5" />
                ) : toast.variant === "success" ? (
                  <FaCheckCircle className="text-green-400 mt-0.5" />
                ) : (
                  <FaInfoCircle className="text-blue-400 mt-0.5" />
                )}
                <div>
                  <h3 className="font-medium">{toast.title}</h3>
                  {toast.description && <p className="text-sm opacity-90 mt-1">{toast.description}</p>}
                </div>
              </div>
              <button 
                onClick={() => dismiss(toast.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}