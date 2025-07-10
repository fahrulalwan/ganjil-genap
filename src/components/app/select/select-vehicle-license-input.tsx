import { CheckCircle2 } from 'lucide-react';
import { memo } from 'react';
import { cn } from '@/lib/utils';

const SelectVehicleLicenseInput = ({
  value,
  label,
  numbers,
  isSelected,
  onSelect,
}: {
  value: 'even' | 'odd';
  label: string;
  numbers: string;
  isSelected: boolean;
  onSelect: (value: 'even' | 'odd') => void;
}) => {
  // Memoize the keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(value);
    }
  };

  const getVariantClasses = () => {
    if (!isSelected) {
      return 'border-border hover:border-border/80 dark:hover:border-border/60';
    }

    const gradient =
      value === 'even'
        ? 'from-blue-600 to-cyan-600'
        : 'from-indigo-600 to-purple-600';

    return `bg-gradient-to-br text-white border-transparent shadow-lg scale-[1.02] ${gradient}`;
  };

  return (
    <label
      className={cn(
        'relative flex flex-col items-center p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer',
        'hover:bg-accent/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        getVariantClasses(),
      )}
    >
      <input
        type="radio"
        className="sr-only peer"
        name="plateType"
        value={value}
        checked={isSelected}
        onChange={() => onSelect(value)}
        aria-describedby={`plate-${value}-description`}
        onKeyDown={handleKeyDown}
      />
      <div className="text-center space-y-2">
        <div className="text-3xl font-bold tracking-tight">{label}</div>
        <div
          id={`plate-${value}-description`}
          className={cn(
            'text-sm font-medium',
            isSelected ? 'text-white/90' : 'text-foreground/80',
          )}
        >
          {numbers}
        </div>
        {isSelected && (
          <CheckCircle2
            className="w-5 h-5 mx-auto mt-2 animate-in fade-in-50 zoom-in-50 duration-300 text-white"
            aria-hidden="true"
          />
        )}
      </div>
    </label>
  );
};

export default memo(SelectVehicleLicenseInput);
