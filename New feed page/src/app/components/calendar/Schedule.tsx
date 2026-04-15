import { CalendarIcon } from 'lucide-react';
import { Card } from '../../lib/ui-components';
import { MealCard } from './MealCard';
import { MealData } from '../../types/meal';

interface ScheduleProps {
  selectedDate: number;
  mealData: MealData;
}

export function Schedule({ selectedDate, mealData }: ScheduleProps) {
  return (
    <Card 
      className="schedule-card p-6 shadow-lg bg-gradient-to-br from-[#1E2939] to-[#101828] border-[#314158]" 
      data-component="schedule"
      data-selected-date={selectedDate}
    >
      {/* Schedule Header */}
      <div className="schedule-header flex items-center gap-2 mb-4">
        <CalendarIcon className="schedule-icon w-5 h-5 text-[#4f39f6]" />
        <h3 className="schedule-date-title text-white">
          Wednesday, Dec {selectedDate}
        </h3>
      </div>

      {/* Meal Cards List */}
      <div className="meal-cards-container space-y-3">
        <MealCard
          type="breakfast"
          calories={mealData.breakfast.calories}
          dish={mealData.breakfast.dish}
        />
        <MealCard
          type="lunch"
          calories={mealData.lunch.calories}
          dish={mealData.lunch.dish}
        />
        <MealCard
          type="dinner"
          calories={mealData.dinner.calories}
          dish={mealData.dinner.dish}
        />
      </div>
    </Card>
  );
}