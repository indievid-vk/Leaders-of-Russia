import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Info, 
  Zap, 
  Globe, 
  Cpu, 
  Mail, 
  Heart, 
  Download, 
  Check, 
  ShieldCheck, 
  BookOpen, 
  Quote
} from 'lucide-react';
import BackToTopButton from './BackToTopButton';

interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div id="about-page-container" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 cursor-pointer active:scale-95"
          aria-label="Назад к обучению"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">О приложении</h1>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Технологии и миссия</p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-8 space-y-8 pb-24">
        {/* Section 1: About App */}
        <section id="about-mission-section" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100">
              <BookOpen size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">О приложении</h2>
              <p className="text-xs text-slate-400">Практическая ценность и образование</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed text-base sm:text-lg mb-4">
            Приложение <strong className="text-slate-900 font-semibold">История. Подготовка</strong> создано для эффективного и наглядного запоминания хронологии правления, дат, династий и ключевых исторических вех нашего Отечества в интерактивном формате карточек.
          </p>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Оно помогает школьникам, студентам и всем интересующимся историей легко ориентироваться в эпохах от Рюрика до новейшего времени.
          </p>

          {/* Theological & Spiritual Quote */}
          <div className="mt-6 bg-amber-50/70 border border-amber-200/70 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <Quote size={22} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-700 text-sm italic leading-relaxed">
                  «В судьбах человеческих, в судьбах народов и царств действует непостижимый Промысл Божий, направляющий всё к духовному спасению и благу человека».
                </p>
                <p className="text-xs text-amber-900/80 font-semibold mt-2 text-right">
                  — Святитель Игнатий (Брянчанинов)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Technical Features & PWA */}
        <section id="about-features-section" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100">
              <Zap size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Технические особенности</h2>
              <p className="text-xs text-slate-400">Современный стек и безопасность</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-600" />
                Технология PWA (Progressive Web App)
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Приложение работает как автономное веб-приложение (PWA). Оно функционирует прямо в вашем браузере, не требует загрузки из App Store или Google Play, почти не занимает места в памяти устройства и готово к установке в один клик.
              </p>
            </div>

            <p className="text-slate-600 leading-relaxed text-sm sm:text-base bg-slate-50 p-4 rounded-2xl border border-slate-100">
              Все ваши учебные результаты, статистика прогресса и закладки сохраняются исключительно локально на вашем устройстве через <strong className="text-slate-800 font-semibold">IndexedDB</strong> и <strong className="text-slate-800 font-semibold">localStorage</strong>. Это гарантирует 100% приватность без передачи персональных данных на сторонние серверы.
            </p>

            {/* Advantages */}
            <div className="bg-blue-50/80 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Globe size={20} /> Преимущества:
              </h3>
              <ul className="space-y-3">
                {[
                  'Полный оффлайн-доступ: работает без интернета после первого открытия.',
                  'Экономия памяти: не требует гигабайтов дискового пространства.',
                  'Мгновенные обновления: новая версия активируется без ожидания маркетплейсов.',
                  'Защищенность: взаимодействие происходит исключительно через безопасный протокол HTTPS.'
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-700">
                    <div className="bg-blue-600/10 p-1 rounded-md h-fit mt-0.5 shrink-0">
                      <Check size={14} className="text-blue-600 stroke-[3]" />
                    </div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Limitations */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
              <h3 className="font-bold text-slate-700 mb-1.5 flex items-center gap-2 text-sm">
                <Cpu size={18} /> Ограничения:
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Сохранение локального прогресса и оффлайн-кэша зависит от настроек браузера. При полной ручной очистке истории и кэша браузера сохраненный локальный прогресс карточек может сброситься.
              </p>
            </div>

            {/* Install Callout */}
            <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm flex flex-col items-center text-center mt-4">
              <div className="bg-blue-600 text-white p-3 rounded-2xl mb-3 shadow-lg shadow-blue-100">
                <Download size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Установка на экран «Домой»</h3>
              <p className="text-sm text-slate-500 mb-4 max-w-sm">
                Вы можете сохранить приложение на экран «Домой» вашего смартфона или планшета для мгновенного доступа без интернета.
              </p>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('trigger-pwa-install-prompt'));
                }}
                className="bg-[#c33b3b] hover:bg-[#b03030] text-white font-bold py-3 px-6 rounded-2xl text-sm transition-all shadow-md shadow-red-950/20 flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Download size={16} />
                <span>Открыть окно установки PWA</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Feedback Block */}
        <section id="about-feedback-section" className="flex justify-center pt-4">
          <div className="bg-[#f5f0e6] rounded-[48px] p-8 sm:p-10 w-full max-w-xs shadow-sm border border-[#e8dfcf] flex flex-col items-center">
            <h3 className="text-[#8b1a1a] text-3xl font-serif mb-8 italic">Обратная связь</h3>
            
            <a 
              href="mailto:indievid.krd@gmail.com"
              className="bg-[#e9e3d5] hover:bg-[#e0d9c8] transition-colors w-full rounded-[24px] p-6 flex items-center gap-4 group cursor-pointer"
            >
              <div className="text-slate-600 group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <div className="text-left">
                <div className="text-slate-700 text-lg leading-tight font-medium">Написать</div>
                <div className="text-slate-700 text-lg leading-tight font-medium">разработчику</div>
              </div>
            </a>

            <div className="mt-10 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">
                <Heart size={14} className="text-red-500 fill-red-500" />
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
