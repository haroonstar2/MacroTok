import { Coffee, Utensils, UtensilsCrossed, Trash2, Edit } from 'lucide-react';
import { Button, Card } from '../../lib/ui-components';

interface MealCardProps {
  type: 'breakfast' | 'lunch' | 'dinner';
  calories: number;
  dish?: string;
  onEdit?: () => void;
  onRemove?: () => void;
}

const mealIcons = {
  breakfast: Coffee,
  lunch: Utensils,
  dinner: UtensilsCrossed,
};

const mealColors = {
  breakfast: 'bg-amber-500/10 border-amber-500/30',
  lunch: 'bg-blue-500/10 border-blue-500/30',
  dinner: 'bg-purple-500/10 border-purple-500/30',
};

const mealIconColors = {
  breakfast: 'text-amber-500',
  lunch: 'text-blue-500',
  dinner: 'text-purple-500',
};

export function MealCard({ type, calories, dish, onEdit, onRemove }: MealCardProps) {
  const Icon = mealIcons[type];
  const colorClass = mealColors[type];
  const iconColorClass = mealIconColors[type];
  const isScheduled = !!dish;

  return (
    <Card 
      className={`meal-card meal-card-${type} p-4 border-2 ${colorClass} transition-all hover:shadow-md bg-[#1E2939]/40`}
      data-meal-type={type}
      data-has-dish={isScheduled}
      data-calories={calories}
    >
      <div className="meal-card-content flex items-start justify-between gap-3">
        {/* Meal Info Section */}
        <div className="meal-info-section flex items-start gap-3 flex-1">
          <div className={`meal-icon-container p-2 bg-[#101828] rounded-lg shadow-sm`}>
            <Icon className={`meal-icon w-5 h-5 ${iconColorClass}`} />
          </div>
          <div className="meal-details flex-1">
            <h3 className="meal-type-label capitalize text-white">{type}</h3>
            <p className="meal-dish-name text-sm text-gray-300 mt-1">
              {dish || 'Not scheduled'}
            </p>
          </div>
        </div>
        
        {/* Calories and Actions Section */}
        <div className="meal-actions-section text-right">
          <p className="meal-calories text-white">{calories} kcal</p>
          {isScheduled && (
            <div className="meal-action-buttons flex gap-1 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="edit-meal-button h-7 px-2 text-gray-300 hover:text-white hover:bg-[#314158]"
                data-action="edit-meal"
                aria-label={`Edit ${type} meal`}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="remove-meal-button h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                data-action="remove-meal"
                aria-label={`Remove ${type} meal`}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}