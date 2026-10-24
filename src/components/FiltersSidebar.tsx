import React, { useState } from 'react';
import { X, RotateCcw, GraduationCap, Globe, Monitor, Building2, Star, Flame, Award, Clock, Sparkles, ArrowDown, ArrowUp, ChevronDown, ChevronUp, GripVertical, Sliders, CheckSquare, Square } from 'lucide-react';
import { FilterState, MinorLanguage, MinorFormat, CriterionKey, SortPriorityItem } from '../types/minor';
import { HSE_FACULTIES } from '../data/minorsData';

interface FiltersSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableDepartments: string[];
  totalResultsCount: number;
  isMobileDrawer?: boolean;
}

export const DEFAULT_SORT_PRIORITIES: SortPriorityItem[] = [
  { criterion: 'overall', direction: 'desc' },
  { criterion: 'usefulness', direction: 'desc' },
  { criterion: 'difficulty', direction: 'asc' }, // By default: easiest is preferred if tied
  { criterion: 'interest', direction: 'desc' },
  { criterion: 'workload', direction: 'asc' }
];

export const DEFAULT_CRITERIA_FILTERS: FilterState['criteria'] = {
  overall: { enabled: false, min: 3.5, max: 5.0 },
  difficulty: { enabled: false, min: 1.0, max: 3.5 },
  usefulness: { enabled: false, min: 4.0, max: 5.0 },
  workload: { enabled: false, min: 1.0, max: 3.5 },
  interest: { enabled: false, min: 4.0, max: 5.0 }
};

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  isOpen = false,
  onClose = () => {},
  filters,
  onFilterChange,
  availableDepartments,
  totalResultsCount,
  isMobileDrawer = false
}) => {
  // Close on Escape key press when open in mobile mode
  React.useEffect(() => {
    if (!isMobileDrawer || !isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileDrawer, isOpen, onClose]);

  // Lock body scroll on mobile when drawer is open
  React.useEffect(() => {
    if (isMobileDrawer && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileDrawer, isOpen]);
  // Independent state for expanding / collapsing criteria drawers (so it never touches the checkbox!)
  const [expandedCriteria, setExpandedCriteria] = useState<Record<CriterionKey, boolean>>({
    overall: false,
    difficulty: false,
    usefulness: false,
    workload: false,
    interest: false
  });

  const toggleExpanded = (key: CriterionKey) => {
    setExpandedCriteria(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const resetFilters = () => {
    onFilterChange({
      searchQuery: '',
      languages: [],
      formats: [],
      departments: [],
      studentFaculty: '',
      onlyEligibleForMyFaculty: false,
      criteria: {
        overall: { enabled: false, min: 3.5, max: 5.0 },
        difficulty: { enabled: false, min: 1.0, max: 3.5 },
        usefulness: { enabled: false, min: 4.0, max: 5.0 },
        workload: { enabled: false, min: 1.0, max: 3.5 },
        interest: { enabled: false, min: 4.0, max: 5.0 }
      },
      sortPriorities: [...DEFAULT_SORT_PRIORITIES],
      generalSort: 'priority'
    });
  };

  const toggleLanguage = (lang: MinorLanguage) => {
    const next = filters.languages.includes(lang)
      ? filters.languages.filter(l => l !== lang)
      : [...filters.languages, lang];
    onFilterChange({ ...filters, languages: next });
  };

  const toggleFormat = (fmt: MinorFormat) => {
    const next = filters.formats.includes(fmt)
      ? filters.formats.filter(f => f !== fmt)
      : [...filters.formats, fmt];
    onFilterChange({ ...filters, formats: next });
  };

  const toggleDepartment = (dept: string) => {
    const next = filters.departments.includes(dept)
      ? filters.departments.filter(d => d !== dept)
      : [...filters.departments, dept];
    onFilterChange({ ...filters, departments: next });
  };

  // Toggle criterion enabled checkbox ONLY (independent from expand/collapse)
  const toggleCriterionEnabled = (key: CriterionKey, e: React.MouseEvent) => {
    e.stopPropagation(); // Do not trigger expand/collapse!
    const willBeEnabled = !filters.criteria[key].enabled;
    
    // If enabling, also expand so user can see/tweak the range
    if (willBeEnabled && !expandedCriteria[key]) {
      setExpandedCriteria(prev => ({ ...prev, [key]: true }));
    }

    onFilterChange({
      ...filters,
      criteria: {
        ...filters.criteria,
        [key]: {
          ...filters.criteria[key],
          enabled: willBeEnabled
        }
      }
    });
  };

  // Update criterion min and max
  const updateCriterionRange = (
    key: CriterionKey,
    field: 'min' | 'max',
    val: number
  ) => {
    const current = filters.criteria[key];
    let newMin = field === 'min' ? val : current.min;
    let newMax = field === 'max' ? val : current.max;

    if (newMin > newMax) {
      if (field === 'min') newMax = newMin;
      else newMin = newMax;
    }

    onFilterChange({
      ...filters,
      criteria: {
        ...filters.criteria,
        [key]: {
          ...current,
          min: Number(newMin.toFixed(1)),
          max: Number(newMax.toFixed(1))
        }
      }
    });
  };

  // Quick preset helper
  const setCriterionPreset = (
    key: CriterionKey,
    min: number,
    max: number
  ) => {
    onFilterChange({
      ...filters,
      criteria: {
        ...filters.criteria,
        [key]: {
          enabled: true,
          min,
          max
        }
      }
    });
  };

  // Multi-criteria priority sorting: Move item up/down
  const movePriority = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filters.sortPriorities.length) return;

    const newPriorities = [...filters.sortPriorities];
    const temp = newPriorities[index];
    newPriorities[index] = newPriorities[targetIndex];
    newPriorities[targetIndex] = temp;

    onFilterChange({
      ...filters,
      sortPriorities: newPriorities,
      generalSort: 'priority'
    });
  };

  // Toggle direction for a specific criterion in the priority list
  const togglePriorityDirection = (criterionKey: CriterionKey) => {
    const newPriorities = filters.sortPriorities.map(item => {
      if (item.criterion !== criterionKey) return item;
      return {
        ...item,
        direction: item.direction === 'desc' ? ('asc' as const) : ('desc' as const)
      };
    });

    onFilterChange({
      ...filters,
      sortPriorities: newPriorities,
      generalSort: 'priority'
    });
  };

  const getCriterionTitle = (key: CriterionKey) => {
    switch (key) {
      case 'overall': return 'Общий рейтинг';
      case 'difficulty': return 'Сложность сдачи';
      case 'usefulness': return 'Полезность';
      case 'workload': return 'Энергозатраты / Время';
      case 'interest': return 'Интересность';
    }
  };

  const getCriterionIcon = (key: CriterionKey) => {
    switch (key) {
      case 'overall': return <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />;
      case 'difficulty': return <Flame className="w-3.5 h-3.5 text-orange-500" />;
      case 'usefulness': return <Award className="w-3.5 h-3.5 text-emerald-600" />;
      case 'workload': return <Clock className="w-3.5 h-3.5 text-indigo-600" />;
      case 'interest': return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  const criteriaConfig: Array<{
    key: CriterionKey;
    title: string;
    icon: React.ReactNode;
    presets: Array<{ label: string; min: number; max: number }>;
  }> = [
    {
      key: 'overall',
      title: 'Общий рейтинг',
      icon: <Star className="w-4 h-4 text-amber-500 fill-amber-500" />,
      presets: [
        { label: 'Высокий (4.5+)', min: 4.5, max: 5.0 },
        { label: 'От 4.0 до 5.0', min: 4.0, max: 5.0 }
      ]
    },
    {
      key: 'difficulty',
      title: 'Сложность сдачи',
      icon: <Flame className="w-4 h-4 text-orange-500" />,
      presets: [
        { label: 'Легкие (1.0–2.8)', min: 1.0, max: 2.8 },
        { label: 'Хардкор (3.5–5.0)', min: 3.5, max: 5.0 }
      ]
    },
    {
      key: 'usefulness',
      title: 'Полезность для карьеры',
      icon: <Award className="w-4 h-4 text-emerald-600" />,
      presets: [
        { label: 'Максимум пользы (4.5+)', min: 4.5, max: 5.0 },
        { label: 'От 4.0 до 5.0', min: 4.0, max: 5.0 }
      ]
    },
    {
      key: 'workload',
      title: 'Энергозатраты и время',
      icon: <Clock className="w-4 h-4 text-indigo-600" />,
      presets: [
        { label: 'Минимум часов (до 2.8)', min: 1.0, max: 2.8 },
        { label: 'Интенсивные (3.5+)', min: 3.5, max: 5.0 }
      ]
    },
    {
      key: 'interest',
      title: 'Интересность курса',
      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
      presets: [
        { label: 'Топ интерес (4.7+)', min: 4.7, max: 5.0 },
        { label: 'От 4.0 до 5.0', min: 4.0, max: 5.0 }
      ]
    }
  ];

  const content = (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight font-sans">
            Фильтры
          </h2>
          <p className="text-xs text-slate-500">
            Найдено майноров: <span className="font-semibold text-slate-900">{totalResultsCount}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-medium px-2.5 py-1.5 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
            title="Сбросить все выбранные фильтры"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить</span>
          </button>

          {isMobileDrawer && (
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer touch-manipulation"
              title="Закрыть фильтры"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 
        Filter Body strictly in order requested by user:
        1. Мой факультет
        2. Язык
        3. Формат
        4. Департамент
        5. Критерии оценки и приоритеты сортировки
      */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
        
        {/* 1. Мой факультет в ВШЭ (First per user request) */}
        <div className="p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-xl space-y-2.5">
          <label className="flex items-center gap-2 text-xs font-bold text-blue-950 uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-blue-700" />
            <span>1. Мой факультет в ВШЭ</span>
          </label>
          <p className="text-[11px] text-blue-900/80 leading-relaxed">
            По регламенту ВШЭ нельзя выбирать майнор своего профиля:
          </p>
          <select
            value={filters.studentFaculty}
            onChange={(e) => onFilterChange({ ...filters, studentFaculty: e.target.value })}
            className="w-full text-xs bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
          >
            <option value="">— Не выбрано (показать все) —</option>
            {HSE_FACULTIES.map(fac => (
              <option key={fac} value={fac}>{fac}</option>
            ))}
          </select>

          {filters.studentFaculty && (
            <label className="flex items-center gap-2 text-xs text-slate-800 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.onlyEligibleForMyFaculty}
                onChange={(e) => onFilterChange({ ...filters, onlyEligibleForMyFaculty: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="font-medium text-blue-900">Скрыть недоступные для меня</span>
            </label>
          )}
        </div>

        {/* 2. Язык майнора (Second per user request) */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>2. Язык майнора</span>
          </label>
          <div className="space-y-2">
            {(['Русский', 'Английский'] as MinorLanguage[]).map((lang) => {
              const isChecked = filters.languages.includes(lang);
              return (
                <label
                  key={lang}
                  className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-slate-900 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleLanguage(lang)}
                    className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>{lang}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 3. Формат проведения (Third per user request) */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
            <Monitor className="w-3.5 h-3.5 text-slate-500" />
            <span>3. Формат проведения</span>
          </label>
          <div className="space-y-2">
            {(['Онлайн', 'Очно'] as MinorFormat[]).map((fmt) => {
              const isChecked = filters.formats.includes(fmt);
              return (
                <label
                  key={fmt}
                  className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-slate-900 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleFormat(fmt)}
                    className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5">
                    <span>{fmt}</span>
                    {fmt === 'Онлайн' && (
                      <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-medium">
                        большинство
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* 4. Департамент / Факультет (Fourth per user request) */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>4. Департамент / Факультет</span>
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {availableDepartments.map((dept) => {
              const isChecked = filters.departments.includes(dept);
              return (
                <label
                  key={dept}
                  className="flex items-start gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleDepartment(dept)}
                    className="mt-0.5 w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer shrink-0"
                  />
                  <span className="leading-tight">{dept}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 
          5. КРИТЕРИИ ОЦЕНКИ И МНОГОУРОВНЕВАЯ СОРТИРОВКА ПО ПРИОРИТЕТАМ
          User requirements:
          - "скрыть и развернуть не должно убирать галочку с категории"
          - "расположить все выбранные критерии из отзывов по приоритету"
        */}
        <div className="space-y-4 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              5. Критерии оценок студентов
            </label>
            <span className="text-[11px] text-slate-400">Галочка = фильтр</span>
          </div>

          {/* List of 5 Criteria with Independent Checkbox and Expand/Collapse */}
          <div className="space-y-2.5">
            {criteriaConfig.map((crit) => {
              const state = filters.criteria[crit.key];
              const isEnabled = state.enabled;
              const isExpanded = expandedCriteria[crit.key];

              return (
                <div
                  key={crit.key}
                  className={`rounded-xl border transition-all ${
                    isEnabled
                      ? 'bg-blue-50/40 border-blue-300 shadow-2xs'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Header Row: Checkbox is isolated, Row toggles expansion */}
                  <div
                    onClick={() => toggleExpanded(crit.key)}
                    className="flex items-center justify-between p-3 cursor-pointer select-none hover:bg-slate-50/80 rounded-xl"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Checkbox button: clicking toggles ONLY filtering, never affects collapse/expand! */}
                      <button
                        type="button"
                        onClick={(e) => toggleCriterionEnabled(crit.key, e)}
                        className="p-0.5 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        title={isEnabled ? 'Отключить фильтр' : 'Включить фильтр'}
                      >
                        {isEnabled ? (
                          <CheckSquare className="w-4 h-4 fill-blue-600 text-white" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>

                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-900">
                        {crit.icon}
                        <span>{crit.title}</span>
                      </div>
                    </div>

                    {/* Expand/Collapse Chevron (does NOT touch the checkbox!) */}
                    <div className="flex items-center gap-2 text-xs">
                      {isEnabled ? (
                        <span className="font-mono font-bold text-blue-800 bg-blue-100/70 px-1.5 py-0.5 rounded text-[11px]">
                          {state.min.toFixed(1)}–{state.max.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">фильтр выкл</span>
                      )}
                      <div className="p-1 text-slate-400 hover:text-slate-700">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Range Sliders */}
                  {isExpanded && (
                    <div className="px-3 pb-3.5 pt-1 border-t border-slate-200/70 space-y-3 animate-in fade-in duration-150">
                      
                      <div className="flex items-center justify-between text-xs text-slate-700 pt-1">
                        <span>Диапазон баллов:</span>
                        <span className="font-mono font-bold text-slate-900">
                          от <strong className="text-blue-700">{state.min.toFixed(1)}</strong> до <strong className="text-blue-700">{state.max.toFixed(1)}</strong> из 5
                        </span>
                      </div>

                      {/* Slider Min */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Минимум (от):</span>
                          <span className="font-mono font-bold text-slate-700">{state.min.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="5.0"
                          step="0.1"
                          value={state.min}
                          onChange={(e) => updateCriterionRange(crit.key, 'min', parseFloat(e.target.value))}
                          className="w-full accent-blue-600 cursor-pointer h-1.5"
                        />
                      </div>

                      {/* Slider Max */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Максимум (до):</span>
                          <span className="font-mono font-bold text-slate-700">{state.max.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="5.0"
                          step="0.1"
                          value={state.max}
                          onChange={(e) => updateCriterionRange(crit.key, 'max', parseFloat(e.target.value))}
                          className="w-full accent-blue-600 cursor-pointer h-1.5"
                        />
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {crit.presets.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setCriterionPreset(crit.key, preset.min, preset.max)}
                            className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 transition-colors cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 
            РАСПОЛОЖИТЬ КРИТЕРИИ ИЗ ОТЗЫВОВ ПО ПРИОРИТЕТУ СОРТИРОВКИ
            User requirement:
            "и возможность выбрать не только первый приоритет сортировки от большего к меньшему и от меньшего к большему, 
            а расположить все выбранные критерии из отзывов по приоритету"
          */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-700" />
                <span>Приоритеты сортировки</span>
              </label>
              <span className="text-[10px] text-slate-400">1-й, 2-й, 3-й...</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Управляйте порядком важности критериев стрелками [▲] [▼] и направлением (от большего/меньшего):
            </p>

            <div className="space-y-1.5">
              {filters.sortPriorities.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === filters.sortPriorities.length - 1;

                return (
                  <div
                    key={item.criterion}
                    className="flex items-center justify-between gap-1.5 p-2 bg-white rounded-lg border border-slate-200 shadow-2xs text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Priority rank badge */}
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] shrink-0 ${
                        index === 0
                          ? 'bg-blue-600 text-white shadow-xs'
                          : index === 1
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {index + 1}
                      </span>

                      <div className="flex items-center gap-1.5 font-semibold text-slate-800 truncate">
                        {getCriterionIcon(item.criterion)}
                        <span className="truncate">{getCriterionTitle(item.criterion)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Direction toggle button: ↓ От большего / ↑ От меньшего */}
                      <button
                        type="button"
                        onClick={() => togglePriorityDirection(item.criterion)}
                        className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                          item.direction === 'desc'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                            : 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100'
                        }`}
                        title={item.direction === 'desc' ? 'От большего к меньшему (кликните чтобы изменить)' : 'От меньшего к большему (кликните чтобы изменить)'}
                      >
                        {item.direction === 'desc' ? (
                          <>
                            <ArrowDown className="w-3 h-3 text-blue-700" />
                            <span>↓ Бол.</span>
                          </>
                        ) : (
                          <>
                            <ArrowUp className="w-3 h-3 text-orange-700" />
                            <span>↑ Мен.</span>
                          </>
                        )}
                      </button>

                      {/* Move Up */}
                      <button
                        type="button"
                        onClick={() => movePriority(index, 'up')}
                        disabled={isFirst}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer"
                        title="Поднять приоритет выше"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={() => movePriority(index, 'down')}
                        disabled={isLast}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer"
                        title="Опустить приоритет ниже"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* General Secondary Sort options */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Базовый режим:</span>
              <select
                value={filters.generalSort}
                onChange={(e) => onFilterChange({ ...filters, generalSort: e.target.value as any })}
                className="text-xs bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 cursor-pointer"
              >
                <option value="priority">По приоритетам выше</option>
                <option value="reviews">По числу отзывов</option>
                <option value="title">По названию (А–Я)</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Footer / Apply (mobile only) */}
      {isMobileDrawer && (
        <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-[#003B70] text-white font-semibold text-sm rounded-xl hover:bg-[#002d57] active:scale-[0.99] transition-all cursor-pointer shadow-xs touch-manipulation min-h-[46px]"
          >
            Применить фильтры ({totalResultsCount})
          </button>
        </div>
      )}
    </div>
  );

  // When used as mobile drawer:
  if (isMobileDrawer) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Slide-over panel */}
        <div className="fixed inset-y-0 right-0 w-full max-w-sm sm:max-w-md h-[100dvh] bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
          {content}
        </div>
      </div>
    );
  }

  // Desktop Sticky Sidebar (Strictly hidden on mobile/tablet via hidden lg:block)
  return (
    <aside className="hidden lg:block w-80 shrink-0">
      <div className="sticky top-20 rounded-2xl border border-slate-200 shadow-xs overflow-hidden max-h-[calc(100vh-6rem)] flex flex-col">
        {content}
      </div>
    </aside>
  );
};
