'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconColorClass = 'text-gray-900',
  iconBgClass = 'bg-gray-100'
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
        <span className="text-2xl font-bold font-display text-gray-900 mt-1">{value}</span>
        {description && <span className="text-[10px] text-gray-500 mt-1">{description}</span>}
      </div>
      
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClass}`}>
        <Icon className={`w-6 h-6 ${iconColorClass}`} />
      </div>
    </div>
  );
}
