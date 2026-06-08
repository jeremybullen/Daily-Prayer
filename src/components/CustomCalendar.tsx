import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CustomCalendar({ 
  currentDate, 
  onSelectDate, 
  onClose,
  completedReadings = []
}: { 
  currentDate: Date, 
  onSelectDate: (d: Date) => void, 
  onClose: () => void,
  completedReadings?: string[]
}) {
  const [viewDate, setViewDate] = useState(new Date(currentDate));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
      <motion.div 
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-5 w-full min-w-[280px] max-w-[320px]"
      >
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div className="font-serif text-base font-medium text-slate-800 dark:text-slate-200">
            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
          </div>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {dayNames.map(d => (
            <div key={d} className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 py-1">
              {d}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {blanks.map(b => (
            <div key={`blank-${b}`} className="aspect-square"></div>
          ))}
          {days.map(d => {
            const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isSelected = 
              d === currentDate.getDate() && 
              viewDate.getMonth() === currentDate.getMonth() && 
              viewDate.getFullYear() === currentDate.getFullYear();
              
            const isToday = 
              d === new Date().getDate() && 
              viewDate.getMonth() === new Date().getMonth() && 
              viewDate.getFullYear() === new Date().getFullYear();

            const morningCompleted = completedReadings.includes(`${dateStr}-morning`) || completedReadings.includes(dateStr);
            const eveningCompleted = completedReadings.includes(`${dateStr}-evening`) || completedReadings.includes(dateStr);

            return (
              <button
                key={d}
                onClick={() => {
                  onSelectDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));
                  onClose();
                }}
                className={`
                  aspect-square rounded-full flex flex-col items-center justify-center text-xs transition-all relative overflow-hidden
                  ${isSelected ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-bold shadow-sm' : 
                    isToday ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold' : 
                    'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                `}
              >
                <span className="z-10">{d}</span>
                <div className="absolute bottom-1 w-full flex justify-center gap-0.5 z-10">
                  {morningCompleted && (
                    <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-amber-400 dark:bg-amber-500' : 'bg-amber-500 dark:bg-amber-400'}`} />
                  )}
                  {eveningCompleted && (
                    <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-indigo-400 dark:bg-indigo-500' : 'bg-indigo-500 dark:bg-indigo-400'}`} />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </motion.div>
  );
}
