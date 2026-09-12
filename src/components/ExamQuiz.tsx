import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Award, 
  Sparkles, 
  ArrowRight,
  Flame,
  Clock,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import HorizontalScroll from './HorizontalScroll';
import { DATES_DATA } from '../data/dates';
import { RULERS_DATA } from '../data/rulers';
import { TERMS_DATA } from '../data/terms';
import { ARCHITECTURE_DATA } from '../data/architecture';

interface Question {
  id: string;
  category: 'Даты' | 'Правители' | 'Термины' | 'Культура';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function ExamQuiz() {
  const [currentCategory, setCurrentCategory] = useState<'all' | 'dates' | 'rulers' | 'terms' | 'architecture'>('all');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Generate dynamic randomized questions pool from real datasets
  const questions: Question[] = useMemo(() => {
    const list: Question[] = [
      // Dates questions
      {
        id: 'q-d-1',
        category: 'Даты',
        question: 'В каком году произошло окончательное свержение ордынского ига в ходе Стояния на реке Угре?',
        options: ['1380 г.', '1480 г.', '1497 г.', '1505 г.'],
        correctIndex: 1,
        explanation: 'Стояние на реке Угре произошло осенью 1480 года при великом князе Иване III и хане Ахмате, положив конец 240-летней зависимости Руси от Орды.'
      },
      {
        id: 'q-d-2',
        category: 'Даты',
        question: 'В каком году император Александр II подписал Манифест об отмене крепостного права?',
        options: ['1856 г.', '1861 г.', '1864 г.', '1874 г.'],
        correctIndex: 1,
        explanation: '19 февраля 1861 года Александр II подписал «Манифест об отмене крепостного права» и «Положения о крестьянах, выходящих из крепостной зависимости».'
      },
      {
        id: 'q-d-3',
        category: 'Даты',
        question: 'Какое событие произошло в 988 году?',
        options: ['Основание Киева', 'Крещение Руси князем Владимиром', 'Призвание варягов', 'Любечский съезд князей'],
        correctIndex: 1,
        explanation: 'В 988 году князь Владимир Святославич крестил Русь, провозгласив христианство государственной религией.'
      },
      {
        id: 'q-d-4',
        category: 'Даты',
        question: 'В каком году был принят первый общерусский Судебник Ивана III с введением Юрьева дня?',
        options: ['1478 г.', '1485 г.', '1497 г.', '1550 г.'],
        correctIndex: 2,
        explanation: 'Судебник Ивана III был принят в 1497 году и впервые ограничил право крестьянского перехода неделей до и после Юрьева дня с выплатой «пожилого».'
      },
      {
        id: 'q-d-5',
        category: 'Даты',
        question: 'Какая дата ознаменовала начало контрнаступления Красной Армии под Сталинградом (операция «Уран»)?',
        options: ['5 декабря 1941 г.', '19 ноября 1942 г.', '12 июля 1943 г.', '23 июня 1944 г.'],
        correctIndex: 1,
        explanation: '19 ноября 1942 года началось советское контрнаступление под Сталинградом (операция «Уран»), положившее начало коренному перелому в Великой Отечественной войне.'
      },

      // Rulers questions
      {
        id: 'q-r-1',
        category: 'Правители',
        question: 'При каком правителе было окончательно юридически оформлено потомственное крепостное право принятием Соборного уложения?',
        options: ['Михаил Федорович', 'Алексей Михайлович', 'Петр I Великий', 'Федор Алексеевич'],
        correctIndex: 1,
        explanation: 'Соборное уложение было принято в 1649 году при царе Алексее Михайловиче Романове, установив бессрочный сыск беглых крестьян.'
      },
      {
        id: 'q-r-2',
        category: 'Правители',
        question: 'Кто из правителей инициировал реформы «Негласного комитета» и учредил министерства вместо коллегий в 1802 году?',
        options: ['Павел I', 'Александр I', 'Николай I', 'Александр II'],
        correctIndex: 1,
        explanation: 'Император Александр I в 1801–1803 гг. опирался на кружок молодых друзей («Негласный комитет») и заменил петровские коллегии министерствами в 1802 г.'
      },
      {
        id: 'q-r-3',
        category: 'Правители',
        question: 'При каком правителе были присоединены Крым и Новороссия, а также изданы Жалованные грамоты дворянству и городам (1785 г.)?',
        options: ['Елизавета Петровна', 'Петр III', 'Екатерина II Великая', 'Павел I'],
        correctIndex: 2,
        explanation: 'Екатерина II Великая правила в 1762–1796 гг. — в эпоху «просвещенного абсолютизма», победоносных русско-турецких войн и золотого века дворянства.'
      },
      {
        id: 'q-r-4',
        category: 'Правители',
        question: 'Кто правил в период 2008–2012 гг., при ком срок полномочий Президента РФ был увеличен до 6 лет?',
        options: ['Б. Н. Ельцин', 'В. В. Путин', 'Д. А. Медведев', 'М. С. Горбачев'],
        correctIndex: 2,
        explanation: 'Дмитрий Анатольевич Медведев занимал пост Президента РФ с 2008 по 2012 год. При нем были внесены поправки в Конституцию о 6-летнем сроке президента.'
      },

      // Terms questions
      {
        id: 'q-t-1',
        category: 'Термины',
        question: 'Что в Древней Руси означал термин «Вира»?',
        options: [
          'Земельное владение на правах частной собственности',
          'Денежный штраф в пользу князя за убийство свободного человека',
          'Место сбора дани, установленное княгиней Ольгой',
          'Повинность крестьян в пользу феодала'
        ],
        correctIndex: 1,
        explanation: 'Вира — это штраф по «Русской Правде» за убийство свободного человека. За убийство княжеского мужа полагалась двойная вира в 80 гривен.'
      },
      {
        id: 'q-t-2',
        category: 'Термины',
        question: 'Как назывался срок (первоначально 5 лет), в течение которого помещики могли искать своих беглых крестьян?',
        options: ['Заповедные лета', 'Урочные лета', 'Юрьев день', 'Пожилое'],
        correctIndex: 1,
        explanation: 'Урочные лета — это установленный законом срок сыска беглых крестьян (введены в 1597 году царем Федором Ивановичем сроком на 5 лет).'
      },
      {
        id: 'q-t-3',
        category: 'Термины',
        question: 'Что в политической жизни России обозначал термин «Бироновщина»?',
        options: [
          'Период военных поселений при Александре I',
          'Засилье иностранцев и тайной канцелярии при дворе Анны Иоанновны',
          'Политика контрреформ Александра III',
          'Опричные репрессии Ивана Грозного'
        ],
        correctIndex: 1,
        explanation: 'Бироновщина — режим правления в Российской империи в 1730-х гг. при Анне Иоанновне, названный по имени её фаворита Э. И. Бирона.'
      },

      // Architecture & Culture questions
      {
        id: 'q-a-1',
        category: 'Культура',
        question: 'Кто был архитектором шедевра елизаветинского барокко — Зимнего дворца в Санкт-Петербурге?',
        options: ['Огюст Монферран', 'Карл Росси', 'Бартоломео Франческо Растрелли', 'Андрей Воронихин'],
        correctIndex: 2,
        explanation: 'Зимний дворец в стиле пышного елизаветинского барокко был возведен по проекту великого итальянского архитектора Б. Ф. Растрелли в 1754–1762 гг.'
      },
      {
        id: 'q-a-2',
        category: 'Культура',
        question: 'В честь какого исторического события был возведен Покровский собор (Храм Василия Блаженного) на Красной площади?',
        options: [
          'Победа на Куликовом поле (1380 г.)',
          'Взятие Казани Иваном Грозным (1552 г.)',
          'Освобождение Москвы от польских интервентов (1612 г.)',
          'Полтавская битва (1709 г.)'
        ],
        correctIndex: 1,
        explanation: 'Покровский собор на Рву был построен в 1555–1561 гг. зодчими Бармой и Постником Яковлевым по указу Ивана IV Грозного в честь покорения Казанского ханства.'
      },
      {
        id: 'q-a-3',
        category: 'Культура',
        question: 'К какому архитектурному стилю относится Исаакиевский собор в Санкт-Петербурге (архитектор О. Монферран)?',
        options: ['Русское узорочье', 'Нарышкинское барокко', 'Поздний классицизм (монументальный классицизм)', 'Модерн'],
        correctIndex: 2,
        explanation: 'Исаакиевский собор построен в 1818–1858 гг. по проекту Огюста Монферрана в стиле позднего монументального классицизма.'
      }
    ];

    if (currentCategory === 'all') return list;
    if (currentCategory === 'dates') return list.filter(q => q.category === 'Даты');
    if (currentCategory === 'rulers') return list.filter(q => q.category === 'Правители');
    if (currentCategory === 'terms') return list.filter(q => q.category === 'Термины');
    if (currentCategory === 'architecture') return list.filter(q => q.category === 'Культура');
    return list;
  }, [currentCategory]);

  const currentQ = questions[activeQuestionIndex] || questions[0];

  const handleSelectOption = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswerChecked) return;
    setIsAnswerChecked(true);

