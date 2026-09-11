import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

interface BackToTopButtonProps {
  threshold?: number;
  targetId?: string;
  className?: string;
}

export default function BackToTopButton({
  threshold = 200,
  targetId,
  className = '',
}: BackToTopButtonProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mainElement = document.querySelector('main');

    const handleScroll = () => {
      if (mainElement) {
        setShow(mainElement.scrollTop > threshold);
      } else {
        setShow(window.scrollY > threshold);
      }
    };

    const target = mainElement || window;
    target.addEventListener('scroll', handleScroll);
    return () => target.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          id="back-to-top-fab"
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={scrollToTop}
          className={`fixed bottom-24 right-6 z-50 p-3.5 bg-slate-900/90 text-white rounded-full shadow-2xl hover:bg-slate-950 transition-all cursor-pointer backdrop-blur-md border border-white/20 active:scale-95 flex items-center justify-center ${className}`}
          title="Наверх"
          aria-label="Прокрутить страницу наверх"
        >
          <ArrowUp size={20} className="stroke-[2.5]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
