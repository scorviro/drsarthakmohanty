"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

function AuthBridgeContent() {
  const searchParams = useSearchParams();
  const parentOrigin = searchParams.get("parentOrigin") || "";
  const isFallbackRedirect = searchParams.get("fallback") === "redirect";

  const [status, setStatus] = useState<"loading" | "ready" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [btnElement, setBtnElement] = useState<HTMLDivElement | null>(null);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  // 1. Dynamic GSI Script Loader (With race-condition resilience)
  useEffect(() => {
    if (window.google) {
      setIsScriptLoaded(true);
      return;
    }

    const existingScript = document.getElementById("gsi-script") as HTMLScriptElement;
    if (existingScript) {
      const handleLoad = () => setIsScriptLoaded(true);
      existingScript.addEventListener("load", handleLoad);
      
      const interval = setInterval(() => {
        if (window.google) {
          setIsScriptLoaded(true);
          clearInterval(interval);
        }
      }, 100);

      return () => {
        existingScript.removeEventListener("load", handleLoad);
        clearInterval(interval);
      };
    }

    const script = document.createElement("script");
    script.id = "gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
      setStatus("error");
      setErrorMsg("Failed to load Google Identity Services SDK.");
    };
    document.body.appendChild(script);
  }, []);

  // 2. Initialize Google Sign-In
  useEffect(() => {
    if (!btnElement || !isScriptLoaded) return;
    if (!googleClientId || googleClientId === "YOUR_GOOGLE_CLIENT_ID") {
      setStatus("error");
      setErrorMsg("Google Client ID is not configured on the server environment.");
      return;
    }

    // Polling for window.google if the script loaded but the global object isn't fully ready
    if (!window.google) {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initializeAndRender();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    initializeAndRender();

    function initializeAndRender() {
      if (!window.google || !btnElement) return;
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(btnElement, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "pill",
          logo_alignment: "left",
          width: 280,
        });
        setStatus("ready");
      } catch (err: any) {
        console.error("Google GSI init error in bridge:", err);
        setStatus("error");
        setErrorMsg(err.message || "Failed to initialize Google Sign-In.");
      }
    }
  }, [btnElement, isScriptLoaded, googleClientId]);

  // 3. Callback from Google GIS
  const handleCredentialResponse = (response: any) => {
    if (!response || !response.credential) {
      setStatus("error");
      setErrorMsg("No credentials returned from Google.");
      return;
    }

    setStatus("success");

    const targetOrigin = parentOrigin ? decodeURIComponent(parentOrigin) : window.location.origin;

    if (window.opener && !isFallbackRedirect) {
      try {
        window.opener.postMessage(
          {
            type: "google-auth-success",
            credential: response.credential,
          },
          targetOrigin
        );
        setTimeout(() => {
          window.close();
        }, 1200);
      } catch (e) {
        console.error("postMessage failed, falling back to URL redirect:", e);
        redirectToParent(response.credential, targetOrigin);
      }
    } else {
      redirectToParent(response.credential, targetOrigin);
    }
  };

  const redirectToParent = (credential: string, targetOrigin: string) => {
    const separator = targetOrigin.includes("?") ? "&" : "?";
    window.location.href = `${targetOrigin}${separator}google_credential=${encodeURIComponent(credential)}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-white relative overflow-hidden select-none">
      {/* Visual background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,191,165,0.15),rgba(255,255,255,0))]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-teal/10 rounded-[100%] blur-[80px] pointer-events-none" />

      {/* Grid line overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm glass-panel border border-white/10 rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 text-center flex flex-col items-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal mb-6 shadow-[0_8px_20px_rgba(0,191,165,0.1)]">
          <ShieldCheck size={28} />
        </div>

        <h2 className="display-font text-xl font-bold tracking-tight mb-2 text-slate-100">
          Secure OAuth Bridge
        </h2>
        <p className="text-slate-400 text-xs mb-8 leading-relaxed max-w-[280px]">
          Authenticating securely for Dr. Sarthak Mohanty's Medical Portal.
        </p>

        {/* Dynamic status handler */}
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-3 py-6 animate-pulse">
            <Loader2 className="animate-spin text-brand-teal" size={32} />
            <span className="text-[11px] text-slate-400 font-medium">Securing connection...</span>
          </div>
        )}

        {/* Google button container - always in DOM to avoid ref mount deadlock, hidden when loading */}
        <div 
          className={status === "ready" ? "w-full flex flex-col items-center space-y-4 py-4" : "hidden"}
        >
          <div ref={setBtnElement} className="min-h-[44px] flex items-center justify-center" />
          <p className="text-[10px] text-slate-500 max-w-[240px]">
            Click the button to sign in using your official Google Account.
          </p>
        </div>

        {status === "success" && (
          <div className="flex flex-col items-center space-y-3 py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-emerald-400">Authenticated successfully</span>
            <span className="text-[10px] text-slate-400">Redirecting back...</span>
          </div>
        )}

        {status === "error" && (
          <div className="w-full flex flex-col items-center py-4">
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-start space-x-3 text-left w-full mb-6">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div className="flex flex-col space-y-1">
                <span className="text-xs font-bold leading-none">Authentication Blocked</span>
                <span className="text-[10px] leading-relaxed text-rose-300">{errorMsg}</span>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all"
            >
              Retry Connection
            </button>
          </div>
        )}

        <div className="w-full mt-8 pt-6 border-t border-white/5 text-[9px] text-slate-500 flex justify-between px-2">
          <span>Client ID Verified</span>
          <span>SSL Encryption Active</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthBridgePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin text-brand-teal" size={32} />
      </div>
    }>
      <AuthBridgeContent />
    </Suspense>
  );
}
