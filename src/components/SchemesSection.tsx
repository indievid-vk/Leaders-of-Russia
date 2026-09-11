import { useState, useMemo, FormEvent } from 'react';
import { 
  GitFork, 
  Lightbulb, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ExternalLink,
  BookMarked,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_SCHEMES_DATA } from '../data/allSchemes';
import { HistoryScheme } from '../types';
import TextbookCanvasViewer from './TextbookCanvasViewer';

interface SchemesSectionProps {
  learnedSet: Set<string>;
  onToggleLearned: (id: string) => void;
}

export default function SchemesSection({ learnedSet, onToggleLearned }: SchemesSectionProps) {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(ALL_SCHEMES_DATA[0]?.id || 'scheme-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [selectedThemeNum, setSelectedThemeNum] = useState<number | 'all'>('all');
  const [jumpNumberInput, setJumpNumberInput] = useState<string>('');
  const [showInteractiveGraph, setShowInteractiveGraph] = useState<boolean>(false);

  // Eras list
  const eras = useMemo(() => {
    const list = Array.from(new Set(ALL_SCHEMES_DATA.map(s => s.era)));
    return ['all', ...list];
  }, []);

  // Themes list for dropdown
  const themesList = useMemo(() => {
    const map = new Map<number, string>();
    ALL_SCHEMES_DATA.forEach(s => {
      if (s.themeNumber && s.themeTitle) {
        map.set(s.themeNumber, s.themeTitle);
      }
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, []);

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return ALL_SCHEMES_DATA.filter(scheme => {
      const matchesEra = selectedEra === 'all' || scheme.era === selectedEra;
      const matchesTheme = selectedThemeNum === 'all' || scheme.themeNumber === selectedThemeNum;
      
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesEra && matchesTheme;

      const numQuery = q.replace(/[^\d]/g, '');
      const matchesNum = numQuery && scheme.number?.toString() === numQuery;

      const matchesSearch = 
        matchesNum ||
        scheme.title.toLowerCase().includes(q) ||
        scheme.category.toLowerCase().includes(q) ||
        scheme.description.toLowerCase().includes(q) ||
        (scheme.themeTitle && scheme.themeTitle.toLowerCase().includes(q)) ||
        (scheme.keyPoints && scheme.keyPoints.some(kp => kp.toLowerCase().includes(q)));

      return matchesEra && matchesTheme && matchesSearch;
    });
  }, [selectedEra, selectedThemeNum, searchQuery]);

  // Current active scheme
  const currentScheme: HistoryScheme = useMemo(() => {
    const found = ALL_SCHEMES_DATA.find(s => s.id === selectedSchemeId);
    if (found) return found;
    return filteredSchemes[0] || ALL_SCHEMES_DATA[0];
  }, [filteredSchemes, selectedSchemeId]);

  const isLearned = currentScheme ? learnedSet.has(currentScheme.id) : false;

  const handleToggleLearned = () => {
    if (currentScheme) {
      onToggleLearned(currentScheme.id);
      if (!isLearned) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#0284c7', '#10b981', '#f59e0b']
        });
      }
    }
  };

  const handleJumpToScheme = (e: FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpNumberInput.trim(), 10);
    if (!isNaN(num) && num >= 1 && num <= ALL_SCHEMES_DATA.length) {
      const target = ALL_SCHEMES_DATA.find(s => s.number === num);
      if (target) {
        setSelectedSchemeId(target.id);
        setJumpNumberInput('');
      }
    }
  };

  const handlePrevScheme = () => {
    const currentIdx = ALL_SCHEMES_DATA.findIndex(s => s.id === currentScheme.id);
    if (currentIdx > 0) {
      setSelectedSchemeId(ALL_SCHEMES_DATA[currentIdx - 1].id);
    }
  };

  const handleNextScheme = () => {
    const currentIdx = ALL_SCHEMES_DATA.findIndex(s => s.id === currentScheme.id);
    if (currentIdx < ALL_SCHEMES_DATA.length - 1) {
      setSelectedSchemeId(ALL_SCHEMES_DATA[currentIdx + 1].id);
    }
  };

  // When user changes page directly in canvas, sync scheme
  const handlePageChange = (page: number) => {
    const matched = ALL_SCHEMES_DATA.find(s => s.page === page);
    if (matched && matched.id !== selectedSchemeId) {
      setSelectedSchemeId(matched.id);
    }
  };

  const hasInteractiveGraph = currentScheme.layoutType && currentScheme.layoutType !== 'book-diagram';

  return (
    <div id="schemes-section-container" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Textbook Header Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-sky-800/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/20 backdrop-blur-md text-xs font-semibold text-sky-200 mb-3 border border-sky-400/30">
            <BookOpen size={14} className="text-yellow-400" />
            <span>Свод исторических схем и таблиц</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2.5">
            История России в схемах
          </h2>
          <p className="text-sky-100/90 text-sm sm:text-base leading-relaxed">
            Полный электронный свод всех <strong>282 схем</strong> по <strong>40 темам</strong> кодификатора ЕГЭ. Аутентичные книжные развороты с графическими связями, стрелками подчинения, периодами реформ и таблицами сословий.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium text-sky-200">
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <Layers size={14} className="text-sky-300" />
              <span>Всего схем: <strong className="text-white text-sm">282</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <BookMarked size={14} className="text-amber-300" />
              <span>Темы: <strong className="text-white">40 разделов</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>
                Освоено: <strong className="text-white">{Array.from(learnedSet).filter(id => id.startsWith('scheme-')).length}</strong> из 282
              </span>
            </div>
            <a 
              href="/History_schems.pdf"
              download="История_России_в_схемах.pdf"
              className="flex items-center gap-1.5 bg-sky-600/80 hover:bg-sky-600 px-3 py-1.5 rounded-xl border border-sky-400/40 text-white transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>Скачать PDF (2.3 МБ)</span>
            </a>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none text-sky-400">
          <GitFork size={300} />
        </div>
      </div>

      {/* Navigation & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск по номеру (например 79), названию, реформе, органу власти..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Quick jump to scheme number */}
          <form onSubmit={handleJumpToScheme} className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">Перейти к схеме:</span>
            <input
              type="text"
              value={jumpNumberInput}
              onChange={e => setJumpNumberInput(e.target.value)}
              placeholder="№ 1..282"
              className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-center placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Перейти
            </button>
          </form>

          {/* Theme selector dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedThemeNum}
              onChange={e => {
                const val = e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10);
                setSelectedThemeNum(val);
                if (val !== 'all') {
                  const firstOfTheme = ALL_SCHEMES_DATA.find(s => s.themeNumber === val);
                  if (firstOfTheme) setSelectedSchemeId(firstOfTheme.id);
                }
              }}
              aria-label="Фильтр по номеру темы"
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 max-w-[220px] truncate"
            >
              <option value="all">Все 40 тем учебника</option>
              {themesList.map(([num, title]) => (
                <option key={num} value={num}>
                  Тема {num}. {title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Era pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <Filter size={13} />
            <span>Эпоха:</span>
          </div>
          {eras.map(era => (
            <button
              key={era}
              onClick={() => {
                setSelectedEra(era);
                setSelectedThemeNum('all');
                if (era !== 'all') {
                  const firstOfEra = ALL_SCHEMES_DATA.find(s => s.era === era);
                  if (firstOfEra) setSelectedSchemeId(firstOfEra.id);
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                selectedEra === era
                  ? 'bg-sky-700 text-white font-semibold shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              {era === 'all' ? 'Все эпохи' : era}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Carousel of Schemes */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Каталог схем ({filteredSchemes.length} из 282):</span>
            {(selectedThemeNum !== 'all' || selectedEra !== 'all' || searchQuery) && (
              <button 
                onClick={() => {
                  setSelectedThemeNum('all');
                  setSelectedEra('all');
                  setSearchQuery('');
                }}
                className="text-3xs text-sky-600 hover:underline font-normal cursor-pointer"
              >
                сбросить фильтры
              </button>
            )}
          </div>
          <span className="text-slate-400 text-3xs font-medium hidden sm:inline">
            Кликните для открытия схемы на нужной странице
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {filteredSchemes.slice(0, 100).map(scheme => {
            const isSchemeLearned = learnedSet.has(scheme.id);
            const isSelected = scheme.id === currentScheme?.id;
            return (
              <button
                key={scheme.id}
                onClick={() => {
                  setSelectedSchemeId(scheme.id);
                  setShowInteractiveGraph(false);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-sky-900 text-white shadow-md shadow-sky-950/20 ring-2 ring-sky-600'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span className={`px-1.5 py-0.5 rounded text-3xs font-mono font-bold ${
                  isSelected ? 'bg-sky-800 text-sky-200' : 'bg-slate-200 text-slate-700'
                }`}>
                  №{scheme.number}
                </span>

                {isSchemeLearned ? (
                  <CheckCircle2 size={13} className={isSelected ? 'text-emerald-300' : 'text-emerald-600'} />
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-sky-300' : 'bg-slate-300'}`} />
                )}

                <span className="max-w-[180px] sm:max-w-[220px] truncate">{scheme.title}</span>

                {scheme.page && (
                  <span className={`text-3xs px-1.5 py-0.5 rounded ${
                    isSelected ? 'text-sky-300 bg-sky-950/60' : 'text-slate-500 bg-slate-100'
                  }`}>
                    стр. {scheme.page}
                  </span>
                )}
              </button>
            );
          })}
          {filteredSchemes.length > 100 && (
            <div className="text-xs text-slate-400 px-3 py-2 italic whitespace-nowrap shrink-0">
              Показаны первые 100 схем. Введите номер или тему в поиске для остальных схем.
            </div>
          )}
        </div>
      </div>

      {/* Main View: AUTHENTIC TEXTBOOK VIEWER */}
      {currentScheme && (
        <div className="space-y-4">
          {/* Scheme Quick Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-900 text-white">
                  Схема №{currentScheme.number} из 282
                </span>
                {currentScheme.page && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Страница в книге: {currentScheme.page}
                  </span>
                )}
                {currentScheme.themeTitle && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 truncate max-w-xs sm:max-w-md">
                    Тема {currentScheme.themeNumber}. {currentScheme.themeTitle}
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                {currentScheme.title}
              </h3>
            </div>

            {/* Scheme actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Prev / Next buttons */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={handlePrevScheme}
                  disabled={currentScheme.number === 1}
                  className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 transition-colors text-slate-700 cursor-pointer"
                  title="Предыдущая схема"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-mono font-bold px-2 text-slate-700">
                  {currentScheme.number} / 282
                </span>
                <button
                  onClick={handleNextScheme}
                  disabled={currentScheme.number === ALL_SCHEMES_DATA.length}
                  className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 transition-colors text-slate-700 cursor-pointer"
                  title="Следующая схема"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Mark as Learned */}
              <button
                onClick={handleToggleLearned}
                className={`px-3.5 py-2 rounded-xl border font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  isLearned 
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                }`}
              >
                <CheckCircle2 size={15} />
                <span>{isLearned ? 'Выучено' : 'Выучить'}</span>
              </button>

              {/* Optional interactive diagram switch if available */}
              {hasInteractiveGraph && (
                <button
                  onClick={() => setShowInteractiveGraph(!showInteractiveGraph)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    showInteractiveGraph
                      ? 'bg-indigo-600 text-white border-indigo-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
                  title="Переключить между разворотом учебника и интерактивной диаграммой"
                >
                  <Sparkles size={14} />
                  <span className="hidden sm:inline">
                    {showInteractiveGraph ? 'Разворот книги' : 'Интерактивная блок-схема'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* PRIMARY: Textbook Canvas Viewer */}
          {!showInteractiveGraph && (
            <TextbookCanvasViewer
              initialPage={currentScheme.page || 5}
              onPageChange={handlePageChange}
              schemeTitle={currentScheme.title}
              schemeNumber={currentScheme.number}
              onSwitchToInteractive={() => setShowInteractiveGraph(true)}
              hasInteractiveFallback={hasInteractiveGraph}
            />
          )}

          {/* SECONDARY: Interactive Graph for the 12 rich models if user explicitly toggled */}
          {showInteractiveGraph && currentScheme.hierarchyTree && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h4 className="font-extrabold text-base text-slate-900">
                  Интерактивная блок-схема для схемы №{currentScheme.number}
                </h4>
                <button
                  onClick={() => setShowInteractiveGraph(false)}
                  className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
                >
                  Вернуться к развороту книги
                </button>
              </div>

              {/* Hierarchy Tree */}
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-full max-w-xl bg-gradient-to-b from-sky-900 to-sky-950 text-white rounded-2xl p-5 shadow-md border-2 border-sky-700 text-center">
                    <div className="text-xs uppercase font-extrabold tracking-widest text-sky-300 mb-1">
                      {currentScheme.hierarchyTree.root.role || 'Высшая власть'}
                    </div>
                    <div className="text-lg sm:text-xl font-extrabold">
                      {currentScheme.hierarchyTree.root.title}
                    </div>
                    <div className="text-xs sm:text-sm text-sky-100/90 mt-2 leading-relaxed">
                      {currentScheme.hierarchyTree.root.desc}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                  {currentScheme.hierarchyTree.branches.map((branch, bIdx) => (
                    <div 
                      key={bIdx}
                      className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3"
                    >
                      <h5 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-2">
                        {branch.branchName}
                      </h5>
                      <div className="space-y-2.5">
                        {branch.nodes.map((n, nIdx) => (
                          <div key={nIdx} className="bg-white rounded-xl p-3 border border-slate-200 text-xs">
                            <div className="font-bold text-slate-900">{n.title}</div>
                            <div className="text-slate-600 mt-1">{n.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Exam Tip Card under the textbook page */}
          {currentScheme.examTip && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-orange-50/60 rounded-2xl border border-amber-200/90 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed flex items-start gap-3 shadow-2xs">
              <Lightbulb size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-900 font-bold mb-0.5">
                  Экзаменационный фокус для ЕГЭ по схеме №{currentScheme.number}:
                </strong>
                {currentScheme.examTip}
              </div>
            </div>
          )}

          {/* Quick links footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-2 text-slate-600">
              <BookOpen size={14} className="text-sky-600" />
              <span>Схема №{currentScheme.number} из 282 • Страница {currentScheme.page || 5}</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`/History_schems.pdf#page=${currentScheme.page || 5}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 hover:text-sky-800 font-bold flex items-center gap-1"
              >
                <ExternalLink size={13} />
                <span>Открыть в отдельной вкладке</span>
              </a>
              <a
                href="/History_schems.pdf"
                download="История_России_в_схемах.pdf"
                className="text-slate-600 hover:text-slate-800 font-semibold flex items-center gap-1"
              >
                <Download size={13} />
                <span>Скачать оригинал PDF</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
