import React from 'react';

interface ChartProps {
  type?: 'line' | 'bar' | 'pie';
  data?: any;
  options?: any;
}

const Chart: React.FC<ChartProps> = () => {
  return (
    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Chart Placeholder</span>
      {/* In a real implementation, this would use a charting library like Chart.js or Recharts */}
    </div>
  );
};

export default Chart;
