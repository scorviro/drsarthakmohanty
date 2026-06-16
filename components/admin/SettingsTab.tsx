import React from "react";
import { motion } from "framer-motion";

interface SystemSettings {
  isBookingEnabled: boolean;
  contactPhone: string;
  clinicTimings: string;
  showReviews: boolean;
}

interface SettingsTabProps {
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  handleSaveSettings: (e: React.FormEvent) => Promise<void>;
}

export default function SettingsTab({
  settings,
  setSettings,
  handleSaveSettings,
}: SettingsTabProps) {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-600 mt-1">Configure global variables, clinic hours, contact details, and feature flags.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-6">
        
        {/* Toggle Booking */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h4 className="font-bold text-slate-900">Enable Patient Booking system</h4>
            <p className="text-xs text-slate-500">Temporarily pause/unpause bookings on the website homepage.</p>
          </div>
          <button
            type="button"
            onClick={() => setSettings(prev => ({ ...prev, isBookingEnabled: !prev.isBookingEnabled }))}
            className={`w-14 h-8 rounded-full p-1 transition-all ${settings.isBookingEnabled ? "bg-brand-teal flex justify-end" : "bg-slate-200 flex justify-start"}`}
          >
            <motion.div layout className="w-6 h-6 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Toggle Reviews */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h4 className="font-bold text-slate-900">Show Reviews Section</h4>
            <p className="text-xs text-slate-500">Toggle display of testimonials feed on the live site.</p>
          </div>
          <button
            type="button"
            onClick={() => setSettings(prev => ({ ...prev, showReviews: !prev.showReviews }))}
            className={`w-14 h-8 rounded-full p-1 transition-all ${settings.showReviews ? "bg-brand-teal flex justify-end" : "bg-slate-200 flex justify-start"}`}
          >
            <motion.div layout className="w-6 h-6 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Clinic Timings */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-800">Clinic Timings (Text)</label>
          <input 
            type="text" 
            value={settings.clinicTimings}
            onChange={(e) => setSettings(prev => ({ ...prev, clinicTimings: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-sm"
            required
          />
        </div>

        {/* Clinic Phone */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-800">Contact Phone Number</label>
          <input 
            type="text" 
            value={settings.contactPhone}
            onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-sm"
            required
          />
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="bg-brand-teal hover:bg-[#00a892] text-slate-950 font-bold py-3 px-6 rounded-xl transition-all shadow-md text-xs"
          >
            Save Settings
          </button>
        </div>

      </form>
    </div>
  );
}
