import React from "react";
import { motion } from "framer-motion";
import { 
  CalendarCheck, Star, Mail, Sliders, Check, XCircle, 
  Users, Banknote, ShieldCheck, HeartPulse, UserCheck, Zap, Activity, ClipboardList 
} from "lucide-react";

interface Appointment {
  appointmentId: string;
  name: string;
  phone: string;
  date: string;
  timeSlot?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface ContactMessage {
  messageId: string;
  name: string;
  email: string;
  messageText: string;
  status: "unread" | "read";
  createdAt: string;
}

interface SystemSettings {
  isBookingEnabled: boolean;
  contactPhone: string;
  clinicTimings: string;
  showReviews: boolean;
}

interface OverviewTabProps {
  appointments: Appointment[];
  inquiries: ContactMessage[];
  settings: SystemSettings;
  setActiveTab: (tab: "overview" | "appointments" | "inquiries" | "settings" | "articles" | "gallery" | "patients") => void;
  pendingAppointments: number;
  unreadMessages: number;
  updateAppointmentStatus: (id: string, status: "pending" | "confirmed" | "completed" | "cancelled") => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;
}

export default function OverviewTab({
  appointments,
  inquiries,
  settings,
  setActiveTab,
  pendingAppointments,
  unreadMessages,
  updateAppointmentStatus,
  markMessageRead,
}: OverviewTabProps) {

  // Dynamic statistics calculations
  const totalBookings = appointments.length;
  const confirmedBookings = appointments.filter(a => a.status === "confirmed").length;
  const completedConsultations = appointments.filter(a => a.status === "completed").length;
  const cancelledBookings = appointments.filter(a => a.status === "cancelled").length;
  const totalInquiries = inquiries.length;

  const stats = [
    {
      key: 'total',
      label: 'Total Bookings',
      icon: Users,
      value: totalBookings,
      color: 'bg-brand-50 text-brand-600',
      border: 'border-brand-100',
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
      icon: UserCheck,
      value: confirmedBookings,
      color: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
    },
    {
      key: 'pending',
      label: 'Pending Requests',
      icon: ClipboardList,
      value: pendingAppointments,
      color: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      alert: pendingAppointments > 0,
    },
    {
      key: 'inquiries',
      label: 'Total Inquiries',
      icon: Mail,
      value: totalInquiries,
      color: 'bg-sky-50 text-sky-600',
      border: 'border-sky-100',
    },
    {
      key: 'unread',
      label: 'Unread Messages',
      icon: Zap,
      value: unreadMessages,
      color: 'bg-rose-50 text-rose-600',
      border: 'border-rose-100',
      alert: unreadMessages > 0,
    },
    {
      key: 'completed',
      label: 'Completed Consults',
      icon: ShieldCheck,
      value: completedConsultations,
      color: 'bg-violet-50 text-violet-600',
      border: 'border-violet-100',
    },
    {
      key: 'cancelled',
      label: 'Cancelled',
      icon: XCircle,
      value: cancelledBookings,
      color: 'bg-orange-50 text-orange-600',
      border: 'border-orange-100',
    },
    {
      key: 'booking_status',
      label: 'Booking System',
      icon: Sliders,
      value: settings.isBookingEnabled ? 'Active' : 'Paused',
      color: settings.isBookingEnabled ? 'bg-teal-50 text-teal-600' : 'bg-red-50 text-red-600',
      border: settings.isBookingEnabled ? 'border-teal-100' : 'border-red-100',
      isStatus: true
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Clinical Dashboard</h1>
        <p className="text-slate-600 mt-1">Overview of appointments, inquiries, and clinic schedule settings.</p>
      </div>

      {/* Stats Cards Grid (Dhruv's exact UI style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className={`bg-white rounded-xl border ${stat.border} p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow relative overflow-hidden`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-500 leading-none mb-1 truncate">{stat.label}</p>
                <p className={`font-bold text-slate-900 leading-none truncate ${stat.isStatus ? 'text-sm' : 'text-2xl'}`}>
                  {stat.value}
                </p>
              </div>
              {stat.alert && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Quick overview grids */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Recent Pending Appointments (Dhruv's visual components style) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-5 border-b border-slate-50 pb-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <CalendarCheck size={18} className="text-brand-600" />
              <span>Pending Booking Requests</span>
            </h3>
            <button 
              onClick={() => setActiveTab("appointments")} 
              className="text-brand-600 text-xs font-semibold hover:underline"
            >
              View All
            </button>
          </div>
          
          {appointments.filter(a => a.status === "pending").length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm font-medium">
              No pending appointment requests. All clear!
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {appointments.filter(a => a.status === "pending").slice(0, 4).map((a) => (
                <div 
                  key={a.appointmentId} 
                  className="flex justify-between items-center p-3.5 bg-slate-50/75 border border-slate-100/50 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-800 text-sm truncate">{a.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center space-x-1.5 mt-1">
                      <span>{a.phone}</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-700">{a.date}</span>
                      <span>·</span>
                      <span className="text-brand-600 font-medium">{a.timeSlot}</span>
                    </p>
                  </div>
                  <div className="flex space-x-2 shrink-0">
                    <button 
                      onClick={() => updateAppointmentStatus(a.appointmentId, "confirmed")}
                      className="w-8 h-8 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 flex items-center justify-center transition-colors"
                      title="Confirm Booking"
                    >
                      <Check size={15} />
                    </button>
                    <button 
                      onClick={() => updateAppointmentStatus(a.appointmentId, "cancelled")}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                      title="Reject Booking"
                    >
                      <XCircle size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Unread Messages (Dhruv's visual components style) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-5 border-b border-slate-50 pb-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Mail size={18} className="text-brand-600" />
              <span>Recent Inquiries</span>
            </h3>
            <button 
              onClick={() => setActiveTab("inquiries")} 
              className="text-brand-600 text-xs font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          {inquiries.filter(m => m.status === "unread").length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm font-medium">
              No unread patient inquiries. All caught up!
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {inquiries.filter(m => m.status === "unread").slice(0, 3).map((m) => (
                <div 
                  key={m.messageId} 
                  className="p-3.5 bg-slate-50/75 border border-slate-100/50 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-800 text-sm truncate">{m.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{m.email}</p>
                    </div>
                    <button 
                      onClick={() => markMessageRead(m.messageId)}
                      className="text-xs text-brand-600 font-semibold hover:underline shrink-0"
                    >
                      Mark Read
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 italic mt-2.5 bg-white p-3 rounded-lg border border-slate-100/50 line-clamp-2 leading-relaxed">
                    "{m.messageText}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
