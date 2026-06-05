"use client";
import { useEffect, useState } from "react";
import { X, Lock, CheckCircle2, AlertCircle, Loader2, ArrowRight, Info } from "lucide-react";
import { motion } from "framer-motion";

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  detectedNgrokUrl?: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleAuthModal({ isOpen, onClose, onLoginSuccess, detectedNgrokUrl }: GoogleAuthModalProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState("");
  const [isSecureOrigin, setIsSecureOrigin] = useState(true);
  const [secureOrigin, setSecureOrigin] = useState("");
  const [bridgeActive, setBridgeActive] = useState(false);
  const [btnElement, setBtnElement] = useState<HTMLDivElement | null>(null);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const isProdConfigured = Boolean(googleClientId && googleClientId !== "YOUR_GOOGLE_CLIENT_ID" && googleClientId !== "");

  // 1. Detect environment details and configure security flags
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLocalhost = window.location.hostname === "localhost";
      const isHttps = window.location.protocol === "https:";
      setIsSecureOrigin(isLocalhost || isHttps);
      
      const configSecureOrigin = process.env.NEXT_PUBLIC_SECURE_AUTH_ORIGIN || detectedNgrokUrl || "";
      setSecureOrigin(configSecureOrigin);

      // Diagnostic logging for OAuth testing
      console.log("=== Google Auth Diagnostics ===");
      console.log("Current Origin:", window.location.origin);
      console.log("Protocol:", window.location.protocol);
      console.log("Host:", window.location.hostname);
      console.log("Is Secure Origin (GIS allowed):", isLocalhost || isHttps);
      console.log("Secure Bridge Target Origin:", configSecureOrigin || "NOT_CONFIGURED");
      console.log("Google Client ID Status:", isProdConfigured ? "CONFIGURED" : "MISSING");
      console.log("===============================");
    }
  }, [isOpen, detectedNgrokUrl]);

  // 2. Load Google SDK for secure origins
  useEffect(() => {
    if (!isOpen || !isSecureOrigin) return;

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
      setError("Failed to load Google Sign-In SDK. Check your network.");
    };
    document.body.appendChild(script);
  }, [isOpen, isSecureOrigin]);

  // 3. Initialize Google GIS (Only runs on secure origins like localhost or HTTPS)
  useEffect(() => {
    if (!btnElement || !isScriptLoaded || !isOpen || !isProdConfigured || !isSecureOrigin) return;
    
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
          width: 320,
        });
      } catch (err: any) {
        console.error("Google GSI init error:", err);
        setError("Google Sign-In initialization failed: " + (err.message || err));
      }
    }
  }, [btnElement, isScriptLoaded, isOpen, isProdConfigured, isSecureOrigin]);

  // 4. Handle credential token response and sign in
  const handleCredentialResponse = async (response: any) => {
    setError("");
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      if (res.ok) {
        const data = await res.json();
        onLoginSuccess(data.user);
      } else {
        const err = await res.json();
        setError(err.error || "Authentication verification failed.");
      }
    } catch (err) {
      setError("Network error. Please verify server connection.");
    }
  };

  // 5. Secure Cross-Origin Auth Bridge Popup Flow
  const handleSecureBridgeSignIn = () => {
    if (!secureOrigin) {
      setError("Secure Auth Bridge target origin not configured in .env.local.");
      return;
    }

    setError("");
    setBridgeActive(true);

    const parentOrigin = window.location.origin;
    const bridgeUrl = `${secureOrigin}/auth/bridge?parentOrigin=${encodeURIComponent(parentOrigin)}`;

    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      bridgeUrl,
      "Google_OAuth_Secure_Bridge",
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      // Popup blocked - fallback to redirect
      console.log("Popup blocked. Redirecting parent page to bridge...");
      window.location.href = `${bridgeUrl}&fallback=redirect`;
      return;
    }

    // Listen for postMessage from the popup
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message comes from the configured secure origin
      if (event.origin !== secureOrigin) return;

      if (event.data && event.data.type === "google-auth-success") {
        window.removeEventListener("message", handleMessage);
        const { credential } = event.data;
        // Complete sign-in on the local IP domain using the credential
        handleCredentialResponse({ credential });
        setBridgeActive(false);
      }
    };

    window.addEventListener("message", handleMessage);

    // Watch popup closure
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        setBridgeActive(false);
        window.removeEventListener("message", handleMessage);
      }
    }, 1000);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-[460px] bg-white rounded-[32px] border border-slate-200 shadow-2xl p-8 md:p-10 z-10 text-center max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-brand-teal/10 flex items-center justify-center text-brand-teal mb-6 shadow-[0_8px_20px_rgba(0,191,165,0.12)]">
            <Lock size={26} />
          </div>

          <h3 className="display-font text-2xl font-bold text-slate-900 mb-2">
            Secure Verification
          </h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            We require a verified Google Account to prevent spam and maintain medical authenticity.
          </p>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 flex items-start space-x-2 text-left w-full">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Secure Trust Highlights */}
          <div className="w-full bg-[#FAFBFD] border border-slate-100 rounded-2xl p-4 text-left space-y-3 mb-6">
            <div className="flex items-start space-x-2.5 text-xs text-slate-500">
              <CheckCircle2 className="text-brand-teal mt-0.5 flex-shrink-0" size={14} />
              <span>Only your verified name and rating will be shown publicly.</span>
            </div>
            <div className="flex items-start space-x-2.5 text-xs text-slate-500">
              <CheckCircle2 className="text-brand-teal mt-0.5 flex-shrink-0" size={14} />
              <span>Your email address remains strictly private and confidential.</span>
            </div>
            <div className="flex items-start space-x-2.5 text-xs text-slate-500">
              <CheckCircle2 className="text-brand-teal mt-0.5 flex-shrink-0" size={14} />
              <span>One review per Google Account — no duplicate submissions allowed.</span>
            </div>
          </div>

          {/* OAuth button or bridge trigger */}
          <div className="w-full mb-2">
            {isProdConfigured ? (
              isSecureOrigin ? (
                // 1. Safe secure origin flow (localhost or HTTPS)
                <div className="w-full flex flex-col items-center space-y-3">
                  <div ref={setBtnElement} className="min-h-[44px] flex items-center justify-center" />
                  <span className="text-[10px] text-slate-400">Verified by official Google Sign-In</span>
                </div>
              ) : secureOrigin ? (
                // 2. Local network IP or non-HTTPS: trigger secure origin OAuth bridge
                <div className="w-full space-y-3">
                  <button
                    onClick={handleSecureBridgeSignIn}
                    disabled={bridgeActive}
                    className="w-full py-3.5 px-6 bg-slate-900 hover:bg-brand-teal hover:text-slate-950 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-md border border-slate-800 disabled:opacity-50"
                  >
                    {bridgeActive ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-xs">Connecting to Secure Bridge...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs">Sign In with Google (Secure Bridge)</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                  
                  <div className="p-3 bg-blue-50/50 border border-blue-200/50 rounded-2xl text-left flex items-start space-x-2.5">
                    <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] text-blue-700 leading-normal">
                      Testing locally on mobile? Using HTTPS auth bridge on: <code className="bg-blue-100/50 px-1 py-0.5 rounded font-mono">{secureOrigin.replace(/^https?:\/\//, "")}</code>
                    </p>
                  </div>
                </div>
              ) : (
                // 3. Local network IP but bridge is not configured: display developer diagnostic steps
                <div className="w-full p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left space-y-2">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                    Mobile Testing Setup Required
                  </span>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Google OAuth does not support raw HTTP IP addresses (like <code className="bg-amber-100 px-1 py-0.5 rounded">{typeof window !== "undefined" && window.location.hostname}</code>) as JavaScript origins.
                  </p>
                  <div className="text-[10px] text-amber-800 space-y-1 pt-1 font-medium">
                    <p>1. Start an HTTPS tunnel (e.g. <code className="bg-amber-100 px-1 py-0.5 rounded">ngrok</code>).</p>
                    <p>2. Add <code className="bg-amber-100 px-1 py-0.5 rounded">NEXT_PUBLIC_SECURE_AUTH_ORIGIN=https://your-ngrok.ngrok-free.app</code> to your <code className="bg-amber-100 px-1 py-0.5 rounded">.env.local</code>.</p>
                    <p>3. Register the ngrok URL in Google Cloud Console.</p>
                  </div>
                </div>
              )
            ) : (
              // Configuration missing
              <div className="w-full p-4 bg-red-50 border border-red-200 rounded-2xl text-left">
                <span className="text-xs font-bold text-red-800 uppercase tracking-wider block mb-1">
                  Google Client ID Missing
                </span>
                <p className="text-[11px] text-red-700 leading-normal">
                  Please configure <code className="bg-red-100 px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in your <code className="bg-red-100 px-1 py-0.5 rounded">.env.local</code> to enable Sign-In.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
