import React, { useState } from 'react';
import { X, Star, Flame, Award, Clock, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Minor, Review } from '../types/minor';
import { HSE_FACULTIES } from '../data/minorsData';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  minors: Minor[];
  preselectedMinorId?: string;
  onSubmitReview: (newReview: Review) => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  minors,
  preselectedMinorId,
  onSubmitReview
}) => {
  const [selectedMinorId, setSelectedMinorId] = useState(preselectedMinorId || (minors[0]?.id ?? ''));
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [faculty, setFaculty] = useState(HSE_FACULTIES[0] || '');
  const [studyYear, setStudyYear] = useState('3 курс');
  const [reviewText, setReviewText] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [advice, setAdvice] = useState('');

  // 5 criteria ratings
  const [overallRating, setOverallRating] = useState(5);
  const [difficultyRating, setDifficultyRating] = useState(3);
  const [usefulnessRating, setUsefulnessRating] = useState(5);
  const [workloadRating, setWorkloadRating] = useState(3);
  const [interestRating, setInterestRating] = useState(5);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Update selection if prop changes
  React.useEffect(() => {
    if (preselectedMinorId) {
      setSelectedMinorId(preselectedMinorId);
    }
  }, [preselectedMinorId]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMinorId) {
      setError('Выберите майнор для отзыва');
      return;
    }
    if (!reviewText.trim() || reviewText.length < 15) {
      setError('Пожалуйста, напишите отзыв чуть подробнее (минимум 15 символов)');
      return;
    }

    const review: Review = {
      id: 'rev-' + Date.now(),
      minorId: selectedMinorId,
      authorName: isAnonymous ? 'Анонимно' : (authorName.trim() || 'Студент Вышки'),
      isAnonymous,
      faculty,
      studyYear,
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      ratings: {
        overall: overallRating,
        difficulty: difficultyRating,
        usefulness: usefulnessRating,
        workload: workloadRating,
        interest: interestRating
      },
      text: reviewText.trim(),
      pros: pros.trim() || undefined,
      cons: cons.trim() || undefined,
      advice: advice.trim() || undefined,
      likes: 1
    };

    onSubmitReview(review);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setReviewText('');
      setPros('');
      setCons('');
      setAdvice('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
          
          {/* Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                Оставить отзыв на майнор
              </h3>
              <p className="text-xs text-slate-500">
                Помогите первокурсникам сделать осознанный выбор
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Спасибо за ваш отзыв!</h4>
              <p className="text-sm text-slate-600">
                Отзыв успешно добавлен, рейтинг майнора пересчитан.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Minor selection */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Майнор *
                </label>
                <select
                  value={selectedMinorId}
                  onChange={(e) => setSelectedMinorId(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {minors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.facultyOwner})
                    </option>
                  ))}
                </select>
              </div>

              {/* 5 Rating Criteria Grid */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3.5">
                <span className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Оценка по 5 критериям
                </span>

                {/* 1. Overall */}
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs sm:text-sm font-medium text-slate-800">
                    Общее впечатление:
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setOverallRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        title={`${star} из 5`}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= overallRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold ml-1 text-slate-700">{overallRating}/5</span>
                  </div>
                </div>

                {/* 2. Difficulty */}
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs sm:text-sm font-medium text-slate-800">
                    Сложность сдачи (1 - легко, 5 - хардкор):
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={difficultyRating}
                      onChange={(e) => setDifficultyRating(Number(e.target.value))}
                      className="w-24 sm:w-32 accent-orange-500 cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold w-6 text-orange-600">{difficultyRating}/5</span>
                  </div>
                </div>

                {/* 3. Usefulness */}
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs sm:text-sm font-medium text-slate-800">
                    Практическая польза (для карьеры / навыков):
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={usefulnessRating}
                      onChange={(e) => setUsefulnessRating(Number(e.target.value))}
                      className="w-24 sm:w-32 accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold w-6 text-emerald-700">{usefulnessRating}/5</span>
                  </div>
                </div>

                {/* 4. Workload / Time */}
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs sm:text-sm font-medium text-slate-800">
                    Энергозатраты и время (1 - &lt;2ч/нед, 5 - 10+ ч):
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={workloadRating}
                      onChange={(e) => setWorkloadRating(Number(e.target.value))}
                      className="w-24 sm:w-32 accent-indigo-500 cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold w-6 text-indigo-700">{workloadRating}/5</span>
                  </div>
                </div>

                {/* 5. Interest */}
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs sm:text-sm font-medium text-slate-800">
                    Интересность лекций и материалов:
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={interestRating}
                      onChange={(e) => setInterestRating(Number(e.target.value))}
                      className="w-24 sm:w-32 accent-purple-500 cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold w-6 text-purple-700">{interestRating}/5</span>
                  </div>
                </div>
              </div>

              {/* Author info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Ваш факультет / ОП
                  </label>
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {HSE_FACULTIES.map(fac => (
                      <option key={fac} value={fac}>{fac}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Курс обучения
                  </label>
                  <select
                    value={studyYear}
                    onChange={(e) => setStudyYear(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2 курс бакалавриата">2 курс бакалавриата</option>
                    <option value="3 курс бакалавриата">3 курс бакалавриата</option>
                    <option value="4 курс бакалавриата">4 курс бакалавриата</option>
                    <option value="Выпускник ВШЭ">Выпускник ВШЭ</option>
                  </select>
                </div>
              </div>

              {/* Author Name or Anonymous */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Имя автора
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Опубликовать анонимно</span>
                  </label>
                </div>
                {!isAnonymous && (
                  <input
                    type="text"
                    placeholder="Например: Артем С. или полное имя"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Текст отзыва *
                </label>
                <textarea
                  rows={3}
                  placeholder="Опишите, как проходило обучение: лояльность преподавателей, формат пар, сложность домашних заданий..."
                  value={reviewText}
                  onChange={(e) => {
                    setReviewText(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Pros / Cons / Advice */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    Главные плюсы
                  </label>
                  <input
                    type="text"
                    placeholder="Понятные лекции, автомат..."
                    value={pros}
                    onChange={(e) => setPros(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-rose-800 uppercase tracking-wider mb-1">
                    Главные минусы
                  </label>
                  <input
                    type="text"
                    placeholder="Много домашек, строгий экзамен..."
                    value={cons}
                    onChange={(e) => setCons(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1">
                    Совет / Лайфхак
                  </label>
                  <input
                    type="text"
                    placeholder="Сдавайте контесты заранее..."
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#003B70] hover:bg-[#002d57] rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Опубликовать отзыв
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
