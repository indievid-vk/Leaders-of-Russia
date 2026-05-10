import { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Award, ChevronLeft, ChevronRight, BookOpen, GraduationCap, RotateCcw, User, Calendar, Shuffle, Play, Settings2, Trash2, LayoutGrid } from 'lucide-react';
import Flashcard, { RulerData } from './components/Flashcard';
import InstallPrompt from './components/InstallPrompt';
import rulersDataRaw from './lib/rulers.json';
import { saveProgress, getAllProgress, resetProgress } from './lib/db';

const rulersData: RulerData[] = rulersDataRaw as RulerData[];

type StudyVariant = 'nameFirst' | 'detailsFirst' | 'mixed';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnedCount, setLearnedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [learnedSet, setLearnedSet] = useState<Set<string>>(new Set());
  const [variant, setVariant] = useState<StudyVariant | null>(null);

  useEffect(() => {
    const savedVariant = localStorage.getItem('studyVariant') as StudyVariant;
    if (savedVariant) setVariant(savedVariant);
    
    async function loadProgress() {
      const all = await getAllProgress();
      const learned = new Set<string>();
      all.forEach(p => {
        if (p.status === 'learned') learned.add(p.id);
      });
      setLearnedSet(learned);
      setLearnedCount(learned.size);
      setIsReady(true);
    }
    loadProgress();
  }, []);

  const ruler = rulersData[currentIndex];
  // Simple ID generated from era + name
  const rulerId = `${ruler?.era}-${ruler?.name}`;
  const isLearned = learnedSet.has(rulerId);

  // Determine if this specific card should show details first
  const isDetailsFirst = useMemo(() => {
    if (variant === 'detailsFirst') return true;
    if (variant === 'mixed') {
      // Use currentIndex and rulerId as a "seed" for pseudo-randomness
      // so the card orientation stays consistent for that specific card during navigation
      const combined = `${currentIndex}-${rulerId}`;
      let hash = 0;
      for (let i = 0; i < combined.length; i++) {
        hash = ((hash << 5) - hash) + combined.charCodeAt(i);
        hash |= 0;
      }
      return hash % 2 === 0;
    }
    return false;
  }, [variant, currentIndex, rulerId]);

  const handleNext = () => {
    if (currentIndex < rulersData.length - 1) {
      setCurrentIndex(curr => curr + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
    }
  };

  const handleMarkLearned = async () => {
    if (!isLearned) {
      await saveProgress(rulerId, 'learned');
      setLearnedSet(prev => new Set(prev).add(rulerId));
      const newCount = learnedCount + 1;
      setLearnedCount(newCount);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#60a5fa', '#facc15', '#ffffff']
      });

      // Move to next card after a short delay
      setTimeout(handleNext, 800);
    }
  };

  const handleGoToStart = () => {
    setCurrentIndex(0);
  };

  const handleReset = async () => {
    if (confirm('Внимание! Это удалит весь изученный прогресс. Сбросить?')) {
      await resetProgress();
      setLearnedSet(new Set());
      setLearnedCount(0);
      setCurrentIndex(0);
      setVariant(null);
      localStorage.removeItem('studyVariant');
    }
  };

  const startStudy = (v: StudyVariant) => {
    setVariant(v);
    localStorage.setItem('studyVariant', v);
  };

  if (!isReady) return <div className="flex h-screen items-center justify-center bg-slate-50"><p className="text-slate-500 animate-pulse">Загрузка дневника...</p></div>;

  if (!variant) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 text-white p-4 rounded-3xl mb-4 shadow-lg shadow-blue-100">
              <BookOpen size={40} />
            </div>
            <h1 className="text-2xl font-bold text-center">Правители России</h1>
            <p className="text-slate-500 text-sm text-center mt-1">Выберите режим обучения</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => startStudy('nameFirst')}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                <User size={24} />
              </div>
              <div>
                <div className="font-bold">Имя сначала</div>
                <div className="text-xs text-slate-500">Угадывайте даты и события по имени</div>
              </div>
            </button>

            <button 
              onClick={() => startStudy('detailsFirst')}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                <Calendar size={24} />
              </div>
              <div>
                <div className="font-bold">Детали сначала</div>
                <div className="text-xs text-slate-500">Угадывайте имя по датам и событиям</div>
              </div>
            </button>

            <button 
              onClick={() => startStudy('mixed')}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                <Shuffle size={24} />
              </div>
              <div>
                <div className="font-bold">Смешанный режим</div>
                <div className="text-xs text-slate-500">Случайный порядок для каждой карточки</div>
              </div>
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <div className="text-xs text-slate-400 font-medium italic">
               Ваш прогресс сохраняется автоматически
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
          <button 
            onClick={() => setVariant(null)} 
            className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2 sm:px-3 py-2 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition font-medium text-xs sm:text-sm whitespace-nowrap"
            title="Сменить режим"
          >
             <Settings2 size={18} />
             <span className="hidden sm:inline">Режим</span>
          </button>
          <div className="border-l border-slate-200 pl-2 sm:pl-4 overflow-hidden">
            <h1 className="font-bold text-base sm:text-lg leading-tight truncate">Правители</h1>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase tracking-wider truncate">Рюрик — Наши дни</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-4 ml-2">
          <button 
            onClick={handleGoToStart} 
            className="flex flex-col items-center justify-center text-slate-600 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition"
            title="К началу"
          >
            <RotateCcw size={18} />
            <span className="text-[9px] font-bold uppercase">Сначала</span>
          </button>

          <button 
            onClick={() => setVariant(null)} 
            className="flex flex-col items-center justify-center text-slate-600 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition"
            title="Сменить режим"
          >
            <Settings2 size={18} />
            <span className="text-[9px] font-bold uppercase">Режим</span>
          </button>
          
          <button 
            onClick={handleReset} 
            className="flex flex-col items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition px-2 py-1 rounded-lg" 
            title="Сбросить прогресс"
          >
            <Trash2 size={18} />
            <span className="text-[9px] font-bold uppercase">Сброс</span>
          </button>
        </div>
      </header>

      {/* Main Board */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative">
        <div className="w-full max-w-sm mb-4 flex justify-between items-center text-sm font-medium text-slate-500">
          <span>Карточка {currentIndex + 1} из {rulersData.length}</span>
          {isLearned && <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md"><GraduationCap size={16}/> Изучено</span>}
        </div>

        {/* The Card */}
        <div className="w-full relative z-10" key={rulerId}>
          <Flashcard ruler={ruler} isDetailsFirst={isDetailsFirst} />
        </div>

        {/* Controls */}
        <div className="flex gap-4 mt-10 w-full max-w-sm">
          <button 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            className="flex-1 bg-white border border-slate-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-2xl flex justify-center items-center gap-2 transition"
          >
            <ChevronLeft size={20} /> Пред.
          </button>
          
          <button
            onClick={handleMarkLearned}
            disabled={isLearned}
            className={`flex-[1.5] shadow-md font-semibold py-3 px-4 rounded-2xl flex justify-center items-center gap-2 transition ${isLearned ? 'bg-green-50 text-green-600 border border-green-200 cursor-default shadow-none' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {isLearned ? 'Уже знаю!' : 'Запомнил'} {isLearned ? null : <Award size={20} />}
          </button>

          <button 
            onClick={handleNext} 
            disabled={currentIndex === rulersData.length - 1}
            className="flex-1 bg-white border border-slate-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-2xl flex justify-center items-center gap-2 transition"
          >
            След. <ChevronRight size={20} />
          </button>
        </div>
      </main>
      <InstallPrompt />
    </div>
  );
}

