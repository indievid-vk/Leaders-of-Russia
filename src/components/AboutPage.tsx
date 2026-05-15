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
              <Info size={28} />
            </div>
            <h2 className="text-xl font-bold">О проекте</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4 text-lg">
            Приложение <strong className="text-slate-900">Правители России</strong> — это практический помощник для запоминания правителей России и хронологии их правления.
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Технология PWA</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="text-blue-600 mb-3"><Zap size={24} /></div>
              <h4 className="font-bold mb-2">Современный стандарт</h4>
              <p className="text-sm text-slate-500">Позволяет устанавливать приложение по прямой ссылке, без магазинов (App Store/Play Store).</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="text-green-600 mb-3"><ShieldCheck size={24} /></div>
              <h4 className="font-bold mb-2">Полная приватность</h4>
              <p className="text-sm text-slate-500">Все записи и прогресс хранятся только в памяти браузера. Никаких облаков.</p>
            </div>
          </div>

          <div className="bg-blue-600 text-white rounded-3xl p-8 shadow-xl shadow-blue-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10 bg-white w-40 h-40 rounded-full" />
             <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
               <Globe size={24} /> Преимущества
             </h4>
             <ul className="space-y-4">
               {[
                 { title: 'Офлайн-доступ', desc: 'работает без интернета после загрузки.' },
                 { title: 'Легкость', desc: 'не занимает много места в памяти устройства.' },
                 { title: 'Мгновенные обновления', desc: 'без необходимости скачивания из магазинов.' },
                 { title: 'Безопасность', desc: 'только через защищенный протокол HTTPS.' }
               ].map((item, i) => (
                 <li key={i} className="flex gap-3">
                   <div className="bg-white/20 p-1 rounded-lg h-fit mt-1">
                     <Check size={14} className="text-white" />
                   </div>
                   <div>
                     <span className="font-bold">{item.title}:</span> <span className="opacity-90">{item.desc}</span>
                   </div>
                 </li>
               ))}
             </ul>
          </div>

          <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200">
             <h4 className="font-bold mb-2 flex items-center gap-2 text-slate-700">
               <Cpu size={20} /> Ограничения
             </h4>
             <p className="text-sm text-slate-500">Зависимость от возможностей и обновлений вашего браузера.</p>
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
