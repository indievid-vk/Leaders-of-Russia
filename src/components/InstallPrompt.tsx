import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share } from 'lucide-react';

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
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
    
    // Check Android & catch install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsAndroid(true);
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
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 sm:max-w-sm sm:mx-auto sm:bottom-8"
      >
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-1 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex gap-4">
          <div className="bg-blue-100 p-3 rounded-2xl h-fit text-blue-600 shrink-0">
            <Download size={24} />
          </div>
          
          <div className="flex flex-col gap-2 pt-1 pr-6">
            <h3 className="font-bold text-slate-800 leading-tight">
              Установить приложение
            </h3>
            
            {isAndroid && (
              <>
                <p className="text-sm text-slate-600 leading-snug">
                  Установите приложение на главный экран для быстрого доступа без интернета.
                </p>
                <button
                  onClick={handleInstall}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl shadow-md transition-colors w-full text-center"
                >
                  Установить
                </button>
              </>
            )}

            {isIOS && (
              <div className="text-sm text-slate-600 leading-snug space-y-2 mt-1">
                <p>Установите приложение на экран «Домой» для работы без интернета.</p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500">
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Нажмите на иконку <Share size={14} className="inline opacity-70 mb-0.5 mx-0.5" /> внизу экрана</li>
                    <li>Выберите пункт <strong>«На экран "Домой"»</strong></li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
