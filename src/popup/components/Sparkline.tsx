import React, { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showArea?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 100,
  height = 30,
  color = '#00ff88',
  showArea = true,
}) => {
  const { points, areaPath } = useMemo(() => {
    if (!data || data.length === 0) {
      return { points: '', areaPath: '', minY: 0, maxY: 0 };
    }

    // Sample data if too many points (for performance)
    const sampledData = data.length > 50 
      ? data.filter((_, i) => i % Math.ceil(data.length / 50) === 0 || i === data.length - 1)
      : data;

    const min = Math.min(...sampledData);
    const max = Math.max(...sampledData);
    const range = max - min || 1; // Avoid division by zero

    const padding = 2; // Small padding to avoid clipping
    const effectiveHeight = height - padding * 2;

    const pointsArray = sampledData.map((value, index) => {
      const x = (index / (sampledData.length - 1)) * width;
      const y = padding + effectiveHeight - ((value - min) / range) * effectiveHeight;
      return { x, y };
    });

    const linePoints = pointsArray.map(p => `${p.x},${p.y}`).join(' ');
    
    // Create area path for gradient fill
    const firstPoint = pointsArray[0];
    const lastPoint = pointsArray[pointsArray.length - 1];
    const area = `M ${firstPoint.x},${height} L ${linePoints.replace(/,/g, ' L ').replace(/ L /, ',')} L ${lastPoint.x},${height} Z`;

    return { 
      points: linePoints, 
      areaPath: area,
    };
  }, [data, width, height]);

  if (!data || data.length === 0) {
    return (
      <div 
        style={{ width, height }} 
        className="flex items-center justify-center text-[#8da4d4]/40 text-xs"
      >
        No data
      </div>
    );
  }

  // Generate unique ID for gradient
  const gradientId = `sparkline-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg width={width} height={height} className="inline-block overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      {showArea && (
        <path
          d={areaPath}
          fill={`url(#${gradientId})`}
        />
      )}
      
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-sm"
      />
      
      {/* End point dot */}
      {points && (
        <circle
          cx={width}
          cy={points.split(' ').pop()?.split(',')[1]}
          r="2"
          fill={color}
          className="drop-shadow-sm"
        />
      )}
    </svg>
  );
};
