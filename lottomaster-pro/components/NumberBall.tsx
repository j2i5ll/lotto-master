import React from 'react';
import { getBallColor } from '../services/lottoService';

interface Props {
  num: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSelected?: boolean; // For highlighting in filters or selection
}

const NumberBall: React.FC<Props> = ({ num, size = 'md', isSelected = false }) => {
  const colorClass = getBallColor(num);
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs border',
    md: 'w-8 h-8 text-sm border-2',
    lg: 'w-10 h-10 text-base border-2',
    xl: 'w-16 h-16 text-2xl border-4 font-bold shadow-lg',
  };

  return (
    <div
      className={`
        rounded-full flex items-center justify-center font-bold shadow-md
        ${colorClass}
        ${sizeClasses[size]}
        ${isSelected ? 'ring-4 ring-white ring-opacity-50 scale-110 transition-transform' : ''}
      `}
    >
      {num}
    </div>
  );
};

export default NumberBall;