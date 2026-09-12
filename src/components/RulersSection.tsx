import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Crown, 
  Calendar, 
  User, 
  Shuffle, 
  LayoutGrid, 
  Award, 
  CheckCircle2, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Flame,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Flashcard, { RulerData } from './Flashcard';
import Timeline from './Timeline';
import HorizontalScroll from './HorizontalScroll';
import { RULERS_DATA } from '../data/rulers';

type StudyVariant = 'nameFirst' | 'detailsFirst' | 'mixed';

interface RulersSectionProps {
  learnedSet: Set<string>;
  onToggleLearned: (id: string) => void;
  onResetProgress: () => void;
  onOpenAbout: () => void;
}

export default function RulersSection({
  learnedSet,
  onToggleLearned,
  onResetProgress,
  onOpenAbout
}: RulersSectionProps) {
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [showTimeline, setShowTimeline] = useState(false);
  const [variant, setVariant] = useState<StudyVariant | null>(() => {
    return (localStorage.getItem('studyVariant') as StudyVariant) || 'nameFirst';
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extract eras
  const eras = useMemo(() => {
    const list = Array.from(new Set(RULERS_DATA.map(r => r.era).filter((e): e is string => Boolean(e))));
    return ['all', ...list];
  }, []);

  // Filtered rulers by selected era
  const activeRulers = useMemo(() => {
    if (selectedEra === 'all') return RULERS_DATA;
    return RULERS_DATA.filter(r => r.era === selectedEra);
  }, [selectedEra]);

  const currentRuler = activeRulers[currentIndex] || activeRulers[0];
  const rulerId = currentRuler ? `${currentRuler.era}-${currentRuler.name}` : '';
  const isLearned = learnedSet.has(rulerId) || learnedSet.has(`ruler-${rulerId}`);

  // Determine if card shows details first
  const isDetailsFirst = useMemo(() => {
    if (variant === 'detailsFirst') return true;
    if (variant === 'mixed') {
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
    if (currentIndex < activeRulers.length - 1) {
      setCurrentIndex(curr => curr + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
    } else {
      setCurrentIndex(Math.max(0, activeRulers.length - 1));
    }
  };

  const handleMarkLearned = () => {
    if (!currentRuler) return;
    onToggleLearned(rulerId);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#3b82f6', '#10b981']
    });
    // Move to next card after brief delay if not yet learned
    if (!isLearned) {
      setTimeout(handleNext, 600);
    }
  };

  const setStudyMode = (mode: StudyVariant) => {
    setVariant(mode);
    localStorage.setItem('studyVariant', mode);
  };

  // If user opened Timeline
  if (showTimeline) {
    return (
      <Timeline
        rulers={activeRulers as any}
        onBack={() => setShowTimeline(false)}
        onShowAbout={onOpenAbout}
      />
    );
  }

  return (
    <div id="rulers-section-container" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-amber-200 mb-3 border border-white/20">
            <Crown size={14} className="text-yellow-300" />
            <span>Раздел «Правители России»</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Хронология и карточки правителей
          </h2>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
            От Рюрика и Олега Вещего до Новейшего времени. Учите годы правления, титулы, ключевые исторические события и реформы.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-amber-200">
            <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl">
              <Crown size={15} className="text-amber-300" />
              <span>Правителей: {RULERS_DATA.length}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>
                Изучено: {Array.from(learnedSet).filter(id => !id.startsWith('date-') && !id.startsWith('term-') && !id.startsWith('arch-') && !id.startsWith('scheme-')).length} из {RULERS_DATA.length}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <Crown size={280} />
        </div>
      </div>

      {/* Control Bar: Mode selection, Timeline button, Era chips */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Study Mode Selector */}
          <div className="grid grid-cols-3 sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setStudyMode('nameFirst')}
              className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                variant === 'nameFirst'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User size={13} />
              <span>Имя сначала</span>
            </button>
            <button
              onClick={() => setStudyMode('detailsFirst')}
              className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                variant === 'detailsFirst'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar size={13} />
              <span>Детали сначала</span>
            </button>
            <button
              onClick={() => setStudyMode('mixed')}
              className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                variant === 'mixed'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shuffle size={13} />
              <span>Микс</span>
            </button>
          </div>

          {/* Timeline switch button */}
          <button
            onClick={() => setShowTimeline(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100/70 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <LayoutGrid size={15} />
            <span>Вся хронология списком</span>
          </button>
        </div>

        {/* Era Filters */}
        <HorizontalScroll 
          className="pt-1 border-t border-slate-100"
          contentClassName="flex items-center gap-1.5 pb-1 text-xs"
        >
          <span className="text-slate-400 shrink-0 mr-1 flex items-center gap-1 font-medium">
            <Filter size={13} /> Эпоха:
          </span>
          {eras.map(era => (
            <button
              key={era}
              onClick={() => {
                setSelectedEra(era);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                selectedEra === era
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {era === 'all' ? 'Все правители' : era}
            </button>
          ))}
        </HorizontalScroll>
      </div>

      {/* Flashcard Area */}
      {currentRuler ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xs text-slate-500 font-medium">
            Правитель {currentIndex + 1} из {activeRulers.length}
          </div>

          {/* Flashcard */}
          <Flashcard ruler={currentRuler as any} isDetailsFirst={isDetailsFirst} />

          {/* Controls Bar below card */}
          <div className="w-full max-w-sm flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 transition-all active:scale-95 shadow-xs"
              aria-label="Предыдущий правитель"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={handleMarkLearned}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                isLearned
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-200'
              }`}
            >
              <CheckCircle2 size={18} />
              <span>{isLearned ? 'Выучено!' : 'Знаю правителя'}</span>
            </button>

            <button
              onClick={handleNext}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 transition-all active:scale-95 shadow-xs"
              aria-label="Следующий правитель"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCurrentIndex(0)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
            >
              В начало списка
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
