import { motion } from 'motion/react';
import { ChevronLeft, Calendar, History, Info } from 'lucide-react';
import { RulerData } from './Flashcard';

interface TimelineProps {
  rulers: RulerData[];
  onBack: () => void;
}

export default function Timeline({ rulers, onBack }: TimelineProps) {
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
          <h1 className="text-xl font-bold">Хронология правителей</h1>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">История России сквозь века</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">
        <div className="relative border-l-2 border-blue-200 ml-4 py-8 space-y-12">
          {rulers.map((ruler, index) => (
            <motion.div 
              key={`${ruler.era}-${ruler.name}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index % 5 * 0.05 }}
              className="relative pl-10"
            >
              {/* Timeline dot */}
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm z-10" />
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                      <History size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{ruler.name}</h2>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
                        {ruler.era}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-medium bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 w-fit">
                    <Calendar size={16} />
                    <span>{ruler.years}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                       <Info size={14} /> Ключевые события
                    </h3>
                    <ul className="space-y-2">
                      {ruler.events && ruler.events.length > 0 ? (
                        ruler.events.slice(0, 3).map((event, i) => (
                          <li key={i} className="text-sm text-slate-600 flex gap-3">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{event}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-slate-400 italic">События не указаны</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer / Floating Button */}
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-white text-blue-600 p-4 rounded-2xl shadow-lg border border-slate-200 hover:bg-blue-50 transition-colors"
          title="Наверх"
        >
          <ChevronLeft size={24} className="rotate-90" />
        </button>
      </div>
    </div>
  );
}
