import React, { useState } from 'react';
import { Flag, ArrowRight, ExternalLink, Sparkles, ChevronLeft, ChevronRight, RotateCcw, PartyPopper } from 'lucide-react';

interface Stage {
  id: number;
  stageNumber: number;
  positionPercent: number; // Percentage on the track
  title: string;
  shortLabel: string;
  startDate: string;
  endDate: string;
  whatToDo: string;
  systemAccess: string;
  tips: string[];
}

const STAGES: Stage[] = [
  {
    id: 1,
    stageNumber: 1,
    positionPercent: 25,
    title: 'Основная волна записи в SmartLMS',
    shortLabel: 'Этап 1: 25.03.2026',
    startDate: '25 марта 2026 (12:00 МСК)',
    endDate: '28 марта 2026 (23:59 МСК)',
    whatToDo: 'Выбрать 1 приоритетный майнор и указать 2 резервных в системе SmartLMS. Запись проходит по принципу живой очереди («first come, first served»).',
    systemAccess: 'Открывается доступ к модулю «Выбор майноров» в SmartLMS. Доступ имеют все студенты 1 курса бакалавриата.',
    tips: [
      'Авторизуйтесь в SmartLMS за 10 минут до 12:00, чтобы сессия не сбросилась.',
      'Заранее скопируйте код желаемого майнора (например, ФКН-М-01).',
      'Если места на основном майноре закончатся, система автоматически проверит резервные.'
    ]
  },
  {
    id: 2,
    stageNumber: 2,
    positionPercent: 55,
    title: 'Вторая волна (вакантные места)',
    shortLabel: 'Этап 2: 15.04.2026',
    startDate: '15 апреля 2026 (12:00 МСК)',
    endDate: '18 апреля 2026 (23:59 МСК)',
    whatToDo: 'Выбор майноров для студентов, которые не попали на выбранные курсы в 1-й волне или не успели записаться. Выбор происходит только из оставшихся свободных квот.',
    systemAccess: 'SmartLMS открывает доступ только для нераспределенных студентов.',
    tips: [
      'Проверьте вакантные места в каталоге накануне старта второй волны.',
      'Студенты, не сделавшие выбор во 2-й волне, распределяются решением учебного офиса.'
    ]
  },
  {
    id: 3,
    stageNumber: 3,
    positionPercent: 80,
    title: 'Смена майнора в сентябре',
    shortLabel: 'Этап 3: 01.09.2026',
    startDate: '1 сентября 2026',
    endDate: '10 сентября 2026',
    whatToDo: 'Подача заявлений на перевод на другой майнор через Единый личный кабинет (ЕЛК) при наличии освободившихся мест и согласии академических руководителей.',
    systemAccess: 'ЕЛК ВШЭ (Сервис подачи заявлений на перевод между майнорами).',
    tips: [
      'Обязательно проверьте, нет ли расхождений по пререквизитам.',
      'После 10 сентября смена майнора закрывается до конца учебного года.'
    ]
  }
];

interface DeadlinesViewProps {
  onBackToCatalog: () => void;
}

