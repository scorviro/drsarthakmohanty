import React from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";

interface ContactMessage {
  messageId: string;
  name: string;
  email: string;
  messageText: string;
  status: "unread" | "read";
  createdAt: string;
}

interface InquiriesTabProps {
  inquiries: ContactMessage[];
  markMessageRead: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

export default function InquiriesTab({
  inquiries,
  markMessageRead,
  deleteMessage,
}: InquiriesTabProps) {
  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Inquiries</h1>
        <p className="text-slate-600 mt-1">Review incoming queries sent via the contact form and respond to patients directly.</p>
      </div>

      {/* Cards List (Dhruv's visual components style) */}
      <div className="space-y-4">
        {inquiries.map((m) => (
          <div 
            key={m.messageId} 
            className={`p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden transition-all ${
              m.status === "unread" 
                ? "border-slate-100 border-l-4 border-l-brand-600" 
                : "border-slate-100"
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-base leading-none">{m.name}</h3>
                  {m.status === "unread" ? (
                    <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1">
                      <Mail size={10} /> New
                    </span>
                  ) : (
                    <span className="bg-slate-50 text-slate-400 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1">
                      <MailOpen size={10} /> Read
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  {m.email} · Received: {new Date(m.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {m.status === "unread" && (
                  <button 
                    onClick={() => markMessageRead(m.messageId)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                  >
                    Mark Read
                  </button>
                )}
                <a 
                  href={`mailto:${m.email}?subject=Response from Dr. Sarthak Kumar Mohanty`}
                  className="px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-100 rounded-lg transition"
                >
                  Reply Email
                </a>
                <button 
                  onClick={() => deleteMessage(m.messageId)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  title="Delete inquiry"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-slate-50 border border-slate-100/50 rounded-xl text-slate-700 text-sm whitespace-pre-wrap leading-relaxed italic">
              "{m.messageText}"
            </div>
          </div>
        ))}
        {inquiries.length === 0 && (
          <div className="bg-white border border-slate-100 p-16 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-500 mb-3">
              <Mail size={22} />
            </div>
            <p className="text-slate-700 font-semibold font-heading text-base">No inquiries found</p>
            <p className="text-slate-400 text-xs mt-1">Incoming website contact form submissions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
