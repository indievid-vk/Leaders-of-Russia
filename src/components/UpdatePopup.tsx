import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Check } from 'lucide-react';

const CURRENT_VERSION = '1.0.1';

export default function UpdatePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const lastVersion = localStorage.getItem('appVersion');
    
    if (!lastVersion) {
      // First visit with this versioning system, just save it
      localStorage.setItem('appVersion', CURRENT_VERSION);
    } else if (lastVersion !== CURRENT_VERSION) {
      // Version mismatch - show update notification
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('appVersion', CURRENT_VERSION);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
        >
          <motion.div 
            className="bg-white rounded-[32px] shadow-2xl p-8 max-w-sm w-full relative overflow-hidden border border-slate-100"
            layoutId="update-modal"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -mr-8 -mt-8 z-0" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="bg-blue-600 text-white p-4 rounded-3xl mb-6 shadow-xl shadow-blue-100">
                <Sparkles size={32} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Приложение обновилось!</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Мы добавили новые функции и улучшили работу приложения. Ознакомьтесь с изменениями в разделе «О приложении».
              </p>
              
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={handleDismiss}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Check size={20} />
                  <span>Понятно</span>
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
