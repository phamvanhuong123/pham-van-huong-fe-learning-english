import React from 'react';

interface PartBreakdownChartProps {
  breakdown: Record<string, { total: number; correct: number }>;
}

export const PartBreakdownChart: React.FC<PartBreakdownChartProps> = ({ breakdown }) => {
  const parts = ['PART1', 'PART2', 'PART3', 'PART4', 'PART5', 'PART6', 'PART7'];
  
  return (
    <div className="space-y-5 mt-2">
      {parts.map(part => {
        const data = breakdown[part];
        if (!data) return null;
        
        const percentage = Math.round((data.correct / data.total) * 100);
        let colorClass = "bg-green-500";
        if (percentage < 50) colorClass = "bg-red-500";
        else if (percentage < 70) colorClass = "bg-yellow-500";

        return (
          <div key={part} className="flex items-center gap-4">
            <div className="w-16 shrink-0 text-sm font-bold text-gray-700">
              {part.replace('PART', 'Part ')}
            </div>
            
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            
            <div className="w-20 shrink-0 text-right">
              <span className="text-sm font-semibold text-gray-900">{data.correct}/{data.total}</span>
              <span className="text-xs text-gray-400 ml-1">({percentage}%)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
