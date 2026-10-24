import React, { useState } from 'react';
import { X, Check, LifeBuoy, Send, Bug, Lightbulb } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [reason, setReason] = useState<'bug' | 'suggestion'>('bug');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setMessage('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
          
          {/* Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-[#003B70]" />
              <h3 className="font-bold text-lg text-slate-900">
                Обратная связь с разработчиками
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="p-10 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Спасибо за обратную связь!</h4>
              <p className="text-xs text-slate-600">
                Команда разработчиков получила ваше обращение и изучит его в ближайшее время.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Exactly 2 reasons per user request: "Нашёл баг" or "Пожелания или предложения" */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Причина обращения *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReason('bug')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      reason === 'bug'
                        ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Bug className={`w-4 h-4 ${reason === 'bug' ? 'text-rose-600' : 'text-slate-400'}`} />
                    <span>Нашёл баг</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReason('suggestion')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      reason === 'suggestion'
                        ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Lightbulb className={`w-4 h-4 ${reason === 'suggestion' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>Пожелания или предложения</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Ваше имя или никнейм
                </label>
                <input
                  type="text"
                  placeholder="Например: Студент 2 курса"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Корпоративная почта ВШЭ (@edu.hse.ru)
                </label>
                <input
                  type="email"
                  placeholder="example@edu.hse.ru"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  {reason === 'bug' ? 'Опишите найденный баг *' : 'Опишите ваше пожелание или идею *'}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={
                    reason === 'bug'
                      ? 'Опишите, что пошло не так, на каком экране или устройстве...'
                      : 'Какие функции или информацию о майнорах было бы полезно добавить...'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#003B70] hover:bg-[#002d57] rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Отправить разработчикам</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
