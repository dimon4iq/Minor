import React, { useState } from 'react';
import { Minor, Review } from '../types/minor';
import {
  ArrowLeft,
  Star,
  Flame,
  Award,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Share2,
  PlusCircle,
  ThumbsUp,
  MapPin,
  ExternalLink,
  Globe
} from 'lucide-react';

interface MinorDetailViewProps {
  minor: Minor;
  onBack: () => void;
  onOpenAddReview: (minorId: string) => void;
  studentFaculty?: string;
}

export const MinorDetailView: React.FC<MinorDetailViewProps> = ({
  minor,
  onBack,
  onOpenAddReview,
  studentFaculty
}) => {
  const [copied, setCopied] = useState(false);
  const [reviewsList, setReviewsList] = useState<Review[]>(minor.reviews);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // Sync if minor changes
  React.useEffect(() => {
    setReviewsList(minor.reviews);
  }, [minor]);

  // Restriction check
  const isRestricted = studentFaculty
    ? minor.restrictedFaculties.some(rf =>
        rf.toLowerCase().includes(studentFaculty.toLowerCase()) ||
        studentFaculty.toLowerCase().includes(rf.toLowerCase())
      )
    : false;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fixed like/unlike bug: clicking like again removes the like!
  const handleToggleLike = (reviewId: string) => {
    const isCurrentlyLiked = Boolean(likedReviews[reviewId]);
    
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: !isCurrentlyLiked
    }));

    setReviewsList(prev =>
      prev.map(r => {
        if (r.id !== reviewId) return r;
        const newLikes = isCurrentlyLiked ? Math.max(0, r.likes - 1) : r.likes + 1;
        return { ...r, likes: newLikes };
      })
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors p-2 -ml-1 rounded-xl hover:bg-slate-100 cursor-pointer touch-manipulation min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к каталогу майноров</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Minor link placeholder per user request: 'тут будет ссылка на майнор' */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-lg select-none"
            title="Ссылка на майнор"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>тут будет ссылка на майнор</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer touch-manipulation min-h-[34px]"
            title="Скопировать ссылку"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Скопировано!' : 'Поделиться'}</span>
          </button>

          {/* Renamed: "Оставить отзыв на майнор" */}
          <button
            onClick={() => onOpenAddReview(minor.id)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#003B70] hover:bg-[#002d57] rounded-lg shadow-xs transition-colors cursor-pointer touch-manipulation min-h-[34px]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Оставить отзыв на майнор</span>
          </button>
        </div>
      </div>

      {/* Minor Header / Title (Matching Photo 3 "НАЗВАНИЕ") */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
          <span className="font-bold text-blue-700">{minor.code}</span>
          <span>·</span>
          <span>{minor.facultyOwner}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {minor.campus}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-sans">
          {minor.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800">
            Язык: {minor.language}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
            Формат: {minor.format}
          </span>
          <span className="text-xs font-medium text-slate-600">
            Квота: <strong className="text-slate-900">{minor.quota} мест</strong> ({minor.availableSpots} свободно)
          </span>

          {isRestricted && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Внимание: майнор недоступен для студентов программы «{studentFaculty}»</span>
            </div>
          )}
        </div>
      </div>

      {/* 
        Photo 3 layout:
        Square / Large JPEG image container on the left + "Описание (2-3 предл.)" on the right!
      */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-200">
        <div className="md:col-span-5 relative aspect-square sm:aspect-4/3 rounded-xl overflow-hidden shadow-xs border border-slate-200 bg-slate-900">
          <img
            src={minor.imageUrl}
            alt={minor.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-white font-mono">
            Официальный баннер курса
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-center space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
              Краткое описание (2–3 предложения)
            </div>
            <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed">
              {minor.shortDescription}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ключевые темы и навыки
            </div>
            <div className="flex flex-wrap gap-1.5">
              {minor.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
            {minor.recommendedFor.length > 0 && (
              <div>
                <span className="font-semibold text-slate-900">Особенно полезен для: </span>
                {minor.recommendedFor.join(', ')}
              </div>
            )}

            {/* Direct Official Site Link placeholder per user request */}
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 shrink-0 select-none">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>тут будет ссылка на майнор</span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        Photo 3 section:
        "ИНФО С САЙТА ВШЭ":
        - Описание (полное)
        - 0,4 + 0,5 + 0,1 = О_к - Формула оценки
        - Учебный план (Таблица)
      */}
      <section className="space-y-6 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <BookOpen className="w-5 h-5 text-[#003B70]" />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Инфо с сайта ВШЭ
          </h2>
        </div>

        {/* Описание (полное) */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Полное описание майнора
          </h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-white p-5 rounded-xl border border-slate-200">
            {minor.fullDescription}
          </p>
        </div>

        {/* Формула оценки */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Формула оценки и правила контроля
            </h3>
            <span className="text-xs text-slate-500">По регламенту организации аттестации ВШЭ</span>
          </div>

          <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-blue-200 rounded-xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/80 pb-3">
              <div className="text-xs text-blue-900 font-semibold uppercase tracking-wider">
                Формула итоговой оценки
              </div>
              <div className="font-mono text-base sm:text-lg font-bold text-blue-950 bg-white/80 px-3 py-1 rounded-lg border border-blue-200 shadow-xs tabular-nums">
                {minor.formula.formulaText}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700 pt-1">
              <div>
                <strong className="block text-slate-900 font-semibold mb-0.5">Структура элементов:</strong>
                <p className="text-slate-600">{minor.formula.description}</p>
              </div>
              <div>
                <strong className="block text-slate-900 font-semibold mb-0.5">Блокирующие элементы:</strong>
                <p className="text-slate-600">{minor.formula.blockingElements}</p>
              </div>
              <div>
                <strong className="block text-slate-900 font-semibold mb-0.5">Правило округления:</strong>
                <p className="text-slate-600">{minor.formula.roundingRule}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Учебный план */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Учебный план (4 дисциплины)
            </h3>
            <span className="text-xs text-slate-500">Всего 20 кредитов ECTS</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm min-w-[580px]">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">№</th>
                  <th className="py-3 px-4">Дисциплина</th>
                  <th className="py-3 px-4">Семестр / Модуль</th>
                  <th className="py-3 px-4">Кредиты</th>
                  <th className="py-3 px-4">Формат и контроль</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {minor.disciplines.map((disc, idx) => (
                  <tr key={disc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400 text-center">
                      0{idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{disc.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5 max-w-lg">{disc.description}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {disc.module}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800 font-semibold whitespace-nowrap">
                      {disc.credits} ECTS
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-medium text-slate-900">{disc.examType}</div>
                      <div className="text-xs text-slate-500">{disc.format}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 
        Photo 4:
        ПРЕПОДАВАТЕЛИ
      */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Преподаватели майнора
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {minor.teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5"
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-[#003B70] font-bold text-lg shrink-0 overflow-hidden shadow-xs">
                {teacher.photoUrl ? (
                  <img src={teacher.photoUrl} alt={teacher.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{teacher.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-slate-900 leading-snug truncate">
                  {teacher.name}
                </h4>
                <div className="text-xs text-slate-500 truncate mt-0.5">
                  {teacher.role}
                </div>
                <div className="mt-1.5">
                  <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {teacher.verdictTag}
                  </span>
                </div>
                {/* Placeholder text requested by user */}
                <div className="mt-2 pt-1.5 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                  тут будет ссылка на страницу преподавателя
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 
        Photo 4:
        РЕЙТИНГ (5 circular metrics badges)
      */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">
              Рейтинг курса
            </h2>
            <p className="text-xs text-slate-500">
              На основе {minor.ratings.reviewCount} отзывов верифицированных студентов
            </p>
          </div>

          <div className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{minor.ratings.recommendPercent}% студентов рекомендуют этот майнор</span>
          </div>
        </div>

        {/* The 5 Circular Indicators from Photo 4 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 pt-2">
          
          {/* 1. Общий */}
          <div className="bg-white p-4 rounded-2xl border-2 border-blue-500/30 flex flex-col items-center text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex flex-col items-center justify-center shadow-sm">
              <span className="text-lg font-extrabold font-mono tabular-nums leading-none">
                {minor.ratings.overall.toFixed(1)}
              </span>
              <span className="text-[10px] text-blue-200 font-mono leading-none mt-0.5">/ 5.0</span>
            </div>
            <div className="mt-2.5 font-bold text-xs sm:text-sm text-slate-900">
              Общий
            </div>
            <div className="text-[11px] text-slate-400">
              Итоговый балл
            </div>
          </div>

          {/* 2. Сложность */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-orange-50 border-2 border-orange-400 text-orange-700 flex flex-col items-center justify-center">
              <span className="text-lg font-extrabold font-mono tabular-nums leading-none">
                {minor.ratings.difficulty.toFixed(1)}
              </span>
              <span className="text-[10px] text-orange-500 font-mono leading-none mt-0.5">/ 5.0</span>
            </div>
            <div className="mt-2.5 font-bold text-xs sm:text-sm text-slate-900">
              Сложность
            </div>
            <div className="text-[11px] text-slate-400">
              Сдача дедлайнов
            </div>
          </div>

          {/* 3. Полезность */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-800 flex flex-col items-center justify-center">
              <span className="text-lg font-extrabold font-mono tabular-nums leading-none">
                {minor.ratings.usefulness.toFixed(1)}
              </span>
              <span className="text-[10px] text-emerald-600 font-mono leading-none mt-0.5">/ 5.0</span>
            </div>
            <div className="mt-2.5 font-bold text-xs sm:text-sm text-slate-900">
              Полезность
            </div>
            <div className="text-[11px] text-slate-400">
              Для резюме и работы
            </div>
          </div>

          {/* 4. Энергозатраты / Время */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-400 text-indigo-700 flex flex-col items-center justify-center">
              <span className="text-lg font-extrabold font-mono tabular-nums leading-none">
                {minor.ratings.workload.toFixed(1)}
              </span>
              <span className="text-[10px] text-indigo-500 font-mono leading-none mt-0.5">/ 5.0</span>
            </div>
            <div className="mt-2.5 font-bold text-xs sm:text-sm text-slate-900">
              Энергозатраты
            </div>
            <div className="text-[11px] text-slate-400">
              Часы в неделю
            </div>
          </div>

          {/* 5. Интересность */}
          <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-purple-50 border-2 border-purple-500 text-purple-800 flex flex-col items-center justify-center">
              <span className="text-lg font-extrabold font-mono tabular-nums leading-none">
                {minor.ratings.interest.toFixed(1)}
              </span>
              <span className="text-[10px] text-purple-600 font-mono leading-none mt-0.5">/ 5.0</span>
            </div>
            <div className="mt-2.5 font-bold text-xs sm:text-sm text-slate-900">
              Интересность
            </div>
            <div className="text-[11px] text-slate-400">
              Увлекательность тем
            </div>
          </div>

        </div>
      </section>

      {/* 
        Photo 4:
        ОТЗЫВЫ
      */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">
              Отзывы студентов
            </h2>
            <p className="text-xs text-slate-500">
              Реальный опыт сдачи экзаменов, лайфхаки и подводные камни
            </p>
          </div>

          {/* Renamed: "Оставить отзыв на майнор" */}
          <button
            onClick={() => onOpenAddReview(minor.id)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Оставить отзыв на майнор</span>
          </button>
        </div>

        {reviewsList.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 space-y-3">
            <p className="text-sm">Пока нет отзывов для этого майнора. Будьте первым!</p>
            <button
              onClick={() => onOpenAddReview(minor.id)}
              className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            >
              Оставить отзыв на майнор
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reviewsList.map((review) => {
              const isLiked = Boolean(likedReviews[review.id]);
              return (
                <div
                  key={review.id}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                >
                  {/* Author row & Stars */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                        {review.isAnonymous ? '?' : review.authorName[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900">
                          {review.isAnonymous ? 'Студент НИУ ВШЭ (Анонимно)' : review.authorName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {review.studyYear} · {review.faculty}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.ratings.overall
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{review.date}</span>
                    </div>
                  </div>

                  {/* Main Review Text */}
                  <p className="text-sm text-slate-800 leading-relaxed font-sans">
                    {review.text}
                  </p>

                  {/* Pros & Cons & Advice Callouts */}
                  {(review.pros || review.cons || review.advice) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                      {review.pros && (
                        <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                          <span className="font-semibold text-emerald-900 block mb-0.5">Плюсы:</span>
                          <span className="text-emerald-800/90">{review.pros}</span>
                        </div>
                      )}
                      {review.cons && (
                        <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-100">
                          <span className="font-semibold text-rose-900 block mb-0.5">Минусы:</span>
                          <span className="text-rose-800/90">{review.cons}</span>
                        </div>
                      )}
                      {review.advice && (
                        <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
                          <span className="font-semibold text-blue-900 block mb-0.5">Лайфхак:</span>
                          <span className="text-blue-800/90">{review.advice}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer with working like toggle (like / unlike) */}
                  <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
                    <span className="text-[11px]">Отзыв верифицирован через корпоративную почту ВШЭ</span>

                    <button
                      onClick={() => handleToggleLike(review.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        isLiked
                          ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                      title={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{isLiked ? 'Вам понравилось' : 'Полезно'} ({review.likes})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};
