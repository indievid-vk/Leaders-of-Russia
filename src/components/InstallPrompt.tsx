import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share, Smartphone } from 'lucide-react';

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const representsStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://') ||
      window.location.search.includes('mode=standalone');

    setIsStandalone(!!representsStandalone);
    if (representsStandalone) {
      return;
    }

    // Listen for native appinstalled event
    const handleAppInstalled = () => {
      console.log('PWA: App successfully installed');
      localStorage.setItem('pwaPromptedForever_v1', 'true');
      localStorage.setItem('pwa_just_installed', 'true');
      setShowPrompt(false);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    // Try to get early intercepted prompt from index.html
    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
      setIsInstallable(true);
    }

    const checkDevice = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) || 
                          (navigator.maxTouchPoints > 0 && /macintel|macintosh/.test(userAgent));
      
      if (isIOSDevice) {
        setIsIOS(true);
        if (!localStorage.getItem('pwaPromptDismissed') && !(window as any).pwaPopupActive) {
          setShowPrompt(true);
        }
      }
    };

    checkDevice();
    
    // Catch standard install prompt (Android, Desktop Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      if (!localStorage.getItem('pwaPromptDismissed') && !(window as any).pwaPopupActive) {
        setShowPrompt(true);
      }
    };

    // Custom early intercept listener
    const handleEarlyPromptReady = (e: any) => {
      const promptEvent = e.detail;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
      if (!localStorage.getItem('pwaPromptDismissed') && !(window as any).pwaPopupActive) {
        setShowPrompt(true);
      }
    };

    // Custom event to trigger manually from "About" page
    const handleTriggerManual = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) || 
                          (navigator.maxTouchPoints > 0 && /macintel|macintosh/.test(userAgent));
      
      if (isIOSDevice) {
        setIsIOS(true);
      } else {
        const activePrompt = deferredPrompt || (window as any).deferredPrompt;
        if (activePrompt) {
          setDeferredPrompt(activePrompt);
          setIsInstallable(true);
        } else {
          setIsInstallable(false);
        }
      }
      setShowPrompt(true);
    };

    // Callback when any popup is closed
    const handlePopupClosed = () => {
      if (!(window as any).pwaPopupActive && !localStorage.getItem('pwaPromptDismissed')) {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) || 
                            (navigator.maxTouchPoints > 0 && /macintel|macintosh/.test(userAgent));
        if (isIOSDevice) {
          setIsIOS(true);
          setShowPrompt(true);
        } else {
          const activePrompt = deferredPrompt || (window as any).deferredPrompt;
          if (activePrompt) {
            setDeferredPrompt(activePrompt);
            setIsInstallable(true);
            setShowPrompt(true);
          }
        }
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('pwa-prompt-available', handleEarlyPromptReady as EventListener);
    window.addEventListener('pwa-deferred-prompt-ready', handleEarlyPromptReady as EventListener);
    window.addEventListener('trigger-pwa-install-prompt', handleTriggerManual);
    window.addEventListener('pwa-popup-closed', handlePopupClosed);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-prompt-available', handleEarlyPromptReady as EventListener);
      window.removeEventListener('pwa-deferred-prompt-ready', handleEarlyPromptReady as EventListener);
      window.removeEventListener('trigger-pwa-install-prompt', handleTriggerManual);
      window.removeEventListener('pwa-popup-closed', handlePopupClosed);
    };
  }, [deferredPrompt]);

  // Keep track of window-level state and lock
  useEffect(() => {
    if (showPrompt) {
      if (!(window as any).pwaPopupActive) {
        (window as any).pwaPopupActive = 'install';
      }
    } else {
      if ((window as any).pwaPopupActive === 'install') {
        (window as any).pwaPopupActive = null;
        window.dispatchEvent(new CustomEvent('pwa-popup-closed'));
      }
    }
    return () => {
      if ((window as any).pwaPopupActive === 'install') {
        (window as any).pwaPopupActive = null;
        window.dispatchEvent(new CustomEvent('pwa-popup-closed'));
      }
    };
  }, [showPrompt]);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  const handleInstall = async () => {
    const activePrompt = deferredPrompt || (window as any).deferredPrompt;
    if (activePrompt) {
      activePrompt.prompt();
      const { outcome } = await activePrompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('pwaPromptedForever_v1', 'true');
        localStorage.setItem('pwa_just_installed', 'true');
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
      (window as any).deferredPrompt = null;
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) for installing the app - round in bottom right corner */}
      <AnimatePresence>
        {!isStandalone && !showPrompt && (
          <motion.button
            id="pwa-install-fab"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowPrompt(true)}
            className="fixed bottom-6 right-6 z-40 bg-[#c33b3b] hover:bg-[#b03030] text-white rounded-full p-4 shadow-xl shadow-red-950/35 flex items-center justify-center cursor-pointer border border-white/20 transition-all active:scale-90"
            title="Установить приложение"
            aria-label="Установить приложение"
          >
            <Download size={22} className="stroke-[2.5]" />
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-amber-300 border-2 border-[#c33b3b]" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPrompt && (
          <motion.div
            id="pwa-install-prompt-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md pointer-events-auto"
          >
            <motion.div 
              id="pwa-install-prompt-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[36px] shadow-2xl p-8 max-w-sm w-full relative overflow-hidden border border-slate-100 flex flex-col items-center"
            >
              <button 
                onClick={handleDismiss}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>

              {/* App Icon Badge */}
              <div className="w-20 h-20 rounded-3xl overflow-hidden mb-5 mt-2 border-2 border-slate-100 shadow-lg shadow-slate-200 shrink-0 bg-white">
                <img 
                  src="icon-192.png" 
                  alt="История. Подготовка" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
                Установка
              </h3>
              
              <p className="text-slate-500 text-sm text-center max-w-[280px] mt-2 mb-6 leading-relaxed">
                Добавьте приложение на рабочий стол для мгновенного доступа и работы офлайн.
              </p>

              {/* Android/Desktop with Native prompt */}
              {isInstallable && !isIOS && (
                <div className="w-full flex flex-col items-center">
                  <button
                    onClick={handleInstall}
                    className="w-full bg-[#c33b3b] hover:bg-[#b03030] text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-red-950/10 transition-all active:scale-[0.98] cursor-pointer text-sm font-sans mb-4"
                  >
                    Установить сейчас
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="text-slate-400 hover:text-slate-600 font-sans text-sm font-medium transition-colors cursor-pointer mb-2"
                  >
                    Продолжить в браузере
                  </button>
                </div>
              )}

              {/* iOS Manual instructions */}
              {isIOS && (
                <div className="w-full flex flex-col items-center">
                  <div className="bg-[#FFFDF9] border border-[#FFEBCE] rounded-[28px] p-5 w-full text-left mb-6">
                    <h4 className="text-[11px] font-bold text-[#FF7A00] tracking-wider mb-4 font-sans uppercase">
                      Как установить на iOS (iPhone/iPad):
                    </h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3.5">
                        <span className="flex items-center justify-center bg-[#FFEAD1] text-[#D96300] w-6 h-6 rounded-full text-xs font-bold shrink-0 mt-0.5">1</span>
                        <span className="text-sm text-slate-700 leading-tight">
                          Нажмите <strong className="text-slate-800 font-semibold">«Меню»</strong> или <span className="inline-flex items-center justify-center bg-[#E5F1FF] text-[#0066CC] px-1.5 py-0.5 rounded-md mx-1"><Share size={12} className="stroke-[2.5]" /></span> <strong className="text-slate-800 font-semibold">«Поделиться»</strong> в Safari
                        </span>
                      </li>
                      <li className="flex items-start gap-3.5">
                        <span className="flex items-center justify-center bg-[#FFEAD1] text-[#D96300] w-6 h-6 rounded-full text-xs font-bold shrink-0 mt-0.5">2</span>
                        <span className="text-sm text-slate-700 leading-tight">
                          Выберите пункт <strong className="text-slate-800 font-semibold">«На экран "Домой"»</strong> (Add to Home Screen)
                        </span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleDismiss}
                    className="text-slate-400 hover:text-slate-600 font-sans text-sm font-medium transition-colors cursor-pointer mb-2"
                  >
                    Продолжить в браузере
                  </button>
                </div>
              )}

              {/* Android / Desktop fallback if native prompt is not available */}
              {!isInstallable && !isIOS && (
                <div className="w-full flex flex-col items-center">
                  <div className="bg-[#FFFDF9] border border-[#FFEBCE] rounded-[28px] p-5 w-full text-left mb-6">
                    <h4 className="text-[11px] font-bold text-[#FF7A00] tracking-wider mb-4 font-sans uppercase">
                      Инструкция по установке на Android:
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-1">
                      Откройте меню настроек вашего браузера (обычно три точки <strong className="text-slate-800 font-semibold">⋮</strong> в верхнем правом углу) и выберите <strong className="text-slate-800 font-semibold">«Установить приложение»</strong> или <strong className="text-slate-800 font-semibold">«Добавить на главный экран»</strong>.
                    </p>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="text-slate-400 hover:text-slate-600 font-sans text-sm font-medium transition-colors cursor-pointer mb-2"
                  >
                    Продолжить в браузере
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
