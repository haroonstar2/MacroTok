import { Target, TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '../../lib/ui-components';
import { Progress } from '../ui/progress';
import { MealData } from '../../types/meal';

interface GoalProps {
  dailyGoal: number;
  mealData: MealData;
}

export function Goal({ dailyGoal, mealData }: GoalProps) {
  const totalCalories = mealData.breakfast.calories + mealData.lunch.calories + mealData.dinner.calories;
  const progressPercentage = (totalCalories / dailyGoal) * 100;
  const isUnderGoal = totalCalories < dailyGoal;
  const caloriesDifference = Math.abs(totalCalories - dailyGoal);

  return (
    <Card 
      className="goal-card p-6 shadow-lg bg-gradient-to-br from-[#1E2939] to-[#101828] border-[#314158]" 
      data-component="goal"
      data-total-calories={totalCalories}
      data-daily-goal={dailyGoal}
      data-status={isUnderGoal ? 'under-goal' : 'over-goal'}
    >
      {/* Goal Header */}
      <div className="goal-header flex items-center justify-between mb-4">
        <div className="goal-title-section flex items-center gap-2">
          <Target className="goal-icon w-5 h-5 text-white" />
          <h3 className="goal-title text-white">Daily Goal</h3>
        </div>
        <p 
          className="calorie-counter text-white"
          aria-label={`${totalCalories} of ${dailyGoal} calories consumed`}
        >
          {totalCalories} / {dailyGoal} kcal
        </p>
      </div>

      {/* Progress Bar */}
      <Progress 
        value={progressPercentage} 
        className="goal-progress-bar mb-4 h-3 bg-[#314158]"
        aria-label={`${Math.round(progressPercentage)}% of daily calorie goal`}
      />

      {/* Goal Status Footer */}
      <div className="goal-footer flex items-center justify-between">
        <div className="goal-status-message flex items-center gap-2">
          {isUnderGoal ? (
            <>
              <TrendingDown className="trend-icon-down w-4 h-4 text-[#22c55e]" />
              <span 
                className="status-text-under text-sm text-[#22c55e]"
                data-difference={caloriesDifference}
              >
                {caloriesDifference} kcal below goal
              </span>
            </>
          ) : (
            <>
              <TrendingUp className="trend-icon-up w-4 h-4 text-amber-500" />
              <span 
                className="status-text-over text-sm text-amber-400"
                data-difference={caloriesDifference}
              >
                {caloriesDifference} kcal over goal
              </span>
            </>
          )}
        </div>
        <div
          className={`progress-percentage-badge px-3 py-1 rounded-full text-sm ${
            isUnderGoal
              ? 'under-goal-badge bg-gradient-to-r from-[#22c55e]/20 to-[#22c55e]/30 text-[#22c55e]'
              : 'over-goal-badge bg-amber-500/20 text-amber-400'
          }`}
          data-percentage={Math.round(progressPercentage)}
        >
          {Math.round(progressPercentage)}%
        </div>
      </div>
    </Card>
  );
}