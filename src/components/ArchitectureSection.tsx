import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark, 
  Search, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  UserCheck, 
  Sparkles, 
  Crown,
  Building2,
  X,
  ZoomIn,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ARCHITECTURE_DATA } from '../data/architecture';
import { ArchitectureMonument } from '../types';

interface ArchitectureSectionProps {
  learnedSet: Set<string>;
  onToggleLearned: (id: string) => void;
}

export default function ArchitectureSection({ learnedSet, onToggleLearned }: ArchitectureSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedCentury, setSelectedCentury] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'trainer'>('cards');
  const [trainerSubmode, setTrainerSubmode] = useState<'photo' | 'name'>('photo');
  const [trainerIndex, setTrainerIndex] = useState(0);
  const [isTrainerRevealed, setIsTrainerRevealed] = useState(false);
  const [activeLightbox, setActiveLightbox] = useState<ArchitectureMonument | null>(null);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  // Mark image as broken for graceful fallback
  const handleImageError = (id: string) => {
    setBrokenImages(prev => new Set(prev).add(id));
  };

  // Extract unique filters
  const styles = useMemo(() => {
    const list = Array.from(new Set(ARCHITECTURE_DATA.map(a => a.style).filter((s): s is string => Boolean(s))));
    return ['all', ...list];
  }, []);

  const centuries = useMemo(() => {
    const list = Array.from(new Set(ARCHITECTURE_DATA.map(a => a.century).filter((c): c is string => Boolean(c))));
    return ['all', ...list];
  }, []);

  const cities = useMemo(() => {
    const list = Array.from(new Set(ARCHITECTURE_DATA.map(a => a.city).filter((c): c is string => Boolean(c))));
    return ['all', ...list];
  }, []);

  // Filtered monuments
  const filteredMonuments = useMemo(() => {
    return ARCHITECTURE_DATA.filter(item => {
      const matchesStyle = selectedStyle === 'all' || item.style === selectedStyle;
      const matchesCentury = selectedCentury === 'all' || item.century === selectedCentury;
      const matchesCity = selectedCity === 'all' || item.city === selectedCity;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.city && item.city.toLowerCase().includes(q)) ||
        (item.century && item.century.toLowerCase().includes(q)) ||
        (item.architect && item.architect.toLowerCase().includes(q)) ||
        (item.style && item.style.toLowerCase().includes(q)) ||
        (item.ruler && item.ruler.toLowerCase().includes(q)) ||
        (item.rulerEra && item.rulerEra.toLowerCase().includes(q)) ||
        (typeof item.features === 'string' && item.features.toLowerCase().includes(q)) ||
        (item.egeSignificance && item.egeSignificance.toLowerCase().includes(q)) ||
        (Array.isArray(item.keyFacts) && item.keyFacts.some(f => f.toLowerCase().includes(q)));

      return matchesStyle && matchesCentury && matchesCity && matchesSearch;
    });
  }, [searchQuery, selectedStyle, selectedCentury, selectedCity]);

  const currentTrainerItem = filteredMonuments[trainerIndex] || filteredMonuments[0];
  const isTrainerLearned = currentTrainerItem ? learnedSet.has(`arch-${currentTrainerItem.id}`) : false;

  const handleToggleMonument = (id: string) => {
    onToggleLearned(`arch-${id}`);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#8b5cf6', '#ec4899', '#f59e0b']
    });
  };

  const nextTrainerItem = () => {
    setIsTrainerRevealed(false);
    if (trainerIndex < filteredMonuments.length - 1) {
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
      setTrainerIndex(Math.max(0, filteredMonuments.length - 1));
    }
  };

  return (
    <div id="architecture-section-container" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-purple-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-purple-200 mb-3 border border-white/20">
            <Landmark size={14} className="text-amber-300" />
            <span>Культура и зодчество (Задания 15–16 ЕГЭ)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Архитектура России: Полный иллюстрированный каталог
          </h2>
          <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
            Все памятники зодчества для ЕГЭ от Древней Руси до СССР с реальными фотографиями, авторами, стилями, маркерами экзамена и тренажёром распознавания по изображению.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium text-purple-200">
            <div className="flex items-center gap-1.5 bg-black/35 px-3 py-1.5 rounded-xl border border-white/10">
              <Building2 size={15} className="text-purple-300" />
              <span>Всего памятников: <strong className="text-white">{ARCHITECTURE_DATA.length}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/35 px-3 py-1.5 rounded-xl border border-white/10">
              <ImageIcon size={15} className="text-amber-300" />
              <span>С фотографиями: <strong className="text-white">{ARCHITECTURE_DATA.filter(a => a.imageUrl).length}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/35 px-3 py-1.5 rounded-xl border border-white/10">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>
                Изучено: <strong className="text-white">{Array.from(learnedSet).filter(id => id.startsWith('arch-')).length}</strong> из {ARCHITECTURE_DATA.length}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <Landmark size={280} />
        </div>
      </div>

      {/* Search & Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              id="architecture-search-input"
              type="text"
              placeholder="Поиск по названию, архитектору (Растрелли, Казаков, Тон, Мельников), веку, стилю..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setTrainerIndex(0);
              }}
              className="w-full pl-10 pr-20 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all text-slate-800"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-200/70 rounded-md px-2 py-0.5 cursor-pointer"
              >
                Очистить
              </button>
            )}
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Каталог с фото ({filteredMonuments.length})
            </button>
            <button
              onClick={() => setViewMode('trainer')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'trainer' 
                  ? 'bg-white text-purple-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Тренажер ЕГЭ 15–16
            </button>
          </div>
        </div>

        {/* Century Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 shrink-0 mr-1 flex items-center gap-1 font-medium">
            <Clock size={13} /> Эпоха / Век:
          </span>
          {centuries.map(century => (
            <button
              key={century}
              onClick={() => {
                setSelectedCentury(century);
                setTrainerIndex(0);
              }}
              className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                selectedCentury === century
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {century === 'all' ? 'Все века' : century}
            </button>
          ))}
        </div>

        {/* Style Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 shrink-0 mr-1 flex items-center gap-1 font-medium">
            <Sparkles size={13} /> Стиль:
          </span>
          {styles.map(style => (
            <button
              key={style}
              onClick={() => {
                setSelectedStyle(style);
                setTrainerIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                selectedStyle === style
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {style === 'all' ? 'Все стили' : style}
            </button>
          ))}
        </div>

        {/* City Filter */}
        {cities.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-slate-400 shrink-0 mr-1 flex items-center gap-1 font-medium">
              <MapPin size={13} /> Город:
            </span>
            {cities.slice(0, 10).map(city => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  setTrainerIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  selectedCity === city
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {city === 'all' ? 'Все города' : city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MODE 1: TRAINER FOR EGE TASKS 15-16 */}
      {viewMode === 'trainer' && (
        <div className="flex flex-col items-center space-y-5">
          {/* Submode switcher: Recognize by photo vs by name */}
          <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                setTrainerSubmode('photo');
                setIsTrainerRevealed(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                trainerSubmode === 'photo'
                  ? 'bg-white text-purple-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon size={14} className="text-purple-600" />
              <span>По фотографии (Формат ЕГЭ 15–16)</span>
            </button>
            <button
              onClick={() => {
                setTrainerSubmode('name');
                setIsTrainerRevealed(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                trainerSubmode === 'name'
                  ? 'bg-white text-purple-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Landmark size={14} className="text-purple-600" />
              <span>По названию памятника</span>
            </button>
          </div>

          {filteredMonuments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 w-full max-w-xl">
              <Landmark className="mx-auto text-slate-300 mb-3" size={48} />
              <p className="text-slate-600 font-medium">Памятники по выбранным фильтрам не найдены</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCentury('all'); setSelectedStyle('all'); setSelectedCity('all'); }}
                className="mt-3 text-sm text-purple-600 hover:underline cursor-pointer"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between w-full max-w-xl text-xs text-slate-500 font-medium px-2">
                <span>Памятник {trainerIndex + 1} из {filteredMonuments.length}</span>
                <span>{isTrainerLearned ? '✓ В выученных' : 'В процессе'}</span>
              </div>

              {/* Main Interactive Flashcard */}
              <div 
                onClick={() => setIsTrainerRevealed(!isTrainerRevealed)}
                className="w-full max-w-xl bg-white rounded-3xl shadow-xl border-2 border-purple-100 hover:border-purple-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                {/* Photo Display if available */}
                {currentTrainerItem.imageUrl && !brokenImages.has(currentTrainerItem.id) ? (
                  <div className="relative w-full h-64 sm:h-72 bg-slate-900 overflow-hidden group">
                    <img 
                      src={currentTrainerItem.imageUrl}
                      alt={trainerSubmode === 'photo' && !isTrainerRevealed ? 'Архитектурный памятник' : currentTrainerItem.name}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(currentTrainerItem.id)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    
                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {currentTrainerItem.unesco && (
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
                          <Award size={12} /> ЮНЕСКО
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
                        <MapPin size={11} /> {currentTrainerItem.city}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMonument(currentTrainerItem.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                        isTrainerLearned 
                          ? 'bg-emerald-500 border-emerald-400 text-white shadow-md' 
                          : 'bg-black/50 border-white/20 text-white/80 hover:text-white hover:bg-black/70'
                      }`}
                      title={isTrainerLearned ? 'Изучено' : 'Отметить как изученное'}
                    >
                      <CheckCircle2 size={20} />
                    </button>

                    {trainerSubmode === 'photo' && !isTrainerRevealed && (
                      <div className="absolute bottom-3 left-4 right-4 text-white text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-purple-600/90 text-xs font-bold backdrop-blur-md mb-1 shadow-sm">
                          Вопрос ЕГЭ 15–16
                        </span>
                        <p className="text-sm font-semibold text-white/95 drop-shadow-md">
                          Какой памятник изображён? Назовите архитектора и стиль.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 bg-purple-50/50 border-b border-purple-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                        {currentTrainerItem.city}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {currentTrainerItem.century}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMonument(currentTrainerItem.id);
                      }}
                      className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                        isTrainerLearned 
                          ? 'bg-emerald-500 text-white border-emerald-600' 
                          : 'bg-white border-slate-200 text-slate-400 hover:text-emerald-600'
                      }`}
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6 sm:p-7 space-y-4">
                  {/* In 'name' submode or if revealed in 'photo' submode, show title */}
                  {(trainerSubmode === 'name' || isTrainerRevealed) ? (
                    <div>
                      <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block mb-1">
                        Название памятника
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 leading-snug">
                        {currentTrainerItem.name}
                      </h3>
                    </div>
                  ) : null}

                  {!isTrainerRevealed ? (
                    <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500">
                      <p className="font-semibold text-sm text-slate-700">
                        {trainerSubmode === 'photo' 
                          ? 'Узнали этот собор или дворец по фото?' 
                          : 'Вспомните архитектора, стиль и эпоху правления'}
                      </p>
                      <p className="text-xs text-purple-600 mt-2 font-medium">
                        Нажмите на карточку, чтобы проверить себя
                      </p>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 pt-2"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-3 bg-purple-50/80 rounded-xl border border-purple-100">
                          <span className="font-bold text-purple-900 block">Архитектурный стиль:</span>
                          <span className="text-slate-800 font-semibold">{currentTrainerItem.style}</span>
                        </div>
                        <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-100">
                          <span className="font-bold text-indigo-900 block">Архитектор / зодчий:</span>
                          <span className="text-slate-800 font-semibold">{currentTrainerItem.architect || 'Неизвестен / народные мастера'}</span>
                        </div>
                        <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-100">
                          <span className="font-bold text-amber-900 block">Правитель / Эпоха:</span>
                          <span className="text-slate-800 font-semibold">{currentTrainerItem.ruler || currentTrainerItem.rulerEra || '—'}</span>
                        </div>
                        <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-800 block">Период постройки:</span>
                          <span className="text-slate-800 font-semibold">{currentTrainerItem.exactYears || currentTrainerItem.century}</span>
                        </div>
                      </div>

                      {/* Features description */}
                      {currentTrainerItem.features && (
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                          <span className="font-bold text-slate-900 block mb-1">Особенности и детали:</span>
                          {typeof currentTrainerItem.features === 'string' 
                            ? currentTrainerItem.features 
                            : currentTrainerItem.features.join(' ')}
                        </div>
                      )}

                      {/* Exam marker clue */}
                      {(currentTrainerItem.egeSignificance || currentTrainerItem.examClues) && (
                        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium leading-relaxed">
                          <span className="font-bold text-amber-900">💡 Маркер ЕГЭ (вопросы 15–16): </span>
                          {currentTrainerItem.egeSignificance || currentTrainerItem.examClues}
                        </div>
                      )}
                    </motion.div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Кликните для {isTrainerRevealed ? 'скрытия' : 'открытия'} ответа</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLightbox(currentTrainerItem);
                      }}
                      className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <ZoomIn size={13} /> Фото во весь экран
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prevTrainerItem}
                  className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <ChevronLeft size={16} /> Назад
                </button>
                <button
                  onClick={nextTrainerItem}
                  className="px-6 py-2.5 rounded-xl bg-purple-700 text-white font-semibold text-sm hover:bg-purple-800 shadow-md shadow-purple-200 transition-all flex items-center gap-1 cursor-pointer"
                >
                  Следующий памятник <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* MODE 2: FULL ILLUSTRATED CARDS CATALOG */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Найдено памятников: <strong>{filteredMonuments.length}</strong></span>
            <span>Нажмите на фото для просмотра в высоком разрешении</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMonuments.map(item => {
              const isLearned = learnedSet.has(`arch-${item.id}`);
              const hasBrokenImage = brokenImages.has(item.id);
              const hasPhoto = Boolean(item.imageUrl) && !hasBrokenImage;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-lg ${
                    isLearned 
                      ? 'border-emerald-300 ring-1 ring-emerald-200' 
                      : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div>
                    {/* Monument Photo */}
                    <div 
                      onClick={() => hasPhoto && setActiveLightbox(item)}
                      className={`relative w-full h-52 overflow-hidden ${hasPhoto ? 'cursor-pointer group' : 'bg-slate-100 flex items-center justify-center'}`}
                    >
                      {hasPhoto ? (
                        <>
                          <img 
                            src={item.imageUrl}
                            alt={item.name}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={() => handleImageError(item.id)}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20 group-hover:from-black/75 transition-colors" />
                          
                          {/* Hover Zoom Hint */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                            <span className="px-3 py-1.5 rounded-xl bg-black/70 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                              <ZoomIn size={14} /> Увеличить фото
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-slate-300 flex flex-col items-center">
                          <Landmark size={48} className="stroke-[1.5]" />
                          <span className="text-[11px] text-slate-400 mt-1 font-medium">Памятник зодчества</span>
                        </div>
                      )}

                      {/* Badges on image */}
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
                        {item.unesco && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-0.5">
                            <Award size={10} /> ЮНЕСКО
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-md text-white">
                          {item.century}
                        </span>
                      </div>

                      {/* Toggle Learned Checkbox */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleMonument(item.id);
                        }}
                        className={`absolute top-2.5 right-2.5 p-1.5 rounded-xl border transition-all cursor-pointer backdrop-blur-md ${
                          isLearned 
                            ? 'bg-emerald-500 border-emerald-400 text-white shadow-md' 
                            : 'bg-black/50 border-white/30 text-white/90 hover:bg-black/70 hover:text-white'
                        }`}
                        title={isLearned ? 'Изучено' : 'Отметить как изученное'}
                      >
                        <CheckCircle2 size={16} />
                      </button>

                      {/* City pill at bottom of image */}
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[11px] font-semibold text-white/90 drop-shadow-md">
                        <MapPin size={12} className="text-purple-300" />
                        <span>{item.city}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800">
                          {item.style}
                        </span>
                        {item.exactYears && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            {item.exactYears}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {item.name}
                      </h3>

                      {/* Meta: Architect & Ruler */}
                      <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
                        {item.architect && (
                          <div className="flex items-start gap-1.5">
                            <UserCheck size={13} className="text-purple-600 shrink-0 mt-0.5" />
                            <span>Зодчий: <strong className="text-slate-800 font-semibold">{item.architect}</strong></span>
                          </div>
                        )}
                        {(item.ruler || item.rulerEra) && (
                          <div className="flex items-start gap-1.5">
                            <Crown size={13} className="text-amber-600 shrink-0 mt-0.5" />
                            <span>При ком: <span className="text-slate-800 font-medium">{item.ruler || item.rulerEra}</span></span>
                          </div>
                        )}
                      </div>

                      {/* Description / Features */}
                      {item.features && (
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {typeof item.features === 'string' ? item.features : item.features.join(' ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Exam marker footer */}
                  <div className="p-3 bg-amber-50/80 border-t border-amber-200/70 text-[11px] text-amber-950 font-medium leading-tight">
                    <span className="font-bold text-amber-900">💡 Маркер ЕГЭ: </span>
                    {item.egeSignificance || item.examClues || 'Вопрос на соотнесение в блоке «Культура».'}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMonuments.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <Landmark className="mx-auto text-slate-300 mb-3" size={48} />
              <p className="text-slate-600 font-medium">Памятники по выбранным фильтрам не найдены</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCentury('all'); setSelectedStyle('all'); setSelectedCity('all'); }}
                className="mt-3 text-sm text-purple-600 hover:underline cursor-pointer"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      )}

      {/* LIGHTBOX MODAL FOR FULL-RES PHOTO VIEW */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightbox(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/20 rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl text-white"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {activeLightbox.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                    <span>{activeLightbox.city}</span>
                    <span>•</span>
                    <span>{activeLightbox.century} ({activeLightbox.exactYears})</span>
                    <span>•</span>
                    <span className="text-purple-300 font-semibold">{activeLightbox.style}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveLightbox(null)}
                  className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Large Image */}
              <div className="flex-1 overflow-y-auto bg-black flex items-center justify-center p-2 sm:p-4 min-h-[300px]">
                {activeLightbox.imageUrl ? (
                  <img
                    src={activeLightbox.imageUrl}
                    alt={activeLightbox.name}
                    referrerPolicy="no-referrer"
                    className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-lg"
                  />
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <Landmark size={64} className="mx-auto mb-2 opacity-50" />
                    <p>Изображение отсутствует</p>
                  </div>
                )}
              </div>

              {/* Footer Details */}
              <div className="p-4 sm:p-5 bg-slate-950 border-t border-white/10 space-y-2 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Архитектор:</span>
                    <span className="text-white font-semibold">{activeLightbox.architect || 'Неизвестен'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Правитель:</span>
                    <span className="text-white font-semibold">{activeLightbox.ruler || activeLightbox.rulerEra || '—'}</span>
                  </div>
                </div>

                {activeLightbox.egeSignificance && (
                  <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-200 text-xs">
                    <strong className="text-amber-300">Маркер ЕГЭ: </strong>
                    {activeLightbox.egeSignificance}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
