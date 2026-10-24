import React from 'react';
import { Menu, Search, SlidersHorizontal, EyeOff } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDesktopFiltersVisible: boolean;
  onToggleDesktopFilters: () => void;
  onToggleMobileDrawer: () => void;
  activeFilterCount: number;
  currentView: 'catalog' | 'deadlines' | 'detail';
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  isDesktopFiltersVisible,
  onToggleDesktopFilters,
  onToggleMobileDrawer,
  activeFilterCount,
  currentView,
  onNavigateHome
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4 md:gap-6">
          
          {/* Left Zone: Hamburger & Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onToggleSidebar}
              className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-blue-600"
              aria-label="Открыть меню навигации"
              title="Главное меню"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button 
              onClick={onNavigateHome}
              className="flex items-center gap-2 text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 rounded-lg select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#003B70] flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-xs group-hover:bg-[#00284d] transition-colors shrink-0">
                В
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-lg md:text-xl tracking-tight text-slate-900 block leading-tight font-sans whitespace-nowrap">
                  МАЙНОРЫ ВШЭ
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 hidden md:block leading-none font-medium">
                  Справочник и отзывы студентов 2025/2026
                </span>
              </div>
            </button>
          </div>

          {/* Middle Zone: Search Bar */}
          <div className="flex-1 min-w-[120px] max-w-xl mx-1 sm:mx-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Поиск майнора..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentView !== 'catalog') {
                    onNavigateHome();
                  }
                }}
                className="w-full pl-9 sm:pl-10 pr-7 sm:pr-8 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1 cursor-pointer touch-manipulation"
                  title="Очистить поиск"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 
            Right Zone: Filter Toggle Button
            - On Desktop (PC): toggles hiding and showing desktop filters sidebar
            - On Mobile/Tablet: opens mobile drawer
          */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Desktop Button */}
            <button
              onClick={onToggleDesktopFilters}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-all cursor-pointer ${
                isDesktopFiltersVisible
                  ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title={isDesktopFiltersVisible ? 'Скрыть панель фильтров' : 'Показать панель фильтров'}
            >
              {isDesktopFiltersVisible ? (
                <EyeOff className="w-4 h-4 text-blue-600" />
              ) : (
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              )}
              <span>{isDesktopFiltersVisible ? 'Скрыть фильтры' : 'Показать фильтры'}</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold bg-blue-600 text-white rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Mobile / Tablet Button */}
            <button
              onClick={onToggleMobileDrawer}
              className={`lg:hidden flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-all cursor-pointer touch-manipulation min-h-[38px] ${
                activeFilterCount > 0
                  ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Фильтры майноров"
              aria-label="Фильтры"
            >
              <SlidersHorizontal className="w-4 h-4 text-current" />
              <span className="inline sm:inline">Фильтры</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-[11px] font-bold bg-blue-600 text-white rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
