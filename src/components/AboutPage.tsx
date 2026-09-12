import { 
  ChevronLeft, 
  Crown, 
  Calendar, 
  BookMarked, 
  Landmark, 
  GitFork, 
  GraduationCap, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  Mail, 
  Heart, 
  Check
} from 'lucide-react';
import BackToTopButton from './BackToTopButton';

interface AboutPageProps {
  onBack: () => void;
  onSelectSection?: (section: 'rulers' | 'dates' | 'terms' | 'architecture' | 'schemes' | 'quiz') => void;
}

export default function AboutPage({ onBack, onSelectSection }: AboutPageProps) {
  const sections = [
    {
      id: 'rulers' as const,
      name: 'Правители',
      icon: Crown,
      color: 'text-amber-700 bg-amber-100/80 border-amber-200/60',
      description: 'Полная хронология глав государства от Рюрика до современности. Карточки с датами правления, династиями, реформами, внешнеполитическими событиями, портретами и современниками.'
    },
    {
      id: 'dates' as const,
      name: 'Даты',
      icon: Calendar,
      color: 'text-blue-700 bg-blue-100/80 border-blue-200/60',
      description: 'Хронологическая лента всех ключевых исторических событий с разделением по эпохам, удобным поиском и функцией отметки изученного материала.'
    },
    {
      id: 'terms' as const,
      name: 'Термины',
      icon: BookMarked,
      color: 'text-emerald-700 bg-emerald-100/80 border-emerald-200/60',
      description: 'Словарь исторических терминов, понятий и правовых памятников (от древнерусских институтов до новейшей эпохи), необходимых для успешной сдачи экзаменов.'
    },
    {
      id: 'architecture' as const,
      name: 'Архитектура',
      icon: Landmark,
      color: 'text-purple-700 bg-purple-100/80 border-purple-200/60',
      description: 'Каталог памятников зодчества и скульптуры: стили (шатровый, нарышкинское барокко, классицизм, ампир), архитекторы, века постройки, города и иллюстрации для заданий по культуре.'
    },
    {
      id: 'schemes' as const,
      name: 'Схемы',
      icon: GitFork,
      color: 'text-sky-700 bg-sky-100/80 border-sky-200/60',
      description: 'Интерактивные структурные схемы государственного аппарата, сословий, битв и ключевых реформ с возможностью масштабирования и детального изучения.'
    },
    {
      id: 'quiz' as const,
      name: 'Тренажер',
      icon: GraduationCap,
      color: 'text-indigo-700 bg-indigo-100/80 border-indigo-200/60',
      description: 'Интерактивные тренировочные тесты для проверки и закрепления знаний по датам, личностям и терминологии с отслеживанием прогресса.'
    }
  ];

  return (
    <div id="about-page-container" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white shadow-xs border-b border-slate-200/80 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 cursor-pointer active:scale-95"
          aria-label="Назад к обучению"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">О приложении</h1>
          <p className="text-xs text-slate-500 font-medium">Структура разделов и возможности</p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-8 space-y-6 pb-24">
        {/* 1. Theological & Spiritual Epigraph Quote AT TOP */}
        <section id="about-quote-section" className="bg-amber-50/90 border border-amber-200/80 rounded-3xl p-5 sm:p-7 shadow-xs">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-md shadow-amber-900/10 shrink-0 border border-amber-200/90 bg-white">
              <img 
                src="icon-192.png" 
                alt="История. Подготовка" 
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="space-y-2 flex-1 min-w-0">
              <p className="text-slate-800 text-xs sm:text-sm md:text-base italic leading-relaxed font-serif">
                «В судьбах человеческих, в судьбах народов и царств действует непостижимый Промысл Божий, направляющий всё к духовному спасению и благу человека».
              </p>
              <p className="text-xs sm:text-sm text-amber-950/80 font-semibold text-right">
                — Святитель Игнатий (Брянчанинов)
              </p>
            </div>
          </div>
        </section>

        {/* 2. App Mission & Overview */}
        <section id="about-mission-section" className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/70">
          <div className="mb-3">
            <h2 className="text-xl font-bold text-slate-900">История. Подготовка</h2>
            <p className="text-xs text-slate-500 font-medium">Интерактивный помощник для подготовки к экзаменам</p>
          </div>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Приложение создано для системного освоения курса истории России, успешной сдачи экзаменов (ЕГЭ и ОГЭ) и визуального запоминания исторических закономерностей, эпох и персоналий от Древней Руси до новейшего периода.
          </p>
        </section>

        {/* 3. Sections of the App */}
        <section id="about-sections-catalog" className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/70 space-y-4">
          <div className="border-b border-slate-100 pb-3 mb-2">
            <h2 className="text-lg font-bold text-slate-900">Разделы приложения</h2>
            <p className="text-xs text-slate-500">Краткий обзор учебных материалов и возможностей</p>
          </div>

          <div className="space-y-3">
            {sections.map(sec => {
              const Icon = sec.icon;
              return (
                <div 
                  key={sec.id}
                  onClick={() => onSelectSection && onSelectSection(sec.id)}
                  className={`p-4 rounded-2xl border border-slate-200/70 bg-slate-50/60 hover:bg-blue-50/30 hover:border-blue-200 transition-all ${
                    onSelectSection ? 'cursor-pointer active:scale-[0.99]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${sec.color}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 mb-1">
                        {sec.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {sec.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Technical Features & PWA (NO Home Screen install callout) */}
        <section id="about-features-section" className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/70">
          <div className="flex items-center gap-4 mb-5">
            <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-md shadow-blue-200">
              <Zap size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Технические особенности</h2>
              <p className="text-xs text-slate-500 font-medium">Автономность и конфиденциальность</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 mb-1.5 flex items-center gap-2 text-sm sm:text-base">
                <ShieldCheck size={18} className="text-blue-600" />
                Технология PWA (Progressive Web App)
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                Приложение функционирует как автономное веб-приложение: моментально запускается в браузере, не требует загрузки из магазинов приложений и почти не занимает места в памяти смартфона или компьютера.
              </p>
            </div>

            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100">
              Весь ваш прогресс обучения, отметки изученного и закладки сохраняются локально в хранилище вашего устройства (<strong className="text-slate-800 font-semibold">IndexedDB</strong> и <strong className="text-slate-800 font-semibold">localStorage</strong>). Ваши данные остаются на 100% приватными и не передаются сторонним серверам.
            </p>

            {/* Advantages */}
            <div className="bg-blue-50/70 rounded-2xl p-5 border border-blue-100">
              <h3 className="font-bold text-blue-950 mb-3 flex items-center gap-2 text-sm">
                <Globe size={18} /> Преимущества:
              </h3>
              <ul className="space-y-2.5">
                {[
                  'Оффлайн-режим: доступ ко всем материалам без подключения к интернету.',
                  'Экономия памяти: размер приложения в десятки раз меньше нативных программ.',
                  'Мгновенная готовность: быстрый запуск на мобильных телефонах, планшетах и ПК.',
                  'Безопасность: работа по зашифрованному протоколу HTTPS.'
                ].map((text, i) => (
                  <li key={i} className="flex gap-2.5 text-xs sm:text-sm text-slate-700">
                    <div className="bg-blue-600/10 p-0.5 rounded-md h-fit mt-0.5 shrink-0">
                      <Check size={13} className="text-blue-600 stroke-[3]" />
                    </div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Limitations */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70">
              <h3 className="font-bold text-slate-700 mb-1 flex items-center gap-2 text-xs sm:text-sm">
                <Cpu size={16} /> Ограничения:
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Сохранность локального прогресса зависит от настроек браузера: при полной очистке кэша и истории браузера локально сохраненный прогресс карточек может обнулиться.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Feedback Block */}
        <section id="about-feedback-section" className="flex justify-center pt-2">
          <div className="bg-[#f5f0e6] rounded-[40px] p-6 sm:p-8 w-full max-w-xs shadow-xs border border-[#e8dfcf] flex flex-col items-center">
            <h3 className="text-[#8b1a1a] text-2xl font-serif mb-6 italic">Обратная связь</h3>
            
            <a 
              href="mailto:indievid.krd@gmail.com"
              className="bg-[#e9e3d5] hover:bg-[#e0d9c8] transition-colors w-full rounded-2xl p-4 flex items-center gap-3.5 group cursor-pointer"
            >
              <div className="text-slate-600 group-hover:scale-110 transition-transform">
                <Mail size={22} />
              </div>
              <div className="text-left">
                <div className="text-slate-700 text-base leading-tight font-medium">Написать</div>
                <div className="text-slate-700 text-base leading-tight font-medium">разработчику</div>
              </div>
            </a>

            <div className="mt-8 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-slate-400 text-2xs font-medium uppercase tracking-widest mb-1">
                <Heart size={12} className="text-red-500 fill-red-500" />
                <span>Создано нейрокомандой</span>
              </div>
              <div className="text-slate-700 text-sm font-semibold tracking-wide">
                Индивид СтудИИя
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Back to Top Floating Button */}
      <BackToTopButton threshold={150} />
    </div>
  );
}

