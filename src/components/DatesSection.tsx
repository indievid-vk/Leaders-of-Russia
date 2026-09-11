import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Search, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Bookmark, 
  ChevronRight,
  Filter,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DATES_DATA } from '../data/dates';
import { HistoryEventDate } from '../types';

interface DatesSectionProps {
  learnedSet: Set<string>;
  onToggleLearned: (id: string) => void;
  onSelectEra?: (era: string) => void;
}

export default function DatesSection({ learnedSet, onToggleLearned }: DatesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [cardIndex, setCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [filterImportance, setFilterImportance] = useState<boolean>(false);

  // Unique eras from data
  const eras = useMemo(() => {
    const list = Array.from(new Set(DATES_DATA.map(d => d.era).filter((e): e is string => Boolean(e))));
    return ['all', ...list];
  }, []);

  // Filtered dates
  const filteredDates = useMemo(() => {
    return DATES_DATA.filter(item => {
      const matchesEra = selectedEra === 'all' || item.era === selectedEra;
      const matchesImportance = !filterImportance || item.importance === 'high';
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.date.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.era.toLowerCase().includes(q) ||
        (item.ruler && item.ruler.toLowerCase().includes(q)) ||
        (item.details && item.details.toLowerCase().includes(q)) ||
        (item.egeContext && item.egeContext.toLowerCase().includes(q));

      return matchesEra && matchesImportance && matchesSearch;
    });
  }, [searchQuery, selectedEra, filterImportance]);

  const currentCard = filteredDates[cardIndex] || filteredDates[0];
  const isCurrentCardLearned = currentCard ? learnedSet.has(`date-${currentCard.id}`) : false;

  const handleNextCard = () => {
    setIsCardFlipped(false);
    if (cardIndex < filteredDates.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    setIsCardFlipped(false);
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
    } else {
      setCardIndex(Math.max(0, filteredDates.length - 1));
    }
  };

  const handleCardLearned = (id: string) => {
    onToggleLearned(`date-${id}`);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#3b82f6', '#10b981', '#f59e0b']
    });
  };

  return (
    <div id="dates-section-container" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-3 border border-white/20">
            <Calendar size={14} className="text-yellow-300" />
            <span>Хронология ЕГЭ по истории</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Ключевые даты и события Отечества
          </h2>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Полный свод дат от 862 года до новейшего времени с контекстом для экзамена, правителями и шпаргалками к заданиям первой и второй части.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-blue-200">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <Layers size={15} className="text-blue-300" />
              <span>Всего дат: {DATES_DATA.length}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>
                Изучено: {Array.from(learnedSet).filter(id => id.startsWith('date-')).length} из {DATES_DATA.length}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <Calendar size={280} />
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              id="dates-search-input"
              type="text"
              placeholder="Поиск по дате (1480, 1861), событию, правителю..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCardIndex(0);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-slate-800"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600 bg-slate-200/60 rounded-md px-1.5 py-0.5"
              >
                Очистить
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterImportance(!filterImportance)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                filterImportance 
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm' 
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70'
              }`}
              title="Показать только важнейшие даты для ЕГЭ"
            >
              <Flame size={14} className={filterImportance ? 'text-white' : 'text-amber-500'} />
              <span>Топ-даты ЕГЭ</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Хроника
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'cards' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Карточки
              </button>
            </div>
          </div>
        </div>

        {/* Era Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 shrink-0 mr-1 flex items-center gap-1 font-medium">
            <Filter size={13} /> Эпоха:
          </span>
          {eras.map(era => (
            <button
              key={era}
              onClick={() => {
                setSelectedEra(era);
                setCardIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                selectedEra === era
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {era === 'all' ? 'Все эпохи' : era}
            </button>
          ))}
        </div>
      </div>

      {/* Mode 1: Interactive Flashcards */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          {filteredDates.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <Calendar className="mx-auto text-slate-300 mb-3" size={48} />
              <p className="text-slate-600 font-medium">По вашему запросу даты не найдены</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedEra('all'); setFilterImportance(false); }}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-xs text-slate-500 font-medium mb-3">
                Карточка {cardIndex + 1} из {filteredDates.length}
              </div>

              {/* Card Container */}
              <div 
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="w-full max-w-xl min-h-[320px] bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-slate-200/80 cursor-pointer transition-all hover:border-blue-400 hover:shadow-xl relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {currentCard.era}
                    </span>
                    <div className="flex items-center gap-2">
                      {currentCard.importance === 'high' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          <Flame size={12} /> Топ ЕГЭ
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardLearned(currentCard.id);
                        }}
                        className={`p-1.5 rounded-xl border transition-all ${
                          isCurrentCardLearned 
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-emerald-600'
                        }`}
                        title={isCurrentCardLearned ? 'Изучено' : 'Отметить как изученное'}
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    </div>
                  </div>

                  {!isCardFlipped ? (
                    <div className="py-8 text-center space-y-4">
                      <div className="text-4xl sm:text-5xl font-black text-blue-600 tracking-tight">
                        {currentCard.date}
                      </div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                        Нажмите, чтобы узнать событие и детали
                      </div>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 py-2"
                    >
                      <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                        {currentCard.title}
                      </div>
                      {currentCard.ruler && (
                        <div className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-3 py-1.5 rounded-xl inline-block">
                          Правитель: {currentCard.ruler}
                        </div>
                      )}
                      {currentCard.details && (
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {currentCard.details}
                        </p>
                      )}
                      {currentCard.egeContext && (
                        <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/70 text-xs text-amber-900 leading-relaxed font-medium">
                          <strong className="block text-amber-950 font-bold mb-1">💡 Экзаменационный маркер (ЕГЭ):</strong>
                          {currentCard.egeContext}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Нажмите для переворота</span>
                  <span>{isCurrentCardLearned ? '✓ В списке выученных' : 'В процессе изучения'}</span>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handlePrevCard}
                  className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  ← Предыдущая
                </button>
                <button
                  onClick={handleNextCard}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
                >
                  Следующая →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Chronological List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-500 font-medium px-1 flex items-center justify-between">
            <span>Найдено событий: {filteredDates.length}</span>
            <span>Кликните на галочку для отметки «Изучено»</span>
          </div>

          <div className="space-y-3">
            {filteredDates.map((item, index) => {
              const isLearned = learnedSet.has(`date-${item.id}`);
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
                    isLearned 
                      ? 'border-emerald-200/80 bg-emerald-50/20' 
                      : 'border-slate-200 hover:border-blue-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 font-black text-base sm:text-lg shrink-0 text-center min-w-[75px]">
                        {item.date}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600">
                            {item.era}
                          </span>
                          {item.importance === 'high' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800">
                              <Flame size={11} /> Топ ЕГЭ
                            </span>
                          )}
                          {item.ruler && (
                            <span className="text-xs text-indigo-700 font-medium">
                              {item.ruler}
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug">
                          {item.title}
                        </h3>

                        {item.details && (
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            {item.details}
                          </p>
                        )}

                        {item.egeContext && (
                          <div className="mt-2 p-3 bg-amber-50/90 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
                            <span className="font-bold text-amber-950">💡 Важно для ЕГЭ: </span>
                            {item.egeContext}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCardLearned(item.id)}
                      className={`p-2 rounded-xl border shrink-0 transition-all cursor-pointer ${
                        isLearned 
                          ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-300'
                      }`}
                      title={isLearned ? 'Изучено (нажмите для сброса)' : 'Отметить как изученное'}
                      aria-label="Отметка изучения даты"
                    >
                      <CheckCircle2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDates.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <Calendar className="mx-auto text-slate-300 mb-3" size={48} />
              <p className="text-slate-600 font-medium">По запросу событий не найдено</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedEra('all'); setFilterImportance(false); }}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
