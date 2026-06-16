"use client";
import { useEffect } from "react";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <AlertTriangle className="text-rose-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  const borders = {
    success: "border-emerald-500/20 bg-white/95 shadow-[0_4px_30px_rgba(16,185,129,0.1)]",
    error: "border-rose-500/20 bg-white/95 shadow-[0_4px_30px_rgba(244,63,94,0.1)]",
    info: "border-blue-500/20 bg-white/95 shadow-[0_4px_30px_rgba(59,130,246,0.1)]",
  };

  return (
    <div className={`flex items-center space-x-3 px-5 py-4 border rounded-2xl backdrop-blur-md pointer-events-auto transition-all duration-300 transform translate-y-0 ${borders[type]} animate-slide-in`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-slate-800 text-sm font-medium pr-4 select-none leading-snug">{message}</p>
      <button 
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full hover:bg-slate-100"
      >
        <X size={14} />
      </button>
    </div>
  );
}
