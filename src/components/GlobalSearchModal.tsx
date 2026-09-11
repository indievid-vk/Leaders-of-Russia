import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Crown, 
  Calendar, 
  BookMarked, 
  Landmark, 
  GitFork, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { RULERS_DATA } from '../data/rulers';
import { DATES_DATA } from '../data/dates';
import { TERMS_DATA } from '../data/terms';
import { ARCHITECTURE_DATA } from '../data/architecture';
import { ALL_SCHEMES_DATA } from '../data/allSchemes';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSection: (section: 'rulers' | 'dates' | 'terms' | 'architecture' | 'schemes', itemId?: string) => void;
}

export default function GlobalSearchModal({ isOpen, onClose, onNavigateToSection }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q || q.length < 2) return null;

    const matchedRulers = RULERS_DATA.filter(r => 
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.years && r.years.toLowerCase().includes(q)) ||
      (r.era && r.era.toLowerCase().includes(q)) ||
      (Array.isArray(r.events) && r.events.some(e => e.toLowerCase().includes(q)))
    ).slice(0, 5);

    const matchedDates = DATES_DATA.filter(d => 
      (d.date && d.date.toLowerCase().includes(q)) ||
      (d.title && d.title.toLowerCase().includes(q)) ||
      (d.era && d.era.toLowerCase().includes(q)) ||
      (d.ruler && d.ruler.toLowerCase().includes(q)) ||
      (d.details && d.details.toLowerCase().includes(q))
    ).slice(0, 5);

    const matchedTerms = TERMS_DATA.filter(t => 
      (t.term && t.term.toLowerCase().includes(q)) ||
      (t.definition && t.definition.toLowerCase().includes(q)) ||
      (t.factForEge && t.factForEge.toLowerCase().includes(q))
    ).slice(0, 5);

    const matchedArchitecture = ARCHITECTURE_DATA.filter(a => 
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.city && a.city.toLowerCase().includes(q)) ||
      (a.century && a.century.toLowerCase().includes(q)) ||
      (a.architect && a.architect.toLowerCase().includes(q)) ||
      (a.style && a.style.toLowerCase().includes(q)) ||
      (a.ruler && a.ruler.toLowerCase().includes(q)) ||
      (a.rulerEra && a.rulerEra.toLowerCase().includes(q)) ||
      (typeof a.features === 'string' && a.features.toLowerCase().includes(q)) ||
      (a.egeSignificance && a.egeSignificance.toLowerCase().includes(q))
    ).slice(0, 5);

    const matchedSchemes = ALL_SCHEMES_DATA.filter(s => 
      (s.title && s.title.toLowerCase().includes(q)) ||
      (s.number && s.number.toString() === q) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
      (s.category && s.category.toLowerCase().includes(q))
    ).slice(0, 5);

    const totalMatches = 
      matchedRulers.length + 
      matchedDates.length + 
      matchedTerms.length + 
      matchedArchitecture.length + 
      matchedSchemes.length;

    return {
      rulers: matchedRulers,
      dates: matchedDates,
      terms: matchedTerms,
      architecture: matchedArchitecture,
      schemes: matchedSchemes,
      total: totalMatches
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="global-search-modal"
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
        >
          {/* Input Header */}
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <Search size={20} className="text-slate-400 shrink-0 ml-1" />
            <input 
              autoFocus
              type="text"
              placeholder="Поиск по всему курсу ЕГЭ: даты, правители, термины, культура..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-base sm:text-lg focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Results list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {!query || query.length < 2 ? (
              <div className="text-center py-10 text-slate-400 text-sm space-y-2">
                <p className="font-medium">Введите минимум 2 символа для поиска</p>
                <p className="text-xs text-slate-400">
                  Попробуйте: <span className="text-blue-600 cursor-pointer font-medium" onClick={() => setQuery('1812')}>1812</span>,{' '}
                  <span className="text-blue-600 cursor-pointer font-medium" onClick={() => setQuery('Растрелли')}>Растрелли</span>,{' '}
                  <span className="text-blue-600 cursor-pointer font-medium" onClick={() => setQuery('вира')}>вира</span>,{' '}
                  <span className="text-blue-600 cursor-pointer font-medium" onClick={() => setQuery('Иван Грозный')}>Иван Грозный</span>
                </p>
              </div>
            ) : searchResults && searchResults.total === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                Ничего не найдено по запросу «{query}»
              </div>
            ) : searchResults && (
              <div className="space-y-4">
                {/* Rulers */}
                {searchResults.rulers.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5 px-1">
                      <Crown size={14} /> Правители ({searchResults.rulers.length})
                    </div>
                    <div className="space-y-1.5">
                      {searchResults.rulers.map(r => (
                        <div
                          key={r.id}
                          onClick={() => {
                            onNavigateToSection('rulers', r.id);
                            onClose();
                          }}
                          className="p-3 bg-slate-50 hover:bg-amber-50/70 border border-slate-200/80 hover:border-amber-200 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div>
                            <span className="font-bold text-slate-900 text-sm group-hover:text-amber-900">
                              {r.name}
                            </span>
                            <span className="text-xs text-slate-500 ml-2 font-medium">
                              ({r.years})
                            </span>
                            <div className="text-xs text-slate-400 mt-0.5">{r.era}</div>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-amber-600 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates */}
                {searchResults.dates.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5 px-1">
                      <Calendar size={14} /> Даты и события ({searchResults.dates.length})
                    </div>
                    <div className="space-y-1.5">
                      {searchResults.dates.map(d => (
                        <div
                          key={d.id}
                          onClick={() => {
                            onNavigateToSection('dates', d.id);
                            onClose();
                          }}
                          className="p-3 bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-200 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-blue-700 text-sm">
                                {d.date}
                              </span>
                              <span className="font-medium text-slate-900 text-sm group-hover:text-blue-900">
                                — {d.title}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">{d.era}</div>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Terms */}
                {searchResults.terms.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 px-1">
                      <BookMarked size={14} /> Термины ЕГЭ ({searchResults.terms.length})
                    </div>
                    <div className="space-y-1.5">
                      {searchResults.terms.map(t => (
                        <div
                          key={t.id}
                          onClick={() => {
                            onNavigateToSection('terms', t.id);
                            onClose();
                          }}
                          className="p-3 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-200 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-900">
                              {t.term}
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {t.definition}
                            </div>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Architecture */}
                {searchResults.architecture.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5 px-1">
                      <Landmark size={14} /> Архитектура и культура ({searchResults.architecture.length})
                    </div>
                    <div className="space-y-1.5">
                      {searchResults.architecture.map(a => (
                        <div
                          key={a.id}
                          onClick={() => {
                            onNavigateToSection('architecture', a.id);
                            onClose();
                          }}
                          className="p-3 bg-slate-50 hover:bg-purple-50/70 border border-slate-200/80 hover:border-purple-200 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-bold text-slate-900 text-sm group-hover:text-purple-900">
                              {a.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {a.city}, {a.century} • {a.style} {a.architect ? `• ${a.architect}` : ''}
                            </div>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-purple-600 transition-colors shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Schemes */}
                {searchResults.schemes.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5 px-1">
                      <GitFork size={14} /> Схемы управления ({searchResults.schemes.length})
                    </div>
                    <div className="space-y-1.5">
                      {searchResults.schemes.map(s => (
                        <div
                          key={s.id}
                          onClick={() => {
                            onNavigateToSection('schemes', s.id);
                            onClose();
                          }}
                          className="p-3 bg-slate-50 hover:bg-sky-50/70 border border-slate-200/80 hover:border-sky-200 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-bold text-slate-900 text-sm group-hover:text-sky-900">
                              {s.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">{s.category} • {s.era}</div>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-sky-600 transition-colors shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
            Нажмите Esc или кликните вне окна для закрытия
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