export const DeadlinesView: React.FC<DeadlinesViewProps> = ({ onBackToCatalog }) => {
  // 0 = Start, 1 = Stage 1, 2 = Stage 2, 3 = Stage 3, 4 = Finish
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Position percentage of student on timeline
  const getStudentPosition = (step: number) => {
    switch (step) {
      case 0: return 2; // At the very start
      case 1: return 25; // Flag 1
      case 2: return 55; // Flag 2
      case 3: return 80; // Flag 3
      case 4: return 98; // Finish
      default: return 2;
    }
  };

  const studentLeft = getStudentPosition(currentStep);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider">
            Интерактивный маршрут первокурсника
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Сроки выбора майноров
          </h1>
        </div>

        <button
          onClick={onBackToCatalog}
          className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <span>В каталог</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 
        Timeline Track with Moving Student Character & Expanding Progress Bar
        User requirement:
        "И добавь анимацию в раздел сроков, то есть изначально иконка студента в самом начале, 
        потом при нажатии на первый флаг он перемещается вместе с прогресс баром и появляется плашечка про первый этап и так до финиша"
      */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8">
        
        {/* Step Guide info & Step Navigation Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>
              Нажмите на флаги или кнопки шагов, чтобы перемещать студента по этапам кампании:
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Назад</span>
            </button>

            <button
              onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
              disabled={currentStep === 4}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Вперед</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setCurrentStep(0)}
              title="Вернуться на старт"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The Animated Timeline Stage (scrollable on narrow mobile screens) */}
        <div className="overflow-x-auto pb-2 -mx-2 sm:mx-0 px-2 sm:px-0">
          <div className="relative pt-16 pb-10 px-4 sm:px-8 select-none min-w-[460px]">
          
          {/* Base Horizontal Track Line */}
          <div className="absolute top-[82px] left-8 right-8 h-2 bg-slate-200 rounded-full pointer-events-none" />

          {/* Animated Progress Bar moving smoothly with student */}
          <div
            className="absolute top-[82px] left-8 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-700 ease-in-out pointer-events-none"
            style={{ width: `calc(${studentLeft}% - 16px)` }}
          />

          {/* 
            Animated Student Character Avatar
            Glides smoothly across the timeline track!
          */}
          <div
            className="absolute top-2 -translate-x-1/2 flex flex-col items-center z-30 transition-all duration-700 cubic-bezier(0.34, 1.3, 0.64, 1) pointer-events-none"
            style={{ left: `${studentLeft}%` }}
          >
            {/* Student badge tooltip */}
            <div className="mb-1 px-2 py-0.5 rounded-full bg-blue-900 text-white font-mono text-[10px] font-bold shadow-md whitespace-nowrap animate-bounce">
              {currentStep === 0 && 'Я на старте! 🎓'}
              {currentStep === 1 && 'Выбираю майнор... 🏃'}
              {currentStep === 2 && 'Вторая волна 🎯'}
              {currentStep === 3 && 'Смена майнора 📋'}
              {currentStep === 4 && 'Майнор выбран! 🎉'}
            </div>

            {/* Student Avatar Icon */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#003B70] to-blue-500 text-white border-2 border-white shadow-xl flex items-center justify-center text-xl">
              {currentStep === 4 ? '🎉' : '🧑‍🎓'}
            </div>

            {/* Pin pointer under student */}
            <div className="w-2.5 h-2.5 bg-blue-900 rotate-45 -mt-1 rounded-xs" />
          </div>

          {/* Interactive Flags & Milestones */}
          <div className="relative flex items-center justify-between z-10 pt-4">
            
            {/* Start Node (Step 0) */}
            <button
              onClick={() => setCurrentStep(0)}
              className="group flex flex-col items-center focus:outline-none cursor-pointer"
            >
              <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                currentStep === 0
                  ? 'bg-blue-600 border-white ring-4 ring-blue-200'
                  : 'bg-white border-slate-400 group-hover:border-blue-500'
              }`}>
                <span className="text-[10px] font-bold text-slate-700">0</span>
              </div>
              <span className={`text-[11px] font-mono mt-2 ${
                currentStep === 0 ? 'font-bold text-blue-900' : 'text-slate-500'
              }`}>
                Старт
              </span>
            </button>

            {/* Flag 1: Этап 1 */}
            <button
              onClick={() => setCurrentStep(1)}
              className="group flex flex-col items-center focus:outline-none cursor-pointer"
            >
              <div className={`relative flex flex-col items-center transition-transform ${currentStep === 1 ? 'scale-110' : 'hover:scale-105'}`}>
                {/* Triangular Flag Banner */}
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-sm shadow-md transition-all ${
                  currentStep === 1
                    ? 'bg-blue-600 text-white font-bold ring-4 ring-blue-100'
                    : currentStep > 1
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border-2 border-slate-400 text-slate-700'
                }`}>
                  <Flag className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-mono font-bold whitespace-nowrap">
                    Этап 1
                  </span>
                </div>
                <div className={`w-1 h-5 ${currentStep >= 1 ? 'bg-blue-700' : 'bg-slate-400'}`} />
                <div className={`w-4 h-4 rounded-full border-2 ${
                  currentStep === 1
                    ? 'bg-blue-600 border-white ring-2 ring-blue-500'
                    : currentStep > 1
                    ? 'bg-emerald-500 border-white'
                    : 'bg-white border-slate-400'
                }`} />
              </div>
              <span className={`text-[11px] font-mono mt-2 font-semibold ${
                currentStep === 1 ? 'text-blue-900 font-bold' : 'text-slate-600'
              }`}>
                25.03.2026
              </span>
            </button>

            {/* Flag 2: Этап 2 */}
            <button
              onClick={() => setCurrentStep(2)}
              className="group flex flex-col items-center focus:outline-none cursor-pointer"
            >
              <div className={`relative flex flex-col items-center transition-transform ${currentStep === 2 ? 'scale-110' : 'hover:scale-105'}`}>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-sm shadow-md transition-all ${
                  currentStep === 2
                    ? 'bg-blue-600 text-white font-bold ring-4 ring-blue-100'
                    : currentStep > 2
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border-2 border-slate-400 text-slate-700'
                }`}>
                  <Flag className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-mono font-bold whitespace-nowrap">
                    Этап 2
                  </span>
                </div>
                <div className={`w-1 h-5 ${currentStep >= 2 ? 'bg-blue-700' : 'bg-slate-400'}`} />
                <div className={`w-4 h-4 rounded-full border-2 ${
                  currentStep === 2
                    ? 'bg-blue-600 border-white ring-2 ring-blue-500'
                    : currentStep > 2
                    ? 'bg-emerald-500 border-white'
                    : 'bg-white border-slate-400'
                }`} />
              </div>
              <span className={`text-[11px] font-mono mt-2 font-semibold ${
                currentStep === 2 ? 'text-blue-900 font-bold' : 'text-slate-600'
              }`}>
                15.04.2026
              </span>
            </button>

            {/* Flag 3: Этап 3 */}
            <button
              onClick={() => setCurrentStep(3)}
              className="group flex flex-col items-center focus:outline-none cursor-pointer"
            >
              <div className={`relative flex flex-col items-center transition-transform ${currentStep === 3 ? 'scale-110' : 'hover:scale-105'}`}>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-sm shadow-md transition-all ${
                  currentStep === 3
                    ? 'bg-blue-600 text-white font-bold ring-4 ring-blue-100'
                    : currentStep > 3
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border-2 border-slate-400 text-slate-700'
                }`}>
                  <Flag className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-mono font-bold whitespace-nowrap">
                    Этап 3
                  </span>
                </div>
                <div className={`w-1 h-5 ${currentStep >= 3 ? 'bg-blue-700' : 'bg-slate-400'}`} />
                <div className={`w-4 h-4 rounded-full border-2 ${
                  currentStep === 3
                    ? 'bg-blue-600 border-white ring-2 ring-blue-500'
                    : currentStep > 3
                    ? 'bg-emerald-500 border-white'
                    : 'bg-white border-slate-400'
                }`} />
              </div>
              <span className={`text-[11px] font-mono mt-2 font-semibold ${
                currentStep === 3 ? 'text-blue-900 font-bold' : 'text-slate-600'
              }`}>
                01.09.2026
              </span>
            </button>

            {/* Finish Flag: 🏁 */}
            <button
              onClick={() => setCurrentStep(4)}
              className="group flex flex-col items-center focus:outline-none cursor-pointer"
            >
              <div className={`relative flex flex-col items-center transition-transform ${currentStep === 4 ? 'scale-110' : 'hover:scale-105'}`}>
                <div className={`px-2 py-1 rounded-sm text-xs font-mono font-bold flex items-center gap-1 shadow-md transition-all ${
                  currentStep === 4
                    ? 'bg-slate-900 text-white ring-4 ring-slate-300'
                    : 'bg-slate-800 text-white'
                }`}>
                  <span>🏁</span>
                  <span className="text-[11px]">Финиш</span>
                </div>
                <div className="w-1 h-5 bg-slate-700" />
                <div className={`w-4 h-4 rounded-full border-2 ${
                  currentStep === 4 ? 'bg-slate-900 border-white ring-2 ring-slate-400' : 'bg-slate-800 border-white'
                }`} />
              </div>
              <span className={`text-[11px] font-mono mt-2 font-semibold ${
                currentStep === 4 ? 'text-slate-900 font-bold' : 'text-slate-500'
              }`}>
                15.09.2026
              </span>
            </button>

          </div>
        </div>
        </div>

        {/* 
          Sticky Note Card appearing based on currentStep:
          "при нажатии на первый флаг он перемещается вместе с прогресс баром и появляется плашечка про первый этап и так до финиша"
        */}
        <div className="pt-2 flex justify-center">
          
          {currentStep === 0 && (
            <div className="w-full max-w-xl bg-blue-50/90 border-2 border-blue-200 rounded-2xl p-6 shadow-md text-slate-800 space-y-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  🎓
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-950">
                    Старт кампании выбора майноров
                  </h3>
                  <p className="text-xs text-blue-800">
                    Вы находитесь в начале траектории. Ознакомьтесь с этапами:
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-white/70 p-3 rounded-lg border border-blue-100">
                Каждый первокурсник НИУ ВШЭ обязан выбрать майнор — связку из 4 дисциплин на 2 и 3 курсах (всего 20 кредитов ECTS). Нажмите <strong>«Этап 1»</strong> на флагштоке, чтобы увидеть инструкцию к первой волне!
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <span>Перейти к 1 этапу</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {currentStep >= 1 && currentStep <= 3 && (() => {
            const stage = STAGES[currentStep - 1];
            return (
              <div
                key={stage.id}
                className="w-full max-w-xl bg-amber-50/95 border-2 border-amber-300 rounded-2xl p-6 sm:p-7 shadow-lg relative transform rotate-[-0.5deg] space-y-4 text-slate-900 animate-in fade-in zoom-in-95 duration-300"
              >
                {/* Header matching sketch "🚩 X ЭТАП" and "(R)" */}
                <div className="flex items-start justify-between border-b border-amber-200 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-amber-200/80 flex items-center justify-center text-amber-900 font-bold">
                      <Flag className="w-5 h-5 fill-amber-700 text-amber-800" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-amber-950 font-sans tracking-tight">
                        {stage.stageNumber} ЭТАП: {stage.title}
                      </h3>
                      <div className="text-xs text-amber-800/80 font-medium">
                        Кампания выбора майноров НИУ ВШЭ
                      </div>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full border-2 border-amber-700/60 text-amber-800 flex items-center justify-center font-bold text-xs select-none">
                    Ⓡ
                  </div>
                </div>

                {/* Dates: "С _______ ДО _______" */}
                <div className="bg-amber-100/70 p-3 rounded-xl border border-amber-300/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div>
                    <span className="font-bold text-amber-950 uppercase tracking-wider mr-2">С:</span>
                    <strong className="text-amber-900 font-mono text-sm">{stage.startDate}</strong>
                  </div>
                  <div>
                    <span className="font-bold text-amber-950 uppercase tracking-wider mr-2">ДО:</span>
                    <strong className="text-amber-900 font-mono text-sm">{stage.endDate}</strong>
                  </div>
                </div>

                {/* "Сделать / открывается доступ" */}
                <div className="space-y-3 text-xs sm:text-sm text-slate-800">
                  <div>
                    <span className="font-extrabold text-amber-950 block text-xs uppercase tracking-wider mb-1">
                      Сделать:
                    </span>
                    <p className="leading-relaxed bg-white/60 p-3 rounded-lg border border-amber-200/60 font-sans">
                      {stage.whatToDo}
                    </p>
                  </div>

                  <div>
                    <span className="font-extrabold text-amber-950 block text-xs uppercase tracking-wider mb-1">
                      Открывается доступ:
                    </span>
                    <p className="leading-relaxed text-xs text-slate-700">
                      {stage.systemAccess}
                    </p>
                  </div>

                  {/* Tips */}
                  <div className="pt-1">
                    <span className="font-bold text-amber-900 block text-xs mb-1">
                      Советы первокурсникам:
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-xs text-slate-700">
                      {stage.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-2 border-t border-amber-200 flex items-center justify-between">
                  <span className="text-[11px] text-amber-800/70">
                    Шаг {currentStep} из 3
                  </span>

                  <a
                    href="https://smartlms.hse.ru/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-900 hover:bg-amber-950 rounded-lg transition-colors shadow-xs"
                  >
                    <span>Перейти в SmartLMS</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            );
          })()}

          {currentStep === 4 && (
            <div className="w-full max-w-xl bg-emerald-50/95 border-2 border-emerald-300 rounded-2xl p-6 shadow-lg text-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl">
                  🏁
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-950">
                    Финиш: Майнор выбран!
                  </h3>
                  <div className="text-xs text-emerald-800 font-medium">
                    15 сентября 2026 — Завершение всей кампании
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/70 p-3.5 rounded-xl border border-emerald-200">
                Поздравляем! Ваш индивидуальный учебный план на 2 и 3 курсы сформирован. Дисциплины майнора появятся в расписании RUZ ВШЭ и SmartLMS с 1 модуля.
              </p>

              <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold cursor-pointer"
                >
                  ↺ Пройти путь заново
                </button>

                <button
                  onClick={onBackToCatalog}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Перейти в каталог майноров
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Button to go back to catalog */}
      <div className="text-center pt-2">
        <button
          onClick={onBackToCatalog}
          className="px-6 py-2.5 bg-[#003B70] hover:bg-[#002d57] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Вернуться в каталог майноров
        </button>
      </div>

    </div>
  );
};
