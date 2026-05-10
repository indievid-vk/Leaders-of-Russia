import { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, RefreshCw } from 'lucide-react';

export interface RulerData {
  era: string;
  name: string;
  years: string;
  url: string | null;
  events?: string[];
}

export default function Flashcard({ ruler, isDetailsFirst }: { ruler: RulerData; isDetailsFirst?: boolean }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const renderNameSide = (isFront: boolean) => (
    <div className={`absolute w-full h-full backface-hidden flex flex-col justify-center items-center bg-white border-2 border-slate-200 rounded-3xl shadow-xl p-6 text-center ${!isFront ? 'rotate-y-180' : ''}`}
      style={!isFront ? { transform: 'rotateY(180deg)' } : {}}
    >
      <span className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-4">
        {ruler.era}
      </span>
      <h2 className="text-3xl font-bold text-slate-800 leading-tight">
        {ruler.name}
      </h2>
      <div className="absolute bottom-6 flex items-center text-slate-400 text-sm gap-2">
        <RefreshCw size={16} /> Нажмите, чтобы перевернуть
      </div>
    </div>
  );

  const renderDetailsSide = (isFront: boolean) => (
    <div 
      className={`absolute w-full h-full backface-hidden flex flex-col items-center bg-blue-50 border-2 border-blue-200 rounded-3xl shadow-xl p-6 text-center overflow-hidden ${!isFront ? 'rotate-y-180' : ''}`}
      style={!isFront ? { transform: 'rotateY(180deg)' } : {}}
    >
      <div className="w-full overflow-y-auto flex flex-col items-center custom-scrollbar pr-1">
        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-1">Годы правления</h3>
        <p className="text-xl text-blue-700 font-mono font-bold mb-4">
          {ruler.years}
        </p>
        
        <div className="w-full border-t border-blue-200 pt-4 mb-4">
          <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center justify-center gap-2">
            Ключевые события:
          </h4>
          <div className="space-y-3 text-left">
            {ruler.events && ruler.events.length > 0 ? (
              ruler.events.map((event, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="min-w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <p className="text-sm text-blue-900 leading-relaxed">
                    {event}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-blue-600/80 italic text-center">
                Детальные события недоступны в текущем источнике
              </p>
            )}
          </div>
        </div>
      </div>

      {ruler.url && (
        <a 
          href={ruler.url} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 mt-auto bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Читать полностью
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-sm h-[28rem] perspective-1000 mx-auto select-none group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {isDetailsFirst ? (
          <>
            {renderDetailsSide(true)}
            {renderNameSide(false)}
          </>
        ) : (
          <>
            {renderNameSide(true)}
            {renderDetailsSide(false)}
          </>
        )}
      </motion.div>
    </div>
  );
}
