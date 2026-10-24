import React, { useState } from 'react';
import { Minor, FilterState, SortPriorityItem, CriterionKey } from '../types/minor';
import { Star, Flame, Award, Clock, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';

interface MinorCardProps {
  minor: Minor;
  onSelect: (minor: Minor) => void;
  studentFaculty?: string;
  activeCriteria?: FilterState['criteria'];
  topPriority?: SortPriorityItem;
  generalSort?: 'priority' | 'reviews' | 'title';
}

export const MinorCard: React.FC<MinorCardProps> = ({
  minor,
  onSelect,
  studentFaculty,
  activeCriteria,
  topPriority,
  generalSort = 'priority'
}) => {
  const [imageError, setImageError] = useState(false);

  // Check if restricted for current student's faculty
  const isRestricted = studentFaculty
    ? minor.restrictedFaculties.some(rf =>
        rf.toLowerCase().includes(studentFaculty.toLowerCase()) ||
        studentFaculty.toLowerCase().includes(rf.toLowerCase())
      )
    : false;

  // Render individual criterion badge
  const renderCriterionBadge = (key: CriterionKey) => {
    switch (key) {
      case 'difficulty':
        return (
          <div key="diff" className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200 animate-in fade-in">
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            <span className="font-medium text-[11px]">
              Сложность: <strong className="font-bold tabular-nums text-orange-950">{minor.ratings.difficulty.toFixed(1)}</strong>/5
            </span>
          </div>
        );
      case 'usefulness':
        return (
          <div key="use" className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 animate-in fade-in">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-[11px]">
              Польза: <strong className="font-bold tabular-nums text-emerald-950">{minor.ratings.usefulness.toFixed(1)}</strong>/5
            </span>
          </div>
        );
      case 'workload':
        return (
          <div key="work" className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 animate-in fade-in">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-medium text-[11px]">
              Время: <strong className="font-bold tabular-nums text-indigo-950">{minor.ratings.workload.toFixed(1)}</strong>/5
            </span>
          </div>
        );
      case 'interest':
        return (
          <div key="int" className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span className="font-medium text-[11px]">
              Интерес: <strong className="font-bold tabular-nums text-purple-950">{minor.ratings.interest.toFixed(1)}</strong>/5
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  // Collect which criteria to display in the card footer next to overall rating:
  // 1. Any criteria enabled in the filter panel
  // 2. The 1st priority criterion from the priority sorting list (if not overall)
  const criteriaKeysToDisplay = new Set<CriterionKey>();

  if (activeCriteria?.difficulty?.enabled) criteriaKeysToDisplay.add('difficulty');
  if (activeCriteria?.usefulness?.enabled) criteriaKeysToDisplay.add('usefulness');
  if (activeCriteria?.workload?.enabled) criteriaKeysToDisplay.add('workload');
  if (activeCriteria?.interest?.enabled) criteriaKeysToDisplay.add('interest');

  if (generalSort === 'priority' && topPriority && topPriority.criterion !== 'overall') {
    criteriaKeysToDisplay.add(topPriority.criterion);
  }

  return (
    <div
      onClick={() => onSelect(minor)}
      className="group relative bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Square / 1:1 Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
        {!imageError ? (
          <img
            src={minor.imageUrl}
            alt={minor.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-blue-950 p-6 text-white text-center">
            <span className="text-4xl font-extrabold text-blue-400 mb-2 font-mono">
              {minor.code}
            </span>
            <span className="text-sm font-medium text-slate-200 line-clamp-2">
              {minor.title}
            </span>
          </div>
        )}

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between gap-2 pointer-events-none">
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-slate-900 shadow-xs">
            {minor.language} · {minor.format}
          </span>

          {isRestricted ? (
            <span className="text-[11px] font-semibold px-2 py-1 rounded-md bg-rose-600/90 backdrop-blur-md text-white flex items-center gap-1 shadow-xs">
              <AlertTriangle className="w-3 h-3" />
              <span>Ограничение</span>
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-slate-900/75 backdrop-blur-md text-slate-200">
              {minor.availableSpots} мест
            </span>
          )}
        </div>

        {/* Bottom overlay in default view: Title & Code */}
        <div className="absolute bottom-3 inset-x-3 text-white pointer-events-none group-hover:opacity-0 transition-opacity duration-200">
          <div className="text-[11px] font-mono text-blue-300 font-semibold tracking-wide">
            {minor.code}
          </div>
          <h3 className="font-bold text-base sm:text-lg leading-snug line-clamp-2 text-white drop-shadow-xs">
            {minor.title}
          </h3>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-md p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10 text-white">
          <div className="space-y-3">
            <div>
              <div className="text-xs font-mono text-blue-400 font-medium">
                {minor.facultyOwner}
              </div>
              <h4 className="font-bold text-lg text-white leading-tight mt-0.5">
                {minor.title}
              </h4>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-4">
              {minor.shortDescription}
            </p>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {minor.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action button "Далее..." */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {minor.ratings.reviewCount} отзывов студентов
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(minor);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>Далее...</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 
        Card Footer:
        Shows overall rating + all active criteria and priority criteria scores right next to it!
      */}
      <div className="p-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        
        {/* Left Side: Base Overall Rating + Specific Criteria Badges */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Base Overall Rating: ★ 4.7 / 5.0 */}
          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm tabular-nums font-bold">{minor.ratings.overall.toFixed(1)}</span>
            <span className="text-[11px] text-slate-400 font-normal">/ 5.0</span>
          </div>

          {/* Specific Criteria Badges (Difficulty, Usefulness, Workload, Interest) */}
          {Array.from(criteriaKeysToDisplay).map(key => renderCriterionBadge(key))}

        </div>

        {/* Right Side: Review count & Mobile CTA */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">{minor.ratings.reviewCount} отзывов</span>
          <span className="sm:hidden inline-flex items-center gap-0.5 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
            Далее <ArrowRight className="w-3 h-3" />
          </span>
        </div>

      </div>
    </div>
  );
};