    if (selectedOption === currentQ.correctIndex) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b']
      });
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      setQuizFinished(true);
      if (score >= questions.length * 0.7) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899']
        });
      }
    }
  };

  const restartQuiz = () => {
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div id="exam-quiz-container" className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Quiz Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-3 border border-white/20">
            <GraduationCap size={14} className="text-yellow-300" />
            <span>Интерактивный блиц-тест</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Тренажер экзаменационных вопросов ЕГЭ
          </h2>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Проверьте свои знания по датам, личностям, терминам и памятникам культуры с моментальным разбором правильных ответов.
          </p>
        </div>

        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <GraduationCap size={260} />
        </div>
      </div>

      {/* Category selector */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200">
        <HorizontalScroll 
          className="w-full"
          contentClassName="flex items-center gap-2 pb-1"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Раздел:
          </span>
          {[
            { key: 'all', label: 'Все темы' },
            { key: 'dates', label: 'Даты' },
            { key: 'rulers', label: 'Правители' },
            { key: 'terms', label: 'Термины' },
            { key: 'architecture', label: 'Культура' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => {
                setCurrentCategory(cat.key as any);
                restartQuiz();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                currentCategory === cat.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </HorizontalScroll>
      </div>

      {/* Quiz Card */}
      {!quizFinished && currentQ && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          {/* Progress Bar & Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                <Flame size={13} /> {currentQ.category}
              </span>
              <span>
                Вопрос {activeQuestionIndex + 1} из {questions.length} • Счет: {score}
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((activeQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ?.options?.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-blue-50/40';

              if (isAnswerChecked) {
                if (idx === currentQ.correctIndex) {
                  btnStyle = 'bg-emerald-500 border-emerald-600 text-white font-semibold shadow-sm';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500 border-rose-600 text-white font-semibold shadow-sm';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                btnStyle = 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerChecked}
                  className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswerChecked && idx === currentQ.correctIndex && (
                    <CheckCircle2 size={18} className="text-white shrink-0" />
                  )}
                  {isAnswerChecked && isSelected && idx !== currentQ.correctIndex && (
                    <XCircle size={18} className="text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswerChecked && (
            <motion.div 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1"
            >
              <strong className="block text-slate-900 font-bold text-sm">
                {selectedOption === currentQ.correctIndex ? '🎉 Верно!' : '❌ Неверно'}
              </strong>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            {!isAnswerChecked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                  selectedOption !== null
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 cursor-pointer active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Проверить ответ
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-200 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <span>{activeQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Finished Screen */}
      {quizFinished && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200 text-center space-y-6">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Award size={44} />
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Тестирование завершено!
            </h3>
            <p className="text-slate-600 text-sm sm:text-base">
              Ваш результат: <strong className="text-blue-600 font-bold">{score}</strong> из <strong>{questions.length}</strong> правильных ответов ({Math.round((score / questions.length) * 100)}%).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-xs text-slate-600 leading-relaxed">
            {score === questions.length ? (
              <p className="text-emerald-700 font-bold">Блестящий результат! Вы отлично знаете фактический материал к экзамену!</p>
            ) : score >= questions.length * 0.7 ? (
              <p className="text-blue-700 font-semibold">Хороший результат! Повторите карточки и даты в разделах для закрепления.</p>
            ) : (
              <p className="text-slate-600">Рекомендуем пройтись по разделам «Хронология» и «Термины» перед повторной попыткой.</p>
            )}
          </div>

          <button
            onClick={restartQuiz}
            className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-200 inline-flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <RotateCcw size={16} />
            <span>Пройти тест снова</span>
          </button>
        </div>
      )}
    </div>
  );
}
