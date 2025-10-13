// CustomTooltip component for Recharts with dark mode support
import React from 'react';
import './CustomTooltip.css';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        {label && <p className="tooltip-label">{label}</p>}
        <div className="tooltip-content">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="tooltip-item">
              <span className="tooltip-name" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="tooltip-value">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
