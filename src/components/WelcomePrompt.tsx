import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WelcomePrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if running in installed app (standalone mode)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://') ||
      window.location.search.includes('mode=standalone') ||
      localStorage.getItem('pwa_just_installed') === 'true';

    const alreadyWelcomed = 
      localStorage.getItem('hasSeenWelcome') || 
      localStorage.getItem('installed_welcome_shown') || 
      localStorage.getItem('pwa_welcome_shown');

    // ONLY show in installed standalone app AND ONLY ONCE right after install
    if (isStandalone && !alreadyWelcomed) {
      const timer = setTimeout(() => {
        if (!(window as any).pwaPopupActive) {
          setShow(true);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            console.warn('Confetti error:', e);
          }
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (show) {
      (window as any).pwaPopupActive = 'welcome';
    } else {
      if ((window as any).pwaPopupActive === 'welcome') {
        (window as any).pwaPopupActive = null;
        window.dispatchEvent(new CustomEvent('pwa-popup-closed'));
      }
    }
    return () => {
      if ((window as any).pwaPopupActive === 'welcome') {
        (window as any).pwaPopupActive = null;
        window.dispatchEvent(new CustomEvent('pwa-popup-closed'));
      }
    };
  }, [show]);

  const handleStart = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    localStorage.setItem('installed_welcome_shown', 'true');
    localStorage.setItem('pwa_welcome_shown', 'true');
    localStorage.removeItem('pwa_just_installed');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="pwa-welcome-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md pointer-events-auto"
        >
          <motion.div
            id="pwa-welcome-modal"
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 20 }}
            className="bg-white rounded-[36px] shadow-2xl p-8 max-w-sm w-full relative overflow-hidden border border-slate-100 flex flex-col items-center text-center"
          >
            {/* Celebration Badge */}
            <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 mt-2 border border-emerald-100 shadow-inner relative">
              <CheckCircle2 size={48} className="text-emerald-600 stroke-[2.2]" />
              <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 p-1.5 rounded-full shadow-md animate-bounce">
                <Sparkles size={16} />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-sans mb-3">
              Поздравляем!
            </h3>

            <p className="text-slate-600 text-base font-medium leading-relaxed mb-8 max-w-[280px]">
              Приложение установлено и готово к работе
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
