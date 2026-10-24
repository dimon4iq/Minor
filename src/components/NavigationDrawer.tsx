import React, { useEffect } from 'react';
import { X, Home, Calendar, MessageSquarePlus, LifeBuoy, ExternalLink, ShieldCheck } from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome: () => void;
  onNavigateDeadlines: () => void;
  onOpenAddReview: () => void;
  onOpenFeedback: () => void;
  currentView: string;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateHome,
  onNavigateDeadlines,
  onOpenAddReview,
  onOpenFeedback,
  currentView
}) => {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll on mobile/tablet when drawer is open
  useEffect(() => {
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with touch dismiss */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-[85vw] max-w-xs sm:w-80 h-[100dvh] bg-white shadow-2xl flex flex-col justify-between border-r border-slate-200 animate-in slide-in-from-left duration-250 z-10">
          
          {/* Top Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#003B70] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                В
              </div>
              <div>
                <div className="font-bold text-base text-slate-900 tracking-tight leading-tight">
                  МАЙНОРЫ ВШЭ
                </div>
                <div className="text-[11px] text-slate-500">Навигация по порталу</div>
              </div>
            </div>
            
            {/* Big touch-friendly close button */}
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer touch-manipulation"
              title="Закрыть меню"
              aria-label="Закрыть меню"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links - Matching Photo 2: Главная, Сроки, Оставить отзыв на майнор */}
          <div className="flex-1 py-4 sm:py-6 px-3 sm:px-4 space-y-2 overflow-y-auto overscroll-contain">
            <button
              onClick={() => {
                onNavigateHome();
                onClose();
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left font-medium text-base transition-colors cursor-pointer touch-manipulation min-h-[48px] ${
                currentView === 'catalog'
                  ? 'bg-blue-50 text-blue-900 font-semibold shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Home className="w-5 h-5 text-[#003B70] shrink-0" />
              <span>Главная</span>
            </button>

            <button
              onClick={() => {
                onNavigateDeadlines();
                onClose();
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left font-medium text-base transition-colors cursor-pointer touch-manipulation min-h-[48px] ${
                currentView === 'deadlines'
                  ? 'bg-blue-50 text-blue-900 font-semibold shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-5 h-5 text-[#003B70] shrink-0" />
              <div className="flex items-center justify-between w-full">
                <span>Сроки</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                  Волны 2026
                </span>
              </div>
            </button>

            {/* Renamed per request: "Оставить отзыв на майнор" */}
            <button
              onClick={() => {
                onClose();
                onOpenAddReview();
              }}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left font-medium text-base text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer touch-manipulation min-h-[48px]"
            >
              <MessageSquarePlus className="w-5 h-5 text-[#003B70] shrink-0" />
              <span>Оставить отзыв на майнор</span>
            </button>

            {/* SmartLMS link */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <div className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Официальные сервисы
              </div>
              <a
                href="https://smartlms.hse.ru/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors min-h-[44px]"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  Портал SmartLMS
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Bottom Action - Matching Photo 2: Обратная связь с разработчиками */}
          <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50/80 shrink-0">
            <button
              onClick={() => {
                onClose();
                onOpenFeedback();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-xs sm:text-sm hover:bg-slate-100 hover:border-slate-400 active:scale-[0.98] transition-all shadow-xs cursor-pointer min-h-[44px]"
            >
              <LifeBuoy className="w-4 h-4 text-[#003B70] shrink-0" />
              <span className="font-bold tracking-tight">
                Обратная связь с разработчиками
              </span>
            </button>
            <div className="text-[10px] text-center text-slate-400 mt-2">
              Студенческий проект ВШЭ · 2026
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
