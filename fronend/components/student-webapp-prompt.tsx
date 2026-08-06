"use client";

import { useState, useEffect } from "react";
import { Download, Monitor, Smartphone, CheckCircle, X, Sparkles, Laptop } from "lucide-react";

export function StudentWebappPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registered successfully."))
        .catch((err) => console.log("Service Worker registration failed:", err));
    }

    // 2. Check if already installed / standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;

    if (isStandalone) {
      setInstalled(true);
      return;
    }

    // 3. Catch browser install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Auto show modal on student dashboard if not dismissed recently
      const dismissed = localStorage.getItem("student_webapp_prompt_dismissed");
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const handleOpenModal = () => {
      setShowPrompt(true);
      setShowInstructions(false);
    };

    window.addEventListener("open-webapp-installer", handleOpenModal);

    // Fallback: If beforeinstallprompt hasn't fired in 1.2s (e.g. Chrome desktop or iOS), show prompt modal
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem("student_webapp_prompt_dismissed");
      if (!dismissed && !isStandalone) {
        setShowPrompt(true);
      }
    }, 1200);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("open-webapp-installer", handleOpenModal);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setInstalled(true);
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // Create a downloadable Windows Desktop WebApp shortcut (.url file)
      const shortcutContent = `[InternetShortcut]\nURL=${window.location.origin}/student/courses\nIDList=\nIconFile=${window.location.origin}/icon.svg\nIconIndex=0\nHotKey=0`;
      const blob = new Blob([shortcutContent], { type: "application/x-ms-shortcut" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Science LMS - Student Portal.url";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("student_webapp_prompt_dismissed", "true");
  };

  if (!showPrompt || installed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/80 bg-white p-6 shadow-2xl transition-all">
        {/* Header gradient banner */}
        <div className="-mx-6 -mt-6 mb-6 bg-gradient-to-r from-[#002583] via-[#001d68] to-[#001548] p-6 text-white">
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFB800] text-2xl shadow-md">
              📲
            </span>
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#FFB800]">
                <Sparkles size={12} /> Student WebApp
              </span>
              <h3 className="text-xl font-black leading-tight text-white">
                Add Shortcut to Home Screen
              </h3>
            </div>
          </div>
        </div>

        <p className="text-sm font-semibold leading-relaxed text-ink/75">
          Install the <strong className="text-[#002583]">Student LMS WebApp</strong> on your phone or desktop for quick 1-click access to live classes, recordings, and tutes without opening a browser tab!
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-[#002583]">
          <div className="flex items-center gap-2 rounded-2xl bg-lavender-50 p-3">
            <Monitor size={18} className="text-[#FFB800]" />
            <span>Desktop & Laptop App</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-lavender-50 p-3">
            <Smartphone size={18} className="text-[#FFB800]" />
            <span>Mobile Home Screen</span>
          </div>
        </div>

        {showInstructions ? (
          <div className="mt-4 rounded-2xl bg-amber-50 p-4 border border-amber-200/80 text-xs text-amber-900 space-y-2">
            <p className="font-black text-amber-950 flex items-center gap-1.5">
              <CheckCircle size={15} className="text-amber-600" /> Shortcut downloaded & Browser setup:
            </p>
            <ol className="list-decimal pl-4 space-y-1 font-medium">
              <li>Open your downloaded <strong>Science LMS - Student Portal.url</strong> file to launch immediately.</li>
              <li>Or click <strong>⋮ (3 dots menu)</strong> in Chrome / Edge &rarr; select <strong>Save & Share &rarr; Install WebApp</strong>.</li>
            </ol>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={handleInstallClick}
            className="gold-button w-full justify-center text-sm py-3 font-black shadow-button hover:scale-[1.02] transition"
          >
            <Download size={18} />
            {deferredPrompt ? "Install WebApp Shortcut Now" : "Create Desktop & App Shortcut"}
          </button>

          <button
            onClick={handleDismiss}
            className="w-full text-center text-xs font-bold text-ink/50 hover:text-ink/80 py-1.5"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
