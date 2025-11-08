'use client';

import { getCrowdLevelDisplay, type CrowdLevel } from '@/lib/crowd-level';

interface CrowdLevelBadgeProps {
  level: CrowdLevel;
  reasoning?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Crowd Level Badge Component
 * 
 * Displays a crowd level indicator with icon and color coding
 */
export function CrowdLevelBadge({
  level,
  reasoning,
  showIcon = true,
  size = 'md',
}: CrowdLevelBadgeProps) {
  const display = getCrowdLevelDisplay(level);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full ${display.bgColor} ${display.color} border border-current/20 ${sizeClasses[size]}`}
      title={reasoning || `Expected crowd level: ${display.label}`}
    >
      {showIcon && <span>{display.icon}</span>}
      <span className="font-semibold">Crowd: {display.label}</span>
      {reasoning && (
        <span className="opacity-80 cursor-help" title={reasoning}>
          ℹ️
        </span>
      )}
    </div>
  );
}

