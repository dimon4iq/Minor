import React, { useState, useMemo, useEffect } from 'react';
import { Minor, FilterState, Review } from './types/minor';
import { INITIAL_MINORS } from './data/minorsData';
import { Header } from './components/Header';
import { NavigationDrawer } from './components/NavigationDrawer';
import { FiltersSidebar, DEFAULT_CRITERIA_FILTERS, DEFAULT_SORT_PRIORITIES } from './components/FiltersSidebar';
import { MinorCard } from './components/MinorCard';
import { MinorDetailView } from './components/MinorDetailView';
import { AddReviewModal } from './components/AddReviewModal';
import { DeadlinesView } from './components/DeadlinesView';
import { FeedbackModal } from './components/FeedbackModal';
import { Sparkles, SearchX } from 'lucide-react';

const STORAGE_KEY = 'hse_minors_catalog_v5';

export default function App() {
  // Load minors from localStorage if available
  const [minors, setMinors] = useState<Minor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load minors from localStorage:', e);
    }
    return INITIAL_MINORS;
  });

  // Save minors to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(minors));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [minors]);

  // View state
  const [currentView, setCurrentView] = useState<'catalog' | 'deadlines' | 'detail'>('catalog');
  const [selectedMinorId, setSelectedMinorId] = useState<string | null>(null);

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isDesktopFiltersVisible, setIsDesktopFiltersVisible] = useState(true); // Toggle hide/show desktop filters
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [reviewTargetMinorId, setReviewTargetMinorId] = useState<string | undefined>(undefined);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Filters State with 5 criteria and multi-level priority sorting
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    languages: [],
    formats: [],
    departments: [],
    studentFaculty: '',
    onlyEligibleForMyFaculty: false,
    criteria: DEFAULT_CRITERIA_FILTERS,
    sortPriorities: [...DEFAULT_SORT_PRIORITIES],
    generalSort: 'priority'
  });

  // Available unique departments
  const availableDepartments = useMemo(() => {
    const set = new Set<string>();
    minors.forEach(m => {
      set.add(m.department);
      set.add(m.facultyOwner);
    });
    return Array.from(set).sort();
  }, [minors]);

  // Active filters count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.languages.length > 0) count += filters.languages.length;
    if (filters.formats.length > 0) count += filters.formats.length;
    if (filters.departments.length > 0) count += filters.departments.length;
    if (filters.onlyEligibleForMyFaculty && filters.studentFaculty) count++;

    // Count active criteria checkboxes
    if (filters.criteria.overall.enabled) count++;
    if (filters.criteria.difficulty.enabled) count++;
    if (filters.criteria.usefulness.enabled) count++;
    if (filters.criteria.workload.enabled) count++;
    if (filters.criteria.interest.enabled) count++;

    return count;
  }, [filters]);

  // Selected Minor Object
  const selectedMinor = useMemo(() => {
    if (!selectedMinorId) return null;
    return minors.find(m => m.id === selectedMinorId) || null;
  }, [minors, selectedMinorId]);

  // Filtered and Multi-Criteria Priority Sorted Minors
  const filteredMinors = useMemo(() => {
    return minors.filter(minor => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = minor.title.toLowerCase().includes(q);
        const matchesCode = minor.code.toLowerCase().includes(q);
        const matchesDesc = minor.shortDescription.toLowerCase().includes(q) || minor.fullDescription.toLowerCase().includes(q);
        const matchesDept = minor.department.toLowerCase().includes(q) || minor.facultyOwner.toLowerCase().includes(q);
        const matchesTags = minor.tags.some(t => t.toLowerCase().includes(q));
        const matchesTeachers = minor.teachers.some(t => t.name.toLowerCase().includes(q));
        const matchesDisciplines = minor.disciplines.some(d => d.name.toLowerCase().includes(q));

        if (!matchesTitle && !matchesCode && !matchesDesc && !matchesDept && !matchesTags && !matchesTeachers && !matchesDisciplines) {
          return false;
        }
      }

      // 2. Languages
      if (filters.languages.length > 0 && !filters.languages.includes(minor.language)) {
        return false;
      }

      // 3. Formats
      if (filters.formats.length > 0 && !filters.formats.includes(minor.format)) {
        return false;
      }

      // 4. Departments
      if (filters.departments.length > 0) {
        const matchesDept = filters.departments.includes(minor.department) || filters.departments.includes(minor.facultyOwner);
        if (!matchesDept) return false;
      }

      // 5. Eligible for Student's Faculty
      if (filters.onlyEligibleForMyFaculty && filters.studentFaculty) {
        const isRestricted = minor.restrictedFaculties.some(rf =>
          rf.toLowerCase().includes(filters.studentFaculty.toLowerCase()) ||
          filters.studentFaculty.toLowerCase().includes(rf.toLowerCase())
        );
        if (isRestricted) return false;
      }

      // 6. Criteria Ranges (checks only when checkbox is enabled)
      const crit = filters.criteria;
      if (crit.overall.enabled) {
        if (minor.ratings.overall < crit.overall.min || minor.ratings.overall > crit.overall.max) return false;
      }
      if (crit.difficulty.enabled) {
        if (minor.ratings.difficulty < crit.difficulty.min || minor.ratings.difficulty > crit.difficulty.max) return false;
      }
      if (crit.usefulness.enabled) {
        if (minor.ratings.usefulness < crit.usefulness.min || minor.ratings.usefulness > crit.usefulness.max) return false;
      }
      if (crit.workload.enabled) {
        if (minor.ratings.workload < crit.workload.min || minor.ratings.workload > crit.workload.max) return false;
      }
      if (crit.interest.enabled) {
        if (minor.ratings.interest < crit.interest.min || minor.ratings.interest > crit.interest.max) return false;
      }

      return true;
    }).sort((a, b) => {
      // General secondary sorts
      if (filters.generalSort === 'reviews') {
        return b.ratings.reviewCount - a.ratings.reviewCount;
      }
      if (filters.generalSort === 'title') {
        return a.title.localeCompare(b.title, 'ru');
      }

      // Multi-criteria priority sorting (User can arrange priorities 1..5 with asc/desc directions)
      for (const item of filters.sortPriorities) {
        const valA = a.ratings[item.criterion];
        const valB = b.ratings[item.criterion];
        const diff = valA - valB;
        if (Math.abs(diff) > 0.05) {
          return item.direction === 'desc' ? -diff : diff;
        }
      }

      return b.ratings.overall - a.ratings.overall;
    });
  }, [minors, filters]);

  // Handlers
  const handleSelectMinor = (minor: Minor) => {
    setSelectedMinorId(minor.id);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAddReview = (targetMinorId?: string) => {
    setReviewTargetMinorId(targetMinorId || selectedMinorId || minors[0]?.id);
    setIsAddReviewOpen(true);
  };

  const handleSubmitNewReview = (newReview: Review) => {
    setMinors(prevMinors =>
      prevMinors.map(minor => {
        if (minor.id !== newReview.minorId) return minor;

        const updatedReviews = [newReview, ...minor.reviews];
        const count = updatedReviews.length;

        // Recalculate average ratings
        const sumOverall = updatedReviews.reduce((acc, r) => acc + r.ratings.overall, 0);
        const sumDiff = updatedReviews.reduce((acc, r) => acc + r.ratings.difficulty, 0);
        const sumUseful = updatedReviews.reduce((acc, r) => acc + r.ratings.usefulness, 0);
        const sumWorkload = updatedReviews.reduce((acc, r) => acc + r.ratings.workload, 0);
        const sumInterest = updatedReviews.reduce((acc, r) => acc + r.ratings.interest, 0);

        return {
          ...minor,
          ratings: {
            overall: Number((sumOverall / count).toFixed(1)),
            difficulty: Number((sumDiff / count).toFixed(1)),
            usefulness: Number((sumUseful / count).toFixed(1)),
            workload: Number((sumWorkload / count).toFixed(1)),
            interest: Number((sumInterest / count).toFixed(1)),
            reviewCount: count,
            recommendPercent: Math.min(99, Math.round((updatedReviews.filter(r => r.ratings.overall >= 4).length / count) * 100))
          },
          reviews: updatedReviews
        };
      })
    );
  };

  // Get Priority 1 Title for description
  const topPriorityItem = filters.sortPriorities[0];

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(true)}
        searchQuery={filters.searchQuery}
        onSearchChange={(query) => setFilters(prev => ({ ...prev, searchQuery: query }))}
        isDesktopFiltersVisible={isDesktopFiltersVisible}
        onToggleDesktopFilters={() => setIsDesktopFiltersVisible(prev => !prev)}
        onToggleMobileDrawer={() => setIsFilterDrawerOpen(prev => !prev)}
        activeFilterCount={activeFilterCount}
        currentView={currentView}
        onNavigateHome={() => {
          setSelectedMinorId(null);
          setCurrentView('catalog');
        }}
      />

      {/* Navigation Drawer */}
      <NavigationDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigateHome={() => {
          setSelectedMinorId(null);
          setCurrentView('catalog');
        }}
        onNavigateDeadlines={() => setCurrentView('deadlines')}
        onOpenAddReview={() => handleOpenAddReview()}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        currentView={currentView}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'detail' && selectedMinor ? (
          <MinorDetailView
            minor={selectedMinor}
            onBack={() => {
              setSelectedMinorId(null);
              setCurrentView('catalog');
            }}
            onOpenAddReview={(mId) => handleOpenAddReview(mId)}
            studentFaculty={filters.studentFaculty}
          />
        ) : currentView === 'deadlines' ? (
          <DeadlinesView
            onBackToCatalog={() => setCurrentView('catalog')}
          />
        ) : (
          /* Catalog View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Hero Information Strip */}
            <div className="mb-6 bg-gradient-to-r from-[#003B70] via-[#084b8a] to-[#0f5a9e] text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="relative z-10 max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide text-blue-100">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Каталог майноров НИУ ВШЭ 2025/2026</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Выбирайте майнор осознанно
                </h1>
                <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-sans">
                  Официальные учебные планы, формулы оценок, рейтинги по 5 критериям и честные отзывы студентов. Наведите на карточку, чтобы увидеть краткое описание и нажать «Далее...».
                </p>
              </div>

              <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
            </div>

            {/* Layout Split: Left Filter Sidebar + Right Cards Grid */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Desktop Filter Sidebar: visible if isDesktopFiltersVisible is true */}
              {isDesktopFiltersVisible && (
                <FiltersSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  availableDepartments={availableDepartments}
                  totalResultsCount={filteredMinors.length}
                />
              )}

              {/* Mobile Filter Drawer (opens on mobile/tablet when isFilterDrawerOpen is true) */}
              <FiltersSidebar
                isMobileDrawer
                isOpen={isFilterDrawerOpen}
                onClose={() => setIsFilterDrawerOpen(false)}
                filters={filters}
                onFilterChange={setFilters}
                availableDepartments={availableDepartments}
                totalResultsCount={filteredMinors.length}
              />

              {/* Grid of Cards */}
              <div className="flex-1 w-full min-w-0">
                
                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200">
                  <div className="text-sm text-slate-600">
                    Найдено <strong className="text-slate-900 font-semibold">{filteredMinors.length}</strong> {
                      filteredMinors.length === 1 ? 'майнор' : (filteredMinors.length >= 2 && filteredMinors.length <= 4) ? 'майнора' : 'майноров'
                    }
                    {filters.studentFaculty && (
                      <span className="hidden sm:inline text-xs text-slate-500 ml-2">
                        · Факультет: <strong>{filters.studentFaculty}</strong>
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>
                      1-й приоритет сортировки:{' '}
                      <strong className="text-slate-800">
                        {topPriorityItem.criterion === 'overall' && 'Общий рейтинг'}
                        {topPriorityItem.criterion === 'difficulty' && 'Сложность сдачи'}
                        {topPriorityItem.criterion === 'usefulness' && 'Полезность'}
                        {topPriorityItem.criterion === 'workload' && 'Энергозатраты'}
                        {topPriorityItem.criterion === 'interest' && 'Интересность'}
                      </strong>
                      {' '}({topPriorityItem.direction === 'desc' ? 'от большего' : 'от меньшего'})
                    </span>

                    {!isDesktopFiltersVisible && (
                      <button
                        onClick={() => setIsDesktopFiltersVisible(true)}
                        className="hidden lg:inline text-blue-700 font-semibold hover:underline cursor-pointer ml-1"
                      >
                        (Показать фильтры)
                      </button>
                    )}
                  </div>
                </div>

                {filteredMinors.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <SearchX className="w-12 h-12 text-slate-400 mx-auto" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Ничего не найдено по заданным критериям
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Попробуйте расширить диапазон оценок в активных фильтрах или сбросить настройки.
                      </p>
                    </div>
                    <button
                      onClick={() => setFilters({
                        searchQuery: '',
                        languages: [],
                        formats: [],
                        departments: [],
                        studentFaculty: '',
                        onlyEligibleForMyFaculty: false,
                        criteria: DEFAULT_CRITERIA_FILTERS,
                        sortPriorities: [...DEFAULT_SORT_PRIORITIES],
                        generalSort: 'priority'
                      })}
                      className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Сбросить все фильтры
                    </button>
                  </div>
                ) : (
                  <div className={`grid gap-6 ${
                    isDesktopFiltersVisible
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                  }`}>
                    {filteredMinors.map((minor) => (
                      <MinorCard
                        key={minor.id}
                        minor={minor}
                        onSelect={handleSelectMinor}
                        studentFaculty={filters.studentFaculty}
                        activeCriteria={filters.criteria}
                        topPriority={topPriorityItem}
                        generalSort={filters.generalSort}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}
      </main>

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={isAddReviewOpen}
        onClose={() => setIsAddReviewOpen(false)}
        minors={minors}
        preselectedMinorId={reviewTargetMinorId}
        onSubmitReview={handleSubmitNewReview}
      />

      {/* Feedback Modal with Developers */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[#003B70] text-white flex items-center justify-center font-bold text-xs">
              В
            </div>
            <span>© 2026 Студенческий портал выбора майноров НИУ ВШЭ</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={() => setCurrentView('deadlines')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Сроки и регламенты
            </button>
            <span>·</span>
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Обратная связь с разработчиками
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
