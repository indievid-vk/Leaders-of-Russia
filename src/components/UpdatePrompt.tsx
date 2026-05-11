import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, X } from 'lucide-react';

export default function UpdatePrompt() {
  const [show, setShow] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
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

    navigator.serviceWorker.getRegistration().then(reg => {
      if (!reg) return;

      // 1. Check if there's already a waiting worker
      if (reg.waiting) {
        setWaitingWorker(reg.waiting);
        setShow(true);
      }

      // 2. Listen for future updates
      reg.addEventListener('updatefound', () => onUpdateFound(reg));
    });

    // 3. Periodic check for updates (every 5 minutes)
    const interval = setInterval(() => {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg) reg.update();
      });
    }, 5 * 60 * 1000);

    // 4. Handle controller change (automatic reload)
    const handleControllerChange = () => {
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    return () => {
      clearInterval(interval);
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-0 left-0 right-0 z-[60] flex justify-center p-4 sm:p-6 pointer-events-none"
        >
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl flex flex-col gap-6 w-full max-w-md pointer-events-auto border border-slate-700/50 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 text-white p-3 rounded-2xl shadow-lg shadow-blue-500/20 shrink-0">
                <RefreshCw size={28} className="animate-spin-slow" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Приложение обновилось</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Мы добавили новые функции и улучшили работу приложения. Обновите страницу, чтобы применить изменения.
                </p>
              </div>
              <button 
                onClick={() => setShow(false)}
                className="p-1 text-slate-500 hover:text-white transition-colors"
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3.5 px-6 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
              >
                Обновить сейчас
              </button>
              <button 
                onClick={() => setShow(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3.5 px-6 rounded-2xl font-bold transition-all active:scale-[0.98]"
              >
                Понятно
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
