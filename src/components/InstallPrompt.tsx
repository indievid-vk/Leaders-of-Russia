import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share } from 'lucide-react';

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false); // Can be Desktop or Android
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      return;
    }

    // Check if dismissed before
    const isDismissed = localStorage.getItem('pwaPromptDismissed');
    if (isDismissed) {
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    
    // Check iOS
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setIsIOS(true);
      setShowPrompt(true);
    }
    
    // Catch standard install prompt (Android, Desktop Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: beforeinstallprompt event caught');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 sm:p-6 pointer-events-none"
        >
          <div className="bg-white rounded-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-6 w-full max-w-md pointer-events-auto relative">
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-600 text-white p-4 rounded-3xl mb-4 shadow-lg shadow-blue-100">
                <Download size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Установить приложение
              </h3>
              
              {isInstallable && (
                <>
                  <p className="text-slate-600 mb-6 max-w-[280px]">
                    Установите «Правители России» на экран домой для быстрого доступа и работы без интернета.
                  </p>
                  <button
                    onClick={handleInstall}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                  >
                    Установить сейчас
                  </button>
                </>
              )}

              {isIOS && (
                <div className="w-full text-slate-600">
                  <p className="mb-4">Установите на экран «Домой», чтобы приложение всегда было под рукой.</p>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm text-slate-500 text-left">
                    <ol className="space-y-3">
                      <li className="flex items-center gap-3">
                        <span className="flex items-center justify-center bg-white border border-slate-200 w-6 h-6 rounded-full text-xs font-bold text-blue-600">1</span>
                        <span>Нажмите кнопку «Поделиться» <Share size={16} className="inline mb-1 text-blue-600" /></span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="flex items-center justify-center bg-white border border-slate-200 w-6 h-6 rounded-full text-xs font-bold text-blue-600">2</span>
                        <span>Выберите <strong>«На экран "Домой"»</strong></span>
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
