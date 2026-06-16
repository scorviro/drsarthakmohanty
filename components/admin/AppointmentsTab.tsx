import React from "react";
import { Search, Trash2, Calendar, Check, XCircle, ChevronDown } from "lucide-react";

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

interface AppointmentsTabProps {
  appointments: Appointment[];
  updateAppointmentStatus: (id: string, status: "pending" | "confirmed" | "completed" | "cancelled") => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  searchQuery: string;
  statusFilter: string;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: string) => void;
}

export default function AppointmentsTab({
  appointments,
  updateAppointmentStatus,
  deleteAppointment,
  searchQuery,
  statusFilter,
  setSearchQuery,
  setStatusFilter,
}: AppointmentsTabProps) {
  
  const filtered = appointments.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Appointments Scheduler</h1>
          <p className="text-slate-600 mt-1">Manage consultation requests, confirm slots, and update patient appointment status.</p>
        </div>
      </div>

      {/* Filters & Search Toolbar (Dhruv's exact UI style) */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2">
        <div className="relative w-full sm:flex-1 sm:min-w-[280px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient name or phone..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition placeholder:text-slate-400 text-slate-800"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700
            focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* List Table (Dhruv's exact table style) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-100 bg-slate-50/60">
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Preferred Slot</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 w-40 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-800">
              {filtered.map((a) => (
                <tr key={a.appointmentId} className="group hover:bg-brand-50/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{a.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-normal">{a.phone}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800 leading-none">{a.date}</p>
                    <p className="text-xs text-slate-400 mt-1 font-normal">{a.timeSlot || "Not specified"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      a.status === "pending" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                      a.status === "confirmed" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                      a.status === "completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                      "bg-rose-50 text-rose-600 border border-rose-100"
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {a.status === "pending" && (
                        <button 
                          onClick={() => updateAppointmentStatus(a.appointmentId, "confirmed")}
                          className="px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-100 rounded-lg transition"
                        >
                          Confirm
                        </button>
                      )}
                      {a.status === "confirmed" && (
                        <button 
                          onClick={() => updateAppointmentStatus(a.appointmentId, "completed")}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg transition"
                        >
                          Mark Done
                        </button>
                      )}
                      <button 
                        onClick={() => deleteAppointment(a.appointmentId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete permanently"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 font-semibold">
                    No appointments found matching search/filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-50 text-xs text-slate-400 font-medium">
          Showing {filtered.length} appointment{filtered.length === 1 ? '' : 's'}
        </div>
      </div>
    </div>
  );
}
