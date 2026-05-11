import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, X } from 'lucide-react';

export default function UpdatePrompt() {
  const [show, setShow] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (!reg) return;

        const checkUpdate = (registration: ServiceWorkerRegistration) => {
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setShow(true);
          }
        };

        // Check on load
        checkUpdate(reg);

        // Listen for new worker
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                setShow(true);
              }
            });
          }
        });
      });

      // Handle controller change (reload after skipWaiting)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
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
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 left-4 right-4 z-50 flex justify-center pointer-events-none"
        >
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 w-full max-w-sm pointer-events-auto border border-slate-700/50 backdrop-blur-lg">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-xl text-blue-400">
                <RefreshCw size={20} className="animate-spin-slow" />
              </div>
              <div>
                <p className="font-bold text-sm">Приложение обновилось</p>
                <p className="text-xs text-slate-400">Нажмите, чтобы применить</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-900/20"
              >
                Обновить
              </button>
              <button 
                onClick={() => setShow(false)}
                className="p-2 text-slate-500 hover:text-white transition-colors"
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
