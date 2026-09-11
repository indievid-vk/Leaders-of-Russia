import { 
  Crown, 
  Calendar, 
  BookMarked, 
  Landmark, 
  GitFork, 
  GraduationCap, 
  Search, 
  Info,
  Sparkles
} from 'lucide-react';

export type ActiveSection = 'rulers' | 'dates' | 'terms' | 'architecture' | 'schemes' | 'quiz';

interface NavigationProps {
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
  onOpenSearch: () => void;
  onOpenAbout: () => void;
  learnedCounts: {
    rulers: number;
    dates: number;
    terms: number;
    architecture: number;
    schemes?: number;
  };
}

export default function Navigation({
  activeSection,
  onSelectSection,
  onOpenSearch,
  onOpenAbout,
  learnedCounts
}: NavigationProps) {
  const navItems = [
    {
      id: 'rulers' as ActiveSection,
      label: 'Правители',
      icon: Crown,
      color: 'text-amber-600',
      activeBg: 'bg-amber-500 text-white shadow-sm shadow-amber-200',
      count: learnedCounts.rulers
    },
    {
      id: 'dates' as ActiveSection,
      label: 'Даты',
      icon: Calendar,
      color: 'text-blue-600',
      activeBg: 'bg-blue-600 text-white shadow-sm shadow-blue-200',
      count: learnedCounts.dates
    },
    {
      id: 'terms' as ActiveSection,
      label: 'Термины',
      icon: BookMarked,
      color: 'text-emerald-600',
      activeBg: 'bg-emerald-600 text-white shadow-sm shadow-emerald-200',
      count: learnedCounts.terms
    },
    {
      id: 'architecture' as ActiveSection,
      label: 'Архитектура',
      icon: Landmark,
      color: 'text-purple-600',
      activeBg: 'bg-purple-600 text-white shadow-sm shadow-purple-200',
      count: learnedCounts.architecture
    },
    {
      id: 'schemes' as ActiveSection,
      label: 'Схемы',
      icon: GitFork,
      color: 'text-sky-600',
      activeBg: 'bg-sky-600 text-white shadow-sm shadow-sky-200',
      count: learnedCounts.schemes
    },
    {
      id: 'quiz' as ActiveSection,
      label: 'Тренажер',
      icon: GraduationCap,
      color: 'text-indigo-600',
      activeBg: 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
    }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo & title */}
          <div 
            onClick={() => onSelectSection('rulers')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-slate-200 group-hover:scale-105 transition-transform shrink-0 border border-slate-200/80 bg-white">
              <img 
                src="icon-192.png" 
                alt="История. Подготовка" 
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
                  История. Подготовка
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 hidden sm:inline-block">
                  ЕГЭ 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Помощник подготовки к экзамену по истории
              </p>
            </div>
          </div>

          {/* Actions: Search & About */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 rounded-2xl text-xs font-semibold transition-all cursor-pointer active:scale-95"
              title="Поиск по курсу ЕГЭ (Ctrl+K)"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Быстрый поиск</span>
            </button>

            <button
              onClick={onOpenAbout}
              className="p-2.5 bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-2xl transition-all cursor-pointer active:scale-95 flex items-center justify-center"
              title="О приложении"
              aria-label="О приложении"
            >
              <Info size={18} className="stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
          {navItems.map(item => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? item.activeBg
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : item.color} />
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-3xs font-bold font-mono ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-200/80 text-slate-700'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
