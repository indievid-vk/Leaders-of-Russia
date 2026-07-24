import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Sparkles } from 'lucide-react';

const CURRENT_APP_VERSION = '1.0.2';

export default function UpdatePrompt() {
  const [show, setShow] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    // 1. Check if app was recently updated on server and reloaded
    const storedVersion = localStorage.getItem('pwa_app_version');
    if (storedVersion && storedVersion !== CURRENT_APP_VERSION) {
      setShow(true);
    } else if (!storedVersion) {
      localStorage.setItem('pwa_app_version', CURRENT_APP_VERSION);
    }

    if (!('serviceWorker' in navigator)) return;

    const onUpdateFound = (reg: ServiceWorkerRegistration) => {
      const newWorker = reg.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker);
            setShow(true);
          }
        });
      }
    };

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;

      if (reg.waiting) {
        setWaitingWorker(reg.waiting);
        setShow(true);
      }

      reg.addEventListener('updatefound', () => onUpdateFound(reg));
    }).catch(() => {});

    // Periodic SW update check (only if online)
    const interval = setInterval(() => {
      if (navigator.onLine && 'serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) reg.update().catch(() => {});
        }).catch(() => {});
      }
    }, 5 * 60 * 1000);

    // Active visibility check on return to app
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) reg.update().catch(() => {});
        }).catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Controller change triggers automatic reload
    const handleControllerChange = () => {
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  useEffect(() => {
    if (show) {
      (window as any).pwaPopupActive = 'update';
    } else {
      if ((window as any).pwaPopupActive === 'update') {
        (window as any).pwaPopupActive = null;
        window.dispatchEvent(new CustomEvent('pwa-popup-closed'));
      }
    }
    return () => {
      if ((window as any).pwaPopupActive === 'update') {
        (window as any).pwaPopupActive = null;
        window.dispatchEvent(new CustomEvent('pwa-popup-closed'));
      }
    };
  }, [show]);

  const handleStart = () => {
    localStorage.setItem('pwa_app_version', CURRENT_APP_VERSION);
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      setShow(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="pwa-update-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md pointer-events-auto"
        >
          <motion.div
            id="pwa-update-modal"
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 20 }}
            className="bg-white rounded-[36px] shadow-2xl p-8 max-w-sm w-full relative overflow-hidden border border-slate-100 flex flex-col items-center text-center"
          >
            {/* Update Badge */}
            <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 mt-2 border border-blue-100 shadow-inner relative">
              <RefreshCw size={44} className="text-blue-600 stroke-[2.2]" />
              <div className="absolute -top-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full shadow-md">
                <Sparkles size={16} />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-sans mb-3">
              Приложение обновилось!
            </h3>

            <p className="text-slate-600 text-base font-medium leading-relaxed mb-8 max-w-[280px]">
              Пользоваться стало еще удобнее
            </p>

            <button
              onClick={handleStart}
              className="w-full bg-[#c33b3b] hover:bg-[#b03030] text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-red-950/20 transition-all active:scale-[0.98] cursor-pointer text-base font-sans"
            >
              Начать
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
