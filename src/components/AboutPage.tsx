import { motion } from 'motion/react';
import { ChevronLeft, Info, ShieldCheck, Zap, Globe, Cpu, Mail, Heart, ExternalLink } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">О приложении</h1>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Технологии и миссия</p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-8 space-y-8 pb-20">
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100">
              <Zap size={28} />
            </div>
            <h2 className="text-xl font-bold">Особенности приложения</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Технология PWA</h3>
              <p className="text-slate-600 leading-relaxed">
                Приложение работает как PWA (Progressive Web App) — современная технология, которая позволяет устанавливать приложение не из магазина приложений, а просто по прямой ссылке. Оно живет прямо в вашем браузере, почти не занимая лишнего места.
              </p>
            </div>

            <p className="text-slate-600 leading-relaxed font-medium">
              Все записи и фото хранятся только внутри памяти браузера. Это обеспечивает полную приватность без передачи информации в облачные хранилища.
            </p>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Globe size={20} /> Преимущества:
              </h3>
              <ul className="space-y-3">
                {[
                  'Офлайн-доступ: работает без интернета после загрузки.',
                  'Не занимает много места в памяти устройства.',
                  'Мгновенные обновления без необходимости скачивания из магазинов.',
                  'Безопасность: работает только через защищенный протокол HTTPS.'
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-700">
                    <div className="bg-blue-500/20 p-1 rounded h-fit mt-0.5">
                      <Check size={12} className="text-blue-600" />
                    </div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Cpu size={20} /> Ограничения:
              </h3>
              <p className="text-sm text-slate-600">Зависимость от возможностей браузера.</p>
            </div>
          </div>
        </section>

        {/* Feedback Block based on image */}
        <section className="flex justify-center pt-8">
           <div className="bg-[#f5f0e6] rounded-[48px] p-10 w-full max-w-xs shadow-sm border border-[#e8dfcf] flex flex-col items-center">
              <h3 className="text-[#8b1a1a] text-3xl font-serif mb-8 italic">Обратная связь</h3>
              
              <a 
                href="mailto:indievid.krd@gmail.com"
                className="bg-[#e9e3d5] hover:bg-[#e0d9c8] transition-colors w-full rounded-[24px] p-6 flex items-center gap-4 group"
              >
                <div className="text-slate-600 group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div className="text-left">
                   <div className="text-slate-700 text-lg leading-tight">Написать</div>
                   <div className="text-slate-700 text-lg leading-tight">разработчику</div>
                </div>
              </a>

              <div className="mt-12 flex flex-col items-center text-center">
                 <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">
                    <Heart size={14} className="text-red-500 fill-red-500" />
                    <span>Создано нейрокомандой</span>
                 </div>
                 <div className="text-slate-500 text-sm font-medium">
                    Индивид СтуИИя
                 </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}

function Check({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
