import React, { memo } from 'react';

export type ChartTimeframe = '24h' | '7d';

interface TimeframeSelectorProps {
  selected: ChartTimeframe;
  onChange: (timeframe: ChartTimeframe) => void;
}

const TIMEFRAMES: { value: ChartTimeframe; label: string; tooltip: string }[] = [
  { value: '24h', label: '24H', tooltip: 'Last 24 hours' },
  { value: '7d', label: '7D', tooltip: 'Last 7 days' },
];

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = memo(({ selected, onChange }) => {
  return (
    <div className="flex items-center gap-0.5 bg-gray-800/50 rounded-lg p-0.5">
      {TIMEFRAMES.map(({ value, label, tooltip }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          title={tooltip}
          className={`px-2 py-0.5 text-[10px] font-medium rounded transition-all ${
            selected === value
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
});
