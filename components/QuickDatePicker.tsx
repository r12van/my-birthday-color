'use client';

import { useState, useId } from 'react';
import { useRouter } from 'next/navigation';

interface QuickDatePickerProps {
  initialMonth?: number;
  initialDay?: number;
  className?: string;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function getDaysInMonth(month: number): number {
  if (month === 2) return 29; // 366 hari (termasuk kabisat)
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

export default function QuickDatePicker({
  initialMonth,
  initialDay,
  className = ''
}: QuickDatePickerProps) {
  const router = useRouter();
  const today = new Date();
  const daySelectId = useId();
  const monthSelectId = useId();

  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    return initialMonth && initialMonth >= 1 && initialMonth <= 12
      ? initialMonth
      : today.getMonth() + 1;
  });

  const [selectedDay, setSelectedDay] = useState<number>(() => {
    return initialDay && initialDay >= 1 && initialDay <= 31
      ? initialDay
      : today.getDate();
  });

  const maxDays = getDaysInMonth(selectedMonth);

  const handleMonthChange = (newMonth: number) => {
    setSelectedMonth(newMonth);
    const newMaxDays = getDaysInMonth(newMonth);
    if (selectedDay > newMaxDays) {
      setSelectedDay(newMaxDays);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/warna/${selectedMonth}/${selectedDay}`);
  };

  const handleSetToday = () => {
    const m = today.getMonth() + 1;
    const d = today.getDate();
    setSelectedMonth(m);
    setSelectedDay(d);
    router.push(`/warna/${m}/${d}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-lg border border-gray-200/80 dark:border-gray-700/80 max-w-xl mx-auto ${className}`}
      aria-label="Pencarian cepat warna kelahiran"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="flex items-center gap-2 flex-1">
          {/* Dropdown Tanggal */}
          <div className="flex-1 min-w-[90px]">
            <label htmlFor={daySelectId} className="sr-only">Tanggal</label>
            <div className="relative">
              <select
                id={daySelectId}
                value={selectedDay}
                onChange={(e) => setSelectedDay(parseInt(e.target.value, 10))}
                className="w-full appearance-none bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-bold text-sm px-3.5 py-2.5 pr-8 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm transition-all"
              >
                {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                ▼
              </span>
            </div>
          </div>

          {/* Dropdown Bulan */}
          <div className="flex-1 min-w-[130px]">
            <label htmlFor={monthSelectId} className="sr-only">Bulan</label>
            <div className="relative">
              <select
                id={monthSelectId}
                value={selectedMonth}
                onChange={(e) => handleMonthChange(parseInt(e.target.value, 10))}
                className="w-full appearance-none bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-bold text-sm px-3.5 py-2.5 pr-8 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm transition-all"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="flex-1 sm:flex-initial cursor-pointer bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span>Cek Warna</span>
            <span aria-hidden="true">→</span>
          </button>

          <button
            type="button"
            onClick={handleSetToday}
            title="Lihat warna hari ini"
            className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 text-gray-700 dark:text-gray-200 font-semibold text-xs px-3 py-2.5 rounded-xl border border-gray-300/80 dark:border-gray-600 shadow-sm transition-all duration-200 whitespace-nowrap"
          >
            ✨ Hari Ini
          </button>
        </div>
      </div>
    </form>
  );
}
