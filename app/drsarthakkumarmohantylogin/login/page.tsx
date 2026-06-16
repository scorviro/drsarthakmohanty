"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated, if so redirect to /admin
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user?.isAdmin) {
            router.push("/drsarthakkumarmohantylogin");
            return;
          }
        }
      } catch (err) {
        console.error("Session check error on login mount:", err);
      }
      setChecking(false);
    };
    checkSession();
  }, [router]);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isCredentialsMode: true,
          email: loginEmail,
          password: loginPassword,
        }),
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/drsarthakkumarmohantylogin");
      } else {
        setLoginError(data.error || "Invalid doctor credentials.");
      }
    } catch (err) {
      setLoginError("Connection error. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="w-16 h-16 rounded-full border-2 border-brand-teal border-t-transparent animate-spin mb-4" />
        <p className="text-slate-400 font-medium tracking-wide">Checking authorization...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070b12] to-[#121c2e] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,191,165,0.08),transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[32px] p-8 text-center shadow-2xl"
      >
        <div className="w-16 h-16 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-teal border border-brand-teal/20">
          <ShieldAlert size={32} />
        </div>
        
        <h2 className="display-font text-2xl font-bold text-white mb-2">Clinical Command Portal</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Authorized admin access only. Please authenticate using your clinical doctor credentials.
        </p>

        <form onSubmit={handleManualLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Doctor Email</label>
            <input
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="doctor@example.com"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15 outline-none transition-all text-white placeholder:text-slate-500 font-medium text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Portal Key / Password</label>
            <input
              type="password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15 outline-none transition-all text-white placeholder:text-slate-500 font-medium text-sm"
            />
          </div>
          
          {loginError && (
            <p className="text-rose-500 text-xs font-semibold">{loginError}</p>
          )}

          <button 
            type="submit"
            disabled={loggingIn}
            className="w-full bg-brand-teal hover:bg-[#00a892] text-slate-950 py-3.5 px-6 rounded-2xl font-extrabold tracking-wide transition-all shadow-[0_0_20px_rgba(0,191,165,0.25)] flex items-center justify-center space-x-2 text-sm mt-6"
          >
            {loggingIn ? "Verifying..." : "Access Portal"}
          </button>
        </form>

      </motion.div>
    </div>
  );
}
