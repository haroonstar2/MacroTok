import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../lib/ui-components';

interface CalendarProps {
  selectedDate: number;
  onDateSelect: (date: number) => void;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(11); // December (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Previous month padding
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="calendar-card bg-white rounded-2xl p-8 shadow-sm border border-gray-100" data-component="calendar">
      {/* Calendar Header with Month Navigation */}
      <div className="calendar-header flex items-center justify-center mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={previousMonth}
          className="previous-month-button hover:bg-gray-100 text-gray-700 h-8 w-8"
          data-action="previous-month"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="current-month-display text-gray-900 text-base font-medium mx-8">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="next-month-button hover:bg-gray-100 text-gray-700 h-8 w-8"
          data-action="next-month"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-3 mb-3">
          {daysOfWeek.map((dayName) => (
            <div 
              key={dayName} 
              className="weekday-header text-center py-3 text-sm font-medium text-gray-500"
              data-day={dayName}
            >
              {dayName}
            </div>
          ))}
        </div>
        
        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-3">
          {generateCalendarDays().map((dayNumber, index) => (
            <button
              key={index}
              onClick={() => dayNumber && onDateSelect(dayNumber)}
              disabled={!dayNumber}
              className={`
                calendar-day-cell rounded-xl flex items-center justify-center text-sm font-medium
                transition-all duration-200
                ${!dayNumber ? 'invisible' : ''}
                ${
                  dayNumber === selectedDate
                    ? 'selected-day bg-[#1a2332] text-white shadow-md'
                    : 'unselected-day bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }
              `}
              style={{ 
                aspectRatio: '1 / 1',
                minHeight: '80px'
              }}
              data-day-number={dayNumber || 'empty'}
              data-selected={dayNumber === selectedDate}
              aria-label={dayNumber ? `Select day ${dayNumber}` : undefined}
            >
              {dayNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}