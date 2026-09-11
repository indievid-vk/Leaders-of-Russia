import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookMarked, 
  Search, 
  CheckCircle2, 
  Filter, 
  Sparkles, 
  HelpCircle, 
  Tag, 
  AlertTriangle,
  Lightbulb,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TERMS_DATA } from '../data/terms';
import { HistoryTerm } from '../types';

interface TermsSectionProps {
  learnedSet: Set<string>;
  onToggleLearned: (id: string) => void;
}

export default function TermsSection({ learnedSet, onToggleLearned }: TermsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'dictionary' | 'trainer'>('dictionary');
  const [trainerIndex, setTrainerIndex] = useState(0);
  const [isTrainerRevealed, setIsTrainerRevealed] = useState(false);

  // Extract unique eras and categories
  const eras = useMemo(() => {
    const list = Array.from(new Set(TERMS_DATA.map(t => t.era).filter((e): e is string => Boolean(e))));
    return ['all', ...list];
  }, []);

  const categories = useMemo(() => {
    const list = Array.from(new Set(TERMS_DATA.map(t => t.category).filter((c): c is string => Boolean(c))));
    return ['all', ...list];
  }, []);

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return TERMS_DATA.filter(t => {
      const matchesEra = selectedEra === 'all' || t.era === selectedEra;
      const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        (t.factForEge && t.factForEge.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q));

      return matchesEra && matchesCat && matchesSearch;
    });
  }, [searchQuery, selectedEra, selectedCategory]);

  const currentTrainerItem = filteredTerms[trainerIndex] || filteredTerms[0];
  const isTrainerLearned = currentTrainerItem ? learnedSet.has(`term-${currentTrainerItem.id}`) : false;

  const handleToggleTerm = (id: string) => {
    onToggleLearned(`term-${id}`);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#10b981', '#f59e0b']
    });
  };

  const nextTrainerItem = () => {
    setIsTrainerRevealed(false);
    if (trainerIndex < filteredTerms.length - 1) {
      setTrainerIndex(trainerIndex + 1);
    } else {
      setTrainerIndex(0);
    }
  };

  const prevTrainerItem = () => {
    setIsTrainerRevealed(false);
    if (trainerIndex > 0) {
      setTrainerIndex(trainerIndex - 1);
    } else {
      setTrainerIndex(Math.max(0, filteredTerms.length - 1));
    }
  };

  return (
    <div id="terms-section-container" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-emerald-100 mb-3 border border-white/20">
            <BookMarked size={14} className="text-emerald-300" />
            <span>Задание №19 ЕГЭ по истории</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Словарь исторических понятий и фактов
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Каждый термин содержит строгое научное определение и <strong>готовый исторический факт</strong>, соответствующий критериям оценивания ФИПИ для 19-го задания ЕГЭ.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-200">
            <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl">
              <FileText size={15} className="text-emerald-300" />
              <span>Терминов в базе: {TERMS_DATA.length}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-xl">
              <CheckCircle2 size={15} className="text-emerald-300" />
              <span>
                Освоено: {Array.from(learnedSet).filter(id => id.startsWith('term-')).length} из {TERMS_DATA.length}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <BookMarked size={280} />
        </div>
      </div>

      {/* Filter and Mode Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              id="terms-search-input"
              type="text"
              placeholder="Поиск термина (вира, барщина, бироновщина, приватизация)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setTrainerIndex(0);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-slate-800"
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

          {/* Toggle dictionary vs trainer */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('dictionary')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'dictionary' 
                  ? 'bg-white text-emerald-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Словарь
            </button>
            <button
              onClick={() => setViewMode('trainer')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'trainer' 
                  ? 'bg-white text-emerald-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Тренажер 19
            </button>
          </div>
        </div>

        {/* Category & Era filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar w-full">
            <span className="text-slate-400 shrink-0 mr-1 flex items-center gap-1 font-medium">
              <Tag size={13} /> Сфера:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setTrainerIndex(0);
                }}
                className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {cat === 'all' ? 'Все категории' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 shrink-0 mr-1 flex items-center gap-1 font-medium">
            <Filter size={13} /> Эпоха:
          </span>
          {eras.map(era => (
            <button
              key={era}
              onClick={() => {
                setSelectedEra(era);
                setTrainerIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                selectedEra === era
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {era === 'all' ? 'Все эпохи' : era}
            </button>
          ))}
        </div>
      </div>

      {/* Mode 1: Trainer for Task 19 */}
      {viewMode === 'trainer' && (
        <div className="flex flex-col items-center space-y-4">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 w-full">
              <BookMarked className="mx-auto text-slate-300 mb-3" size={48} />
              <p className="text-slate-600 font-medium">Термины не найдены</p>
            </div>
          ) : (
            <>
              <div className="text-xs text-slate-500 font-medium">
                Термин {trainerIndex + 1} из {filteredTerms.length}
              </div>

              <div 
                onClick={() => setIsTrainerRevealed(!isTrainerRevealed)}
                className="w-full max-w-xl min-h-[340px] bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-emerald-100/80 cursor-pointer hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {currentTrainerItem.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {currentTrainerItem.era}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTerm(currentTrainerItem.id);
                      }}
                      className={`p-1.5 rounded-xl border transition-all ${
                        isTrainerLearned 
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-700' 
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-emerald-600'
                      }`}
                      title={isTrainerLearned ? 'Изучено' : 'Отметить как изученное'}
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  </div>

                  <div className="text-center my-6">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">
                      Исторический термин
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900">
                      {currentTrainerItem.term}
                    </h3>
                  </div>

                  {!isTrainerRevealed ? (
                    <div className="text-center py-6 text-slate-400 text-sm">
                      <p className="font-medium">Вспомните определение и исторический факт для задания 19</p>
                      <p className="text-xs text-slate-400 mt-2">Нажмите на карточку, чтобы проверить себя</p>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pt-2"
                    >
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <strong className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                          1. Определение понятия:
                        </strong>
                        <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
                          {currentTrainerItem.definition}
                        </p>
                      </div>

                      {currentTrainerItem.factForEge && (
                        <div className="p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200">
                          <strong className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
                            <Lightbulb size={14} /> 2. Факт для ЕГЭ (Задание 19):
                          </strong>
                          <p className="text-emerald-950 text-xs sm:text-sm leading-relaxed font-medium">
                            {currentTrainerItem.factForEge}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Кликните для открытия/скрытия ответа</span>
                  <span>{isTrainerLearned ? '✓ В списке выученных' : 'В процессе изучения'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={prevTrainerItem}
                  className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  ← Предыдущий
                </button>
                <button
                  onClick={nextTrainerItem}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 shadow-md shadow-emerald-200 transition-all"
                >
                  Следующий →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Mode 2: Dictionary List */}
      {viewMode === 'dictionary' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-500 font-medium px-1 flex items-center justify-between">
            <span>Найдено терминов: {filteredTerms.length}</span>
            <span>Кликните на галочку для отметки «Изучено»</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredTerms.map(item => {
              const isLearned = learnedSet.has(`term-${item.id}`);
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-5 border transition-all ${
                    isLearned 
                      ? 'border-emerald-300 bg-emerald-50/20' 
                      : 'border-slate-200 hover:border-emerald-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          {item.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                          {item.era}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                        {item.term}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleToggleTerm(item.id)}
                      className={`p-2 rounded-xl border shrink-0 transition-all cursor-pointer ${
                        isLearned 
                          ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-300'
                      }`}
                      title={isLearned ? 'Изучено (клик для сброса)' : 'Отметить как изученное'}
                      aria-label="Отметка изучения термина"
                    >
                      <CheckCircle2 size={20} />
                    </button>
                  </div>

                  {/* Definition */}
                  <div className="space-y-3 text-slate-700 text-sm">
                    <p className="leading-relaxed">
                      {item.definition}
                    </p>

                    {/* Task 19 Fact Box */}
                    {item.factForEge && (
                      <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200/90 text-xs text-emerald-950 font-medium leading-relaxed">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-900 mb-1">
                          <Lightbulb size={13} className="text-emerald-700" />
                          <span>Исторический факт для Задания 19 ЕГЭ:</span>
                        </div>
                        {item.factForEge}
                      </div>
                    )}

                    {item.examWarning && (
                      <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-600" />
                        <span>{item.examWarning}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <BookMarked className="mx-auto text-slate-300 mb-3" size={48} />
              <p className="text-slate-600 font-medium">По заданным критериям термины не найдены</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedEra('all'); setSelectedCategory('all'); }}
                className="mt-3 text-sm text-emerald-600 hover:underline"
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
